import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CheckCircle, Lock, Eye, EyeOff, Upload, Link as LinkIcon, Mail } from 'lucide-react';
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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [completed, setCompleted] = useState(false);
  
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
        .maybeSingle();

      if (checklistError) {
        throw checklistError;
        return;
      }

      if (!checklistData) {
        setError('Checklist not found');
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
      fetchChecklistData(); // Reload with authentication
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checklist || !checklistId) return;

    // Validate required fields
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

    setSubmitting(true);
    setError(null);

    try {
      // Create customer record
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .insert({
          checklist_id: checklistId,
          email: customerData.email,
          name: customerData.name,
          company: customerData.company,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (customerError) throw customerError;

      // Create progress records for completed steps
      const progressRecords = Object.entries(stepProgress)
        .filter(([_, progress]) => progress.completed)
        .map(([stepId, progress]) => ({
          customer_id: customer.id,
          step_id: stepId,
          notes: progress.value || '',
        }));

      if (progressRecords.length > 0) {
        const { error: progressError } = await supabase
          .from('customer_progress')
          .insert(progressRecords);

        if (progressError) throw progressError;
      }

      setCompleted(true);
    } catch (err) {
      console.error('Error submitting checklist:', err);
      setError('Failed to submit checklist. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepInput = (step: ChecklistStep) => {
    const progress = stepProgress[step.id];
    const primaryColor = branding?.primary_color || checklist?.brand_color || '#10b981';

    switch (step.step_type) {
      case 'checkbox':
        return (
          <label className="flex items-start space-x-3 cursor-pointer">
            <div 
              className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 transition-colors ${
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
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
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
              <div className="font-medium text-gray-900">{step.title}</div>
              {step.description && (
                <div className="text-sm text-gray-600 mt-1">{step.description}</div>
              )}
            </div>
          </label>
        );

      case 'text':
        return (
          <div>
            <label className="block font-medium text-gray-900 mb-2">{step.title}</label>
            {step.description && (
              <p className="text-sm text-gray-600 mb-3">{step.description}</p>
            )}
            <input
              type="text"
              value={progress?.value || ''}
              onChange={(e) => handleStepChange(step.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ focusRingColor: primaryColor }}
              placeholder={step.options || 'Enter text...'}
            />
          </div>
        );

      case 'textarea':
        return (
          <div>
            <label className="block font-medium text-gray-900 mb-2">{step.title}</label>
            {step.description && (
              <p className="text-sm text-gray-600 mb-3">{step.description}</p>
            )}
            <textarea
              value={progress?.value || ''}
              onChange={(e) => handleStepChange(step.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ focusRingColor: primaryColor }}
              placeholder={step.options || 'Enter details...'}
              rows={4}
            />
          </div>
        );

      case 'email':
        return (
          <div>
            <label className="block font-medium text-gray-900 mb-2">{step.title}</label>
            {step.description && (
              <p className="text-sm text-gray-600 mb-3">{step.description}</p>
            )}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={progress?.value || ''}
                onChange={(e) => handleStepChange(step.id, e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ focusRingColor: primaryColor }}
                placeholder="Enter email address..."
              />
            </div>
          </div>
        );

      case 'url':
        return (
          <div>
            <label className="block font-medium text-gray-900 mb-2">{step.title}</label>
            {step.description && (
              <p className="text-sm text-gray-600 mb-3">{step.description}</p>
            )}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="url"
                value={progress?.value || ''}
                onChange={(e) => handleStepChange(step.id, e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ focusRingColor: primaryColor }}
                placeholder="https://example.com"
              />
            </div>
          </div>
        );

      case 'file_upload':
        return (
          <div>
            <label className="block font-medium text-gray-900 mb-2">{step.title}</label>
            {step.description && (
              <p className="text-sm text-gray-600 mb-3">{step.description}</p>
            )}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <div className="text-sm text-gray-600 mb-2">
                {progress?.file ? progress.file.name : 'Drop files here or click to upload'}
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
          <p className="text-gray-600">Loading checklist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Checklist Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Protected Checklist</h1>
            <p className="text-gray-600">This checklist requires a password to access</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition-colors"
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
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Thank You!
            </h1>
            
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 text-lg leading-relaxed">
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

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily }}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header with brand color */}
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
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Customer Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Your Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={customerData.email}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ focusRingColor: primaryColor }}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={customerData.name}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ focusRingColor: primaryColor }}
                    placeholder="John Doe"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  value={customerData.company}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ focusRingColor: primaryColor }}
                  placeholder="Your Company"
                />
              </div>
            </div>

            {/* Checklist Steps */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Checklist Steps</h2>
              
              {steps.map((step, index) => (
                <div key={step.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <div 
                        className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium"
                        style={{ 
                          borderColor: primaryColor,
                          backgroundColor: stepProgress[step.id]?.completed ? primaryColor : 'transparent',
                          color: stepProgress[step.id]?.completed ? 'white' : primaryColor
                        }}
                      >
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      {renderStepInput(step)}
                      {step.is_required && (
                        <div className="mt-2">
                          <span className="inline-block px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                            Required
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 rounded-lg font-semibold text-white transition-colors disabled:opacity-50"
                style={{ backgroundColor: secondaryColor }}
              >
                {submitting ? 'Submitting...' : 'Complete Onboarding'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}