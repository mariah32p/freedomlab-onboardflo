import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useSessionProgress } from '../hooks/useSessionProgress';
import FileUpload from '../components/FileUpload';
import ConcurrentEditNotification from '../components/ConcurrentEditNotification';
import { generateSessionToken, isValidSessionToken } from '../utils/sessionToken';
import { 
  CheckCircle, 
  Lock, 
  Eye, 
  EyeOff, 
  Link as LinkIcon, 
  Mail,
  ArrowLeft,
  ArrowRight,
  User,
  Building,
  X,
  Sparkles,
  Clock,
  Users,
  Shield,
  Plus,
  Play
} from 'lucide-react';
import { Checklist, ChecklistStep } from '../types/checklist';

interface CustomerData {
  email: string;
  company: string;
  name: string;
}

export default function PublicChecklistPage() {
  const { checklistId, sessionToken: urlSessionToken } = useParams<{ 
    checklistId: string; 
    sessionToken?: string; 
  }>();
  const navigate = useNavigate();
  
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [steps, setSteps] = useState<ChecklistStep[]>([]);
  const [branding, setBranding] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showNewSessionForm, setShowNewSessionForm] = useState(false);
  const [creatingSession, setCreatingSession] = useState(false);
  
  // Local state for immediate UI updates
  const [localStepValues, setLocalStepValues] = useState<Record<string, string>>({});
  
  const [customerData, setCustomerData] = useState<CustomerData>({
    email: '',
    company: '',
    name: '',
  });

  // Only use session progress hook if we have a session token
  const hasSessionToken = urlSessionToken && isValidSessionToken(urlSessionToken);
  
  const {
    session,
    progress,
    saving,
    error: sessionError,
    otherActiveUsers,
    showConcurrentEditNotification,
    createSession,
    saveStepProgress,
    removeStepProgress,
    completeSession,
    isStepCompleted,
    getStepProgress,
    getCompletionPercentage,
    updateSessionInfo,
  } = useSessionProgress({ 
    checklistId: checklistId || '', 
    sessionToken: urlSessionToken || ''
  });

  useEffect(() => {
    if (checklistId) {
      fetchChecklistData();
    }
  }, [checklistId]);

  // Update local values when progress changes
  useEffect(() => {
    if (hasSessionToken) {
      const initialValues: Record<string, string> = {};
      progress.forEach(p => {
        initialValues[p.step_id] = p.notes;
      });
      setLocalStepValues(initialValues);
    }
  }, [progress, hasSessionToken]);

  const fetchChecklistData = async () => {
    if (!checklistId) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch checklist data
      const { data: checklistData, error: checklistError } = await supabase
        .from('checklists')
        .select('*')
        .eq('id', checklistId)
        .maybeSingle();

      if (checklistError) {
        throw checklistError;
      }

      if (!checklistData) {
        setError('Checklist not found');
        return;
      }

      // Check if checklist is public or if we need password
      if (!checklistData.is_public && !isAuthenticated) {
        setChecklist(checklistData);
        setLoading(false);
        return;
      }

      setChecklist(checklistData);

      // Fetch steps
      const { data: stepsData, error: stepsError } = await supabase
        .from('checklist_steps')
        .select('*')
        .eq('checklist_id', checklistId)
        .order('order_index', { ascending: true });

      if (stepsError) throw stepsError;

      setSteps(stepsData || []);

      // Fetch branding
      const { data: brandingData, error: brandingError } = await supabase
        .from('user_branding')
        .select('*')
        .eq('user_id', checklistData.user_id)
        .maybeSingle();

      if (brandingError && brandingError.code !== 'PGRST116') {
        console.warn('Could not fetch branding:', brandingError);
      }

      setBranding(brandingData);
      
    } catch (err) {
      console.error('Error fetching checklist:', err);
      setError('Failed to load checklist');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (checklist && password === checklist.password_hash) {
      setIsAuthenticated(true);
      fetchChecklistData();
    } else {
      setError('Incorrect password');
    }
  };

  const handleCreateNewSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerData.email.trim()) {
      setError('Email is required');
      return;
    }

    setCreatingSession(true);
    setError(null);

    try {
      // Generate new session token
      const newSessionToken = generateSessionToken();

      // Create session in database
      const { data: newSession, error: createError } = await supabase
        .from('customer_sessions')
        .insert({
          checklist_id: checklistId,
          session_token: newSessionToken,
          email: customerData.email,
          name: customerData.name,
          company: customerData.company,
          submission_status: 'started',
          started_at: new Date().toISOString(),
          is_active: true,
        })
        .select()
        .single();

      if (createError) throw createError;

      // Redirect to the session URL
      navigate(`/c/${checklistId}/${newSessionToken}`, { replace: true });
    } catch (err) {
      console.error('Error creating session:', err);
      setError('Failed to create session. Please try again.');
    } finally {
      setCreatingSession(false);
    }
  };

  const handleStepChange = async (stepId: string, value: string | boolean) => {
    if (!hasSessionToken) return;

    // Update local state immediately for responsive UI
    if (typeof value === 'string') {
      setLocalStepValues(prev => ({
        ...prev,
        [stepId]: value
      }));
    }

    // Save immediately to database
    if (typeof value === 'boolean') {
      if (value) {
        await saveStepProgress(stepId, '');
      } else {
        await removeStepProgress(stepId);
      }
    } else {
      if (value.trim()) {
        await saveStepProgress(stepId, value);
      } else {
        await removeStepProgress(stepId);
      }
    }
  };

  const handleComplete = async () => {
    if (!checklist || !session) return;

    // Check if all required steps are completed
    const requiredSteps = steps.filter(step => step.is_required);
    const missingRequired = requiredSteps.filter(step => !isStepCompleted(step.id));
    
    if (missingRequired.length > 0) {
      setError(`Please complete all required steps: ${missingRequired.map(s => s.title).join(', ')}`);
      return;
    }

    const success = await completeSession();
    if (success) {
      // Session completed - the component will show completion page
    }
  };

  const renderStepInput = (step: ChecklistStep) => {
    const stepProgress = getStepProgress(step.id);
    const isCompleted = isStepCompleted(step.id);
    const primaryColor = branding?.primary_color || checklist?.brand_color || '#10b981';
    const currentValue = localStepValues[step.id] ?? stepProgress?.notes ?? '';

    const baseInputClasses = "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 text-gray-900 font-sans placeholder-gray-500";

    switch (step.step_type) {
      case 'checkbox':
        return (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
            <label className="flex items-start space-x-4 cursor-pointer group">
              <div 
                className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center mt-1 transition-all duration-200 group-hover:scale-105 ${
                  isCompleted 
                    ? 'text-white shadow-lg' 
                    : 'border-gray-300 hover:border-gray-400 bg-white'
                }`}
                style={{ 
                  borderColor: isCompleted ? primaryColor : undefined,
                  backgroundColor: isCompleted ? primaryColor : undefined 
                }}
              >
                {isCompleted && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={(e) => handleStepChange(step.id, e.target.checked)}
                  className="sr-only"
                />
                <div className="text-xl font-semibold text-gray-900 mb-2 font-sans">{step.title}</div>
                {step.description && (
                  <div className="text-gray-600 leading-relaxed font-sans">{step.description}</div>
                )}
              </div>
            </label>
          </div>
        );

      case 'text':
        return (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
            <label className="block">
              <div className="text-xl font-semibold text-gray-900 mb-2 font-sans">{step.title}</div>
              {step.description && (
                <p className="text-gray-600 mb-4 leading-relaxed font-sans">{step.description}</p>
              )}
              <input
                type="text"
                value={currentValue}
                onChange={(e) => handleStepChange(step.id, e.target.value)}
                className={baseInputClasses}
                placeholder={step.options || 'Enter your response...'}
              />
            </label>
          </div>
        );

      case 'textarea':
        return (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
            <label className="block">
              <div className="text-xl font-semibold text-gray-900 mb-2 font-sans">{step.title}</div>
              {step.description && (
                <p className="text-gray-600 mb-4 leading-relaxed font-sans">{step.description}</p>
              )}
              <textarea
                value={currentValue}
                onChange={(e) => handleStepChange(step.id, e.target.value)}
                className={`${baseInputClasses} resize-none`}
                placeholder={step.options || 'Share your thoughts...'}
                rows={5}
              />
            </label>
          </div>
        );

      case 'email':
        return (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
            <label className="block">
              <div className="text-xl font-semibold text-gray-900 mb-2 font-sans">{step.title}</div>
              {step.description && (
                <p className="text-gray-600 mb-4 leading-relaxed font-sans">{step.description}</p>
              )}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={currentValue}
                  onChange={(e) => handleStepChange(step.id, e.target.value)}
                  className={`${baseInputClasses} pl-12`}
                  placeholder="Enter email address..."
                />
              </div>
            </label>
          </div>
        );

      case 'url':
        return (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
            <label className="block">
              <div className="text-xl font-semibold text-gray-900 mb-2 font-sans">{step.title}</div>
              {step.description && (
                <p className="text-gray-600 mb-4 leading-relaxed font-sans">{step.description}</p>
              )}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LinkIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  value={currentValue}
                  onChange={(e) => handleStepChange(step.id, e.target.value)}
                  className={`${baseInputClasses} pl-12`}
                  placeholder="https://example.com"
                />
              </div>
            </label>
          </div>
        );

      case 'secure_text':
        return (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-xl font-semibold text-gray-900 mb-2 font-sans">{step.title}</div>
                {step.description && (
                  <p className="text-gray-700 mb-3 leading-relaxed font-sans">{step.description}</p>
                )}
                <div className="bg-blue-100 border border-blue-300 rounded-lg p-3 mb-4">
                  <div className="flex items-center text-blue-800 text-sm font-sans">
                    <Shield className="w-4 h-4 mr-2" />
                    <span className="font-medium">Secure & Encrypted</span>
                  </div>
                  <p className="text-blue-700 text-xs mt-1 font-sans">
                    This information is encrypted and will automatically expire in {step.options || '24'} hours
                  </p>
                </div>
              </div>
            </div>
            <textarea
              value={currentValue}
              onChange={(e) => handleStepChange(step.id, e.target.value)}
              className={`${baseInputClasses} resize-none bg-white/80 backdrop-blur-sm`}
              placeholder="Enter sensitive information..."
              rows={4}
            />
          </div>
        );

      case 'file_upload':
        return (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
            <div className="text-xl font-semibold text-gray-900 mb-2 font-sans">{step.title}</div>
            {step.description && (
              <p className="text-gray-600 mb-4 leading-relaxed font-sans">{step.description}</p>
            )}
            <FileUpload
              value={currentValue}
              onChange={(value) => handleStepChange(step.id, value)}
              acceptedTypes={step.options}
              folder={session?.id}
              placeholder="Drop files here or click to upload"
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-gray-600 font-sans text-lg">Loading checklist...</p>
        </div>
      </div>
    );
  }

  if (error && !checklist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <X className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4 font-sans">Checklist Not Found</h1>
          <p className="text-gray-600 mb-8 font-sans leading-relaxed">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl font-sans"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  if (!checklist) return null;

  // Show password form for protected checklists
  if (!checklist.is_public && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold mb-2 font-sans">Protected Checklist</h1>
            <p className="text-orange-100 font-sans">This checklist requires a password to access</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-600 text-sm font-sans">{error}</p>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 font-sans">
                  Enter Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 font-sans"
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl font-sans"
              >
                Access Checklist
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Show completion page if session is completed
  if (hasSessionToken && session?.completed_at) {
    const primaryColor = branding?.primary_color || checklist.brand_color;
    const fontFamily = branding?.font_family || 'Montserrat';

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center px-4" style={{ fontFamily }}>
        <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
          <div 
            className="h-2"
            style={{ backgroundColor: primaryColor }}
          ></div>
          
          <div className="p-12 text-center">
            {branding?.logo_url && (
              <div className="flex justify-center mb-8">
                <img 
                  src={branding.logo_url} 
                  alt="Logo" 
                  className="h-20 max-w-80 object-contain"
                />
              </div>
            )}
            
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <CheckCircle 
                className="w-12 h-12"
                style={{ color: primaryColor }}
              />
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-6 font-sans">
              🎉 Congratulations!
            </h1>
            
            <div className="prose prose-lg prose-gray max-w-none mb-8">
              <p className="text-gray-600 text-xl leading-relaxed font-sans">
                {checklist.completion_page_content}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 max-w-sm mx-auto mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1 font-sans" style={{ color: primaryColor }}>
                  {steps.length}/{steps.length}
                </div>
                <div className="text-sm text-gray-600 font-sans">Steps Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1 font-sans">
                  {Math.ceil((Date.now() - new Date(session.started_at || session.created_at).getTime()) / (1000 * 60 * 60 * 24) * 10) / 10}
                </div>
                <div className="text-sm text-gray-600 font-sans">Days to Complete</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-6 border border-emerald-200">
              <h3 className="font-semibold text-gray-900 mb-4 font-sans text-lg">🚀 What happens next?</h3>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-center text-left">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <p className="font-sans">Our team will review your submission within 24 hours</p>
                </div>
                <div className="flex items-center text-left">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <p className="font-sans">You'll receive a detailed project plan via email</p>
                </div>
                <div className="flex items-center text-left">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <p className="font-sans">We'll schedule your project kickoff call</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show new session creation form if no session token
  if (!hasSessionToken) {
    const primaryColor = branding?.primary_color || checklist.brand_color || '#10b981';
    const fontFamily = branding?.font_family || 'Montserrat';

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50" style={{ fontFamily }}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Checklist Header */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border border-gray-200">
            <div 
              className="h-3"
              style={{ backgroundColor: primaryColor }}
            ></div>
            
            <div 
              className="px-8 py-12 text-center relative overflow-hidden"
              style={{ backgroundColor: `${primaryColor}08` }}
            >
              {branding?.logo_url && (
                <div className="flex justify-center mb-8">
                  <img 
                    src={branding.logo_url} 
                    alt="Logo" 
                    className="h-20 max-w-80 object-contain"
                  />
                </div>
              )}
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-sans">{checklist.title}</h1>
              <p className="text-gray-600 text-xl leading-relaxed max-w-2xl mx-auto mb-8 font-sans">{checklist.description}</p>
              
              <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-emerald-500" />
                  <span className="font-sans">{steps.length} steps</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-500" />
                  <span className="font-sans">~15 minutes</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-purple-500" />
                  <span className="font-sans">Collaborative</span>
                </div>
              </div>
            </div>
          </div>

          {/* New Session Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Play className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3 font-sans">Start Your Session</h2>
              <p className="text-gray-600 text-lg font-sans">Create a new session to begin working on this checklist</p>
            </div>
            
            <form onSubmit={handleCreateNewSession} className="space-y-6 max-w-2xl mx-auto">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-600 text-sm font-sans">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 font-sans">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={customerData.email}
                      onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 font-sans"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 font-sans">
                    Your Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={customerData.name}
                      onChange={(e) => setCustomerData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 font-sans"
                      placeholder="Your Name"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 font-sans">
                  Company (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={customerData.company}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 font-sans"
                    placeholder="Your Company"
                  />
                </div>
              </div>
              
              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  disabled={creatingSession}
                  className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 font-sans"
                >
                  {creatingSession ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block"></div>
                      Creating Session...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2 inline-block" />
                      Start New Session
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-3 font-sans">💡 How it works</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <p className="font-sans">Create your session with basic info</p>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <p className="font-sans">Complete steps at your own pace</p>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <p className="font-sans">Your progress is automatically saved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show main checklist interface if we have a session
  const primaryColor = branding?.primary_color || checklist.brand_color;
  const secondaryColor = branding?.secondary_color || '#059669';
  const fontFamily = branding?.font_family || 'Montserrat';
  const completionPercentage = getCompletionPercentage(steps.length);
  const completedCount = progress.length;
  
  // Check if all required steps are completed
  const requiredSteps = steps.filter(step => step.is_required);
  const allRequiredCompleted = requiredSteps.every(step => isStepCompleted(step.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50" style={{ fontFamily }}>
      {/* Concurrent Edit Notification */}
      <ConcurrentEditNotification
        otherUsers={otherActiveUsers}
        show={showConcurrentEditNotification}
        onDismiss={() => {}}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border border-gray-200">
          <div 
            className="h-3"
            style={{ backgroundColor: primaryColor }}
          ></div>
          
          <div 
            className="px-8 py-12 text-center relative overflow-hidden"
            style={{ backgroundColor: `${primaryColor}08` }}
          >
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-4 left-4 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full"></div>
              <div className="absolute bottom-4 right-4 w-24 h-24 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full"></div>
            </div>
            
            <div className="relative z-10">
              {branding?.logo_url && (
                <div className="flex justify-center mb-8">
                  <img 
                    src={branding.logo_url} 
                    alt="Logo" 
                    className="h-20 max-w-80 object-contain"
                  />
                </div>
              )}
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-sans">{checklist.title}</h1>
              <p className="text-gray-600 text-xl leading-relaxed max-w-2xl mx-auto font-sans">{checklist.description}</p>
              
              {/* Enhanced Progress Bar */}
              <div className="mt-10 max-w-lg mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-gray-700 font-sans">Your Progress</span>
                  <span className="text-sm font-semibold text-gray-700 font-sans">{completedCount} of {steps.length} completed</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
                  <div 
                    className="h-4 rounded-full transition-all duration-500 shadow-sm"
                    style={{ 
                      background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
                      width: `${completionPercentage}%` 
                    }}
                  ></div>
                </div>
                <div className="text-center mt-4">
                  <span className="text-2xl font-bold font-sans" style={{ color: primaryColor }}>
                    {completionPercentage}%
                  </span>
                  <span className="text-gray-600 ml-2 font-sans">complete</span>
                </div>
              </div>

              {/* Active Users Indicator */}
              {otherActiveUsers.length > 0 && (
                <div className="mt-8 flex items-center justify-center space-x-3">
                  <div className="flex -space-x-3">
                    {otherActiveUsers.slice(0, 3).map((user, index) => (
                      <div
                        key={user.id}
                        className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full border-3 border-white flex items-center justify-center shadow-lg"
                        title={`${user.name || user.email} is also working on this`}
                      >
                        <span className="text-white text-sm font-bold font-sans">
                          {(user.name || user.email).charAt(0).toUpperCase()}
                        </span>
                      </div>
                    ))}
                    {otherActiveUsers.length > 3 && (
                      <div className="w-10 h-10 bg-gray-500 rounded-full border-3 border-white flex items-center justify-center shadow-lg">
                        <span className="text-white text-sm font-bold font-sans">
                          +{otherActiveUsers.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600 font-sans">
                      {otherActiveUsers.length === 1 ? '1 other person' : `${otherActiveUsers.length} others`} working on this
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Checklist Content */}
          <div className="space-y-8">
            {/* Step Navigation Pills */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 font-sans">Checklist Steps</h2>
                <div className="flex items-center space-x-3">
                  {saving && (
                    <div className="flex items-center space-x-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg font-sans">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span>Saving...</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {steps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStepIndex(index)}
                    className={`group relative px-6 py-3 rounded-xl font-semibold transition-all duration-200 font-sans ${
                      currentStepIndex === index
                        ? 'text-white shadow-lg transform scale-105'
                        : isStepCompleted(step.id)
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm'
                    }`}
                    style={{
                      backgroundColor: currentStepIndex === index ? primaryColor : undefined
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{index + 1}</span>
                      {isStepCompleted(step.id) && (
                        <CheckCircle className="w-5 h-5" />
                      )}
                      {step.is_required && !isStepCompleted(step.id) && (
                        <span className="text-red-500 text-lg">*</span>
                      )}
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                      {step.title}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Current Step Content */}
            {steps.length > 0 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200 mb-4">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700 font-sans">
                      Step {currentStepIndex + 1} of {steps.length}
                    </span>
                  </div>
                  
                  {steps[currentStepIndex].is_required && (
                    <div className="inline-flex items-center space-x-2 bg-red-50 px-4 py-2 rounded-full border border-red-200">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      <span className="text-sm font-medium text-red-700 font-sans">Required Step</span>
                    </div>
                  )}
                </div>

                {/* Step Content */}
                <div className="space-y-6">
                  {renderStepInput(steps[currentStepIndex])}
                </div>

                {/* Navigation */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
                      disabled={currentStepIndex === 0}
                      className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 rounded-xl hover:bg-gray-50 font-sans"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <span>Previous</span>
                    </button>

                    <div className="flex items-center space-x-4">
                      {currentStepIndex < steps.length - 1 ? (
                        <button
                          onClick={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))}
                          className="flex items-center space-x-2 px-8 py-3 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-sans"
                          style={{ backgroundColor: primaryColor }}
                        >
                          <span>Next Step</span>
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      ) : (
                        <button
                          onClick={handleComplete}
                          disabled={saving || !allRequiredCompleted}
                          className="flex items-center space-x-3 px-8 py-4 text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none font-sans"
                          style={{ backgroundColor: secondaryColor }}
                        >
                          {saving ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              <span>Completing...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-6 h-6" />
                              <span>
                                {allRequiredCompleted ? 'Complete Checklist' : 'Complete Required Steps First'}
                              </span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Completed Steps Summary */}
            {progress.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-sans">
                  ✅ Completed Steps ({progress.length}/{steps.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {progress.map((p) => {
                    const step = steps.find(s => s.id === p.step_id);
                    if (!step) return null;
                    
                    return (
                      <div key={p.id} className="flex items-center space-x-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span className="text-sm font-medium text-emerald-800 font-sans truncate">{step.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        {/* Error Display */}
        {(error || sessionError) && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <X className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-red-700 font-medium font-sans">
                {error || sessionError}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}