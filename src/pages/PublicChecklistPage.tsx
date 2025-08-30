import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  CheckCircle, 
  Lock, 
  Eye, 
  EyeOff, 
  Upload, 
  Link as LinkIcon, 
  Mail,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Save,
  User,
  Building
} from 'lucide-react';
import { Checklist, ChecklistStep, StepType } from '../types/checklist';

interface CustomerData {
  email: string;
  name: string;
  company: string;
}

interface StepProgress {
  [stepId: string]: {
    completed: boolean;
    value?: string;
    file?: File;
  };
}

export default function PublicChecklistPage() {
  const { checklistId } = useParams<{ checklistId: string }>();
  const navigate = useNavigate();
  
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [steps, setSteps] = useState<ChecklistStep[]>([]);
  const [branding, setBranding] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showCustomerForm, setShowCustomerForm] = useState(true);
  
  const [customerData, setCustomerData] = useState<CustomerData>({
    email: '',
    name: '',
    company: '',
  });
  
  const [stepProgress, setStepProgress] = useState<StepProgress>({});

  useEffect(() => {
    if (checklistId) {
      fetchChecklistData();
    }
  }, [checklistId]);

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
        .eq('is_public', true)
        .maybeSingle();

      if (checklistError) {
        throw checklistError;
      }

      if (!checklistData) {
        setError('Checklist not found or not public');
        return;
      }

      setChecklist(checklistData);

      // Check if password is required
      if (!checklistData.is_public && !isAuthenticated) {
        setLoading(false);
        return;
      }

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

  const handleStepChange = (stepId: string, value: string | boolean, file?: File) => {
    setStepProgress(prev => ({
      ...prev,
      [stepId]: {
        completed: typeof value === 'boolean' ? value : !!value,
        value: typeof value === 'string' ? value : undefined,
        file,
      }
    }));
  };

  const getCompletionPercentage = () => {
    if (steps.length === 0) return 0;
    const completedSteps = Object.values(stepProgress).filter(p => p.completed).length;
    return Math.round((completedSteps / steps.length) * 100);
  };

  const getCompletedStepsCount = () => {
    return Object.values(stepProgress).filter(p => p.completed).length;
  };

  const handleSaveProgress = async () => {
    if (!checklist || !checklistId) return;

    if (!customerData.email) {
      setError('Email is required to save progress');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Create or update customer record
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .upsert({
          checklist_id: checklistId,
          email: customerData.email,
          name: customerData.name,
          company: customerData.company,
          last_activity: new Date().toISOString(),
        }, {
          onConflict: 'checklist_id,email'
        })
        .select()
        .single();

      if (customerError) throw customerError;

      // Save progress for completed steps
      const progressRecords = Object.entries(stepProgress)
        .filter(([_, progress]) => progress.completed)
        .map(([stepId, progress]) => ({
          customer_id: customer.id,
          step_id: stepId,
          notes: progress.value || '',
        }));

      if (progressRecords.length > 0) {
        // Delete existing progress first
        await supabase
          .from('customer_progress')
          .delete()
          .eq('customer_id', customer.id);

        // Insert new progress
        const { error: progressError } = await supabase
          .from('customer_progress')
          .insert(progressRecords);

        if (progressError) throw progressError;
      }

      // Show success message briefly
      const originalError = error;
      setError('Progress saved!');
      setTimeout(() => setError(originalError), 2000);

    } catch (err) {
      console.error('Error saving progress:', err);
      setError('Failed to save progress. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleComplete = async () => {
    if (!checklist || !checklistId) return;

    // Check if all required steps are completed
    const requiredSteps = steps.filter(step => step.is_required);
    const missingRequired = requiredSteps.filter(step => !stepProgress[step.id]?.completed);
    
    if (missingRequired.length > 0) {
      setError(`Please complete all required steps: ${missingRequired.map(s => s.title).join(', ')}`);
      return;
    }

    if (!customerData.email) {
      setError('Email is required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Create customer record with completion
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .upsert({
          checklist_id: checklistId,
          email: customerData.email,
          name: customerData.name,
          company: customerData.company,
          completed_at: new Date().toISOString(),
          last_activity: new Date().toISOString(),
        }, {
          onConflict: 'checklist_id,email'
        })
        .select()
        .single();

      if (customerError) throw customerError;

      // Save all progress
      const progressRecords = Object.entries(stepProgress)
        .filter(([_, progress]) => progress.completed)
        .map(([stepId, progress]) => ({
          customer_id: customer.id,
          step_id: stepId,
          notes: progress.value || '',
        }));

      if (progressRecords.length > 0) {
        // Delete existing progress first
        await supabase
          .from('customer_progress')
          .delete()
          .eq('customer_id', customer.id);

        // Insert new progress
        const { error: progressError } = await supabase
          .from('customer_progress')
          .insert(progressRecords);

        if (progressError) throw progressError;
      }

      setCompleted(true);
    } catch (err) {
      console.error('Error completing checklist:', err);
      setError('Failed to complete checklist. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const renderStepInput = (step: ChecklistStep) => {
    const progress = stepProgress[step.id];
    const primaryColor = branding?.primary_color || checklist?.brand_color || '#10b981';

    switch (step.step_type) {
      case 'checkbox':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="flex items-start space-x-3 cursor-pointer">
                <div 
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center mt-0.5 transition-colors ${
                    progress?.completed 
                      ? 'text-white' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ 
                    borderColor: progress?.completed ? primaryColor : undefined,
                    backgroundColor: progress?.completed ? primaryColor : undefined 
                  }}
                >
                  {progress?.completed && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="checkbox"
                    checked={progress?.completed || false}
                    onChange={(e) => handleStepChange(step.id, e.target.checked)}
                    className="sr-only"
                  />
                  <div className="text-lg font-medium text-gray-900">{step.title}</div>
                  {step.description && (
                    <div className="text-gray-600 mt-1">{step.description}</div>
                  )}
                </div>
              </label>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-lg font-medium text-gray-900 mb-2">{step.title}</label>
              {step.description && (
                <p className="text-gray-600 mb-4">{step.description}</p>
              )}
              <input
                type="text"
                value={progress?.value || ''}
                onChange={(e) => handleStepChange(step.id, e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-gray-900"
                style={{ focusRingColor: primaryColor }}
                placeholder={step.options || 'Enter text...'}
              />
            </div>
          </div>
        );

      case 'textarea':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-lg font-medium text-gray-900 mb-2">{step.title}</label>
              {step.description && (
                <p className="text-gray-600 mb-4">{step.description}</p>
              )}
              <textarea
                value={progress?.value || ''}
                onChange={(e) => handleStepChange(step.id, e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-gray-900"
                style={{ focusRingColor: primaryColor }}
                placeholder={step.options || 'Enter details...'}
                rows={4}
              />
            </div>
          </div>
        );

      case 'email':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-lg font-medium text-gray-900 mb-2">{step.title}</label>
              {step.description && (
                <p className="text-gray-600 mb-4">{step.description}</p>
              )}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={progress?.value || ''}
                  onChange={(e) => handleStepChange(step.id, e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-gray-900"
                  style={{ focusRingColor: primaryColor }}
                  placeholder="Enter email address..."
                />
              </div>
            </div>
          </div>
        );

      case 'url':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-lg font-medium text-gray-900 mb-2">{step.title}</label>
              {step.description && (
                <p className="text-gray-600 mb-4">{step.description}</p>
              )}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  value={progress?.value || ''}
                  onChange={(e) => handleStepChange(step.id, e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-gray-900"
                  style={{ focusRingColor: primaryColor }}
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>
        );

      case 'file_upload':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-lg font-medium text-gray-900 mb-2">{step.title}</label>
              {step.description && (
                <p className="text-gray-600 mb-4">{step.description}</p>
              )}
              <div className="relative">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <div className="text-gray-600 mb-2">
                    {progress?.file ? (
                      <span className="text-green-600 font-medium">{progress.file.name}</span>
                    ) : (
                      'Drop files here or click to upload'
                    )}
                  </div>
                  <input
                    type="file"
                    accept={step.options || '*'}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleStepChange(step.id, file.name, file);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {step.options && (
                    <div className="text-xs text-gray-500">
                      Accepted formats: {step.options}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-sans">Loading checklist...</p>
        </div>
      </div>
    );
  }

  if (error && !checklist) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2 font-sans">Checklist Not Found</h1>
          <p className="text-gray-600 mb-6 font-sans">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors font-sans"
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-gray-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 font-sans">Protected Checklist</h1>
            <p className="text-gray-600 font-sans">This checklist requires a password to access</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition-colors font-sans"
            >
              Access Checklist
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Show completion page
  if (completed) {
    const primaryColor = branding?.primary_color || checklist.brand_color;
    const fontFamily = branding?.font_family || 'Montserrat';

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ fontFamily }}>
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
          <div 
            className="h-2"
            style={{ backgroundColor: primaryColor }}
          ></div>
          
          <div className="p-8 text-center">
            {branding?.logo_url && (
              <div className="flex justify-center mb-6">
                <img 
                  src={branding.logo_url} 
                  alt="Logo" 
                  className="h-16 max-w-64 object-contain"
                />
              </div>
            )}
            
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <CheckCircle 
                className="w-10 h-10"
                style={{ color: primaryColor }}
              />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4 font-sans">
              Congratulations!
            </h1>
            
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 text-lg leading-relaxed font-sans">
                {checklist.completion_page_content}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const primaryColor = branding?.primary_color || checklist.brand_color;
  const secondaryColor = branding?.secondary_color || '#059669';
  const fontFamily = branding?.font_family || 'Montserrat';
  const completionPercentage = getCompletionPercentage();
  const completedCount = getCompletedStepsCount();

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div 
            className="h-2"
            style={{ backgroundColor: primaryColor }}
          ></div>
          
          <div 
            className="px-6 py-8 text-center"
            style={{ backgroundColor: `${primaryColor}10` }}
          >
            {branding?.logo_url && (
              <div className="flex justify-center mb-6">
                <img 
                  src={branding.logo_url} 
                  alt="Logo" 
                  className="h-16 max-w-64 object-contain"
                />
              </div>
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{checklist.title}</h1>
            <p className="text-gray-600 text-lg">{checklist.description}</p>
            
            {/* Progress Bar */}
            <div className="mt-6 max-w-md mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-medium text-gray-700">{completedCount}/{steps.length} completed</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="h-3 rounded-full transition-all duration-300"
                  style={{ 
                    backgroundColor: primaryColor,
                    width: `${completionPercentage}%` 
                  }}
                ></div>
              </div>
              <div className="text-center mt-2">
                <span className="text-lg font-bold" style={{ color: primaryColor }}>
                  {completionPercentage}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information Form */}
        {showCustomerForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 font-sans">Your Information</h2>
              <button
                onClick={() => setShowCustomerForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={customerData.email}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent font-sans"
                    style={{ focusRingColor: primaryColor }}
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={customerData.name}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent font-sans"
                    style={{ focusRingColor: primaryColor }}
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                  Company
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={customerData.company}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent font-sans"
                    style={{ focusRingColor: primaryColor }}
                    placeholder="Your Company"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Steps Navigation */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 font-sans">Checklist Steps</h2>
          
          {/* Step Navigation */}
          <div className="flex flex-wrap gap-2 mb-6">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStepIndex(index)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors font-sans ${
                  currentStepIndex === index
                    ? 'text-white'
                    : stepProgress[step.id]?.completed
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={{
                  backgroundColor: currentStepIndex === index ? primaryColor : undefined
                }}
              >
                <div className="flex items-center space-x-2">
                  <span>{index + 1}</span>
                  {stepProgress[step.id]?.completed && (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  {step.is_required && !stepProgress[step.id]?.completed && (
                    <span className="text-red-500">*</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Current Step */}
          {steps.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 font-sans">
                    Step {currentStepIndex + 1}: {steps[currentStepIndex].title}
                  </h3>
                  {steps[currentStepIndex].is_required && (
                    <span className="inline-block mt-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium font-sans">
                      Required
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 font-sans">
                    {stepProgress[steps[currentStepIndex].id]?.completed ? (
                      <span className="text-green-600 font-medium">✓ Completed</span>
                    ) : (
                      'Not completed'
                    )}
                  </div>
                </div>
              </div>

              {/* Step Content */}
              <div>
                {renderStepInput(steps[currentStepIndex])}
              </div>

              {/* Step Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <button
                  onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
                  disabled={currentStepIndex === 0}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-sans"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleSaveProgress}
                    disabled={saving || !customerData.email}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50 font-sans"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Progress</span>
                      </>
                    )}
                  </button>

                  {currentStepIndex < steps.length - 1 ? (
                    <button
                      onClick={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))}
                      className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg font-medium transition-colors font-sans"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <span>Next</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleComplete}
                      disabled={saving}
                      className="flex items-center space-x-2 px-6 py-2 text-white rounded-lg font-medium transition-colors disabled:opacity-50 font-sans"
                      style={{ backgroundColor: secondaryColor }}
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Completing...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Complete Checklist</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className={`mt-4 p-4 rounded-lg ${
            error === 'Progress saved!' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`text-sm font-sans ${
              error === 'Progress saved!' ? 'text-green-600' : 'text-red-600'
            }`}>
              {error}
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 font-sans">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowCustomerForm(!showCustomerForm)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors font-sans"
            >
              <User className="w-4 h-4" />
              <span>{showCustomerForm ? 'Hide' : 'Edit'} Info</span>
            </button>
            
            <button
              onClick={() => {
                setStepProgress({});
                setCurrentStepIndex(0);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors font-sans"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Progress</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}