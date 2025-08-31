import React, { useState, useEffect, useRef } from 'react';
import DemoHeader from '../components/DemoHeader';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Users, 
  BarChart3, 
  Clock, 
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  Lock,
  X,
  Save,
  Upload,
  Link as LinkIcon,
  Mail,
  User,
  Building
} from 'lucide-react';

const demoSteps = [
  {
    id: 'overview',
    title: 'Dashboard Overview',
    description: 'See how OnboardFlo gives you complete visibility into customer progress'
  },
  {
    id: 'checklist-setup',
    title: 'Create Checklist',
    description: 'Watch how easy it is to build an onboarding checklist'
  },
  {
    id: 'customer-view',
    title: 'Customer Experience',
    description: 'See what your customers experience when completing the checklist'
  },
  {
    id: 'branding',
    title: 'Brand Customization',
    description: 'Customize colors and branding to match your company'
  }
];

const checklistSteps = [
  {
    title: 'Join Project Slack',
    description: 'Get access to our project communication channel',
    step_type: 'checkbox',
    is_required: true
  },
  {
    title: 'Upload Logo & Brand Assets',
    description: 'Share your logo, brand guidelines, and visual assets',
    step_type: 'file_upload',
    options: '.pdf,.jpg,.png,.ai,.eps',
    is_required: true
  },
  {
    title: 'Brand Requirements & Vision',
    description: 'Tell us about your brand personality and design preferences',
    step_type: 'textarea',
    options: 'Describe your brand vision, target audience, and design goals...',
    is_required: true
  },
  {
    title: 'Primary Contact Information',
    description: 'Provide the main point of contact for this project',
    step_type: 'email',
    is_required: true
  },
  {
    title: 'Design Inspiration Links',
    description: 'Share websites or designs that inspire your vision',
    step_type: 'url',
    is_required: false
  },
  {
    title: 'Project Timeline',
    description: 'When do you need this project completed?',
    step_type: 'text',
    options: 'Enter your preferred timeline...',
    is_required: true
  },
  {
    title: 'Schedule Kickoff Meeting',
    description: 'Book a time to discuss project details and next steps',
    step_type: 'checkbox',
    is_required: true
  }
];

const getStepTypeIcon = (stepType: string) => {
  switch (stepType) {
    case 'checkbox': return '☑️';
    case 'text': return '📝';
    case 'textarea': return '📄';
    case 'file_upload': return '📎';
    case 'url': return '🔗';
    case 'email': return '📧';
    default: return '☑️';
  }
};

const getStepTypeLabel = (stepType: string) => {
  switch (stepType) {
    case 'checkbox': return 'Checkbox';
    case 'text': return 'Text Input';
    case 'textarea': return 'Long Text';
    case 'file_upload': return 'File Upload';
    case 'url': return 'Website URL';
    case 'email': return 'Email';
    default: return 'Checkbox';
  }
};

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [checklistBuilderState, setChecklistBuilderState] = useState({
    title: '',
    description: '',
    isPublic: false,
    activeTab: 'settings',
    steps: [] as any[]
  });
  const [customerProgress, setCustomerProgress] = useState<string[]>([]);
  const [customerActiveStep, setCustomerActiveStep] = useState<number | null>(null);
  const [brandingState, setBrandingState] = useState({
    primaryColor: '#10b981',
    secondaryColor: '#059669',
    fontFamily: 'Montserrat'
  });

  const builderScrollRef = useRef<HTMLDivElement>(null);
  const customerScrollRef = useRef<HTMLDivElement>(null);
  const brandingScrollRef = useRef<HTMLDivElement>(null);

  const scrollToTop = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToElement = (ref: React.RefObject<HTMLDivElement>, selector: string) => {
    if (ref.current) {
      const element = ref.current.querySelector(selector);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const startDemo = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    
    // Reset all states
    setChecklistBuilderState({
      title: '',
      description: '',
      isPublic: false,
      activeTab: 'settings',
      steps: []
    });
    setCustomerProgress([]);
    setCustomerActiveStep(null);
    setBrandingState({
      primaryColor: '#10b981',
      secondaryColor: '#059669',
      fontFamily: 'Montserrat'
    });
  };

  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      
      // Reset scroll when moving to branding
      if (currentStep + 1 === 3) { // branding step
        setTimeout(() => scrollToTop(brandingScrollRef), 100);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Auto-play checklist setup animation
  useEffect(() => {
    if (currentStep === 1 && isPlaying) {
      let timeoutId: NodeJS.Timeout;
      
      const runAnimation = async () => {
        // Phase 1: Settings autofill (0-2.2s)
        setTimeout(() => {
          setChecklistBuilderState(prev => ({ ...prev, title: 'Website Design Project' }));
        }, 200);
        
        setTimeout(() => {
          setChecklistBuilderState(prev => ({ 
            ...prev, 
            description: 'Complete these steps to start your website design project' 
          }));
        }, 800);
        
        setTimeout(() => {
          setChecklistBuilderState(prev => ({ ...prev, isPublic: true }));
        }, 1400);

        // Phase 2: Switch to steps tab (2.2s)
        setTimeout(() => {
          setChecklistBuilderState(prev => ({ ...prev, activeTab: 'steps' }));
        }, 2200);

        // Phase 3: Add steps one by one (2.5s+)
        checklistSteps.forEach((step, index) => {
          setTimeout(() => {
            setChecklistBuilderState(prev => ({
              ...prev,
              steps: [...prev.steps, { ...step, order_index: index }]
            }));
            
            // Scroll to the new step after a brief delay
            setTimeout(() => {
              scrollToElement(builderScrollRef, `[data-step-index="${index}"]`);
            }, 100);
          }, 2500 + (index * 600));
        });
      };

      runAnimation();
      
      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }
  }, [currentStep, isPlaying]);

  // Auto-play customer progress animation
  useEffect(() => {
    if (currentStep === 2 && isPlaying) {
      // Reset scroll to top first
      setTimeout(() => scrollToTop(customerScrollRef), 100);
      
      checklistSteps.forEach((step, index) => {
        // Show step as active
        setTimeout(() => {
          setCustomerActiveStep(index);
          // Scroll to the active step
          setTimeout(() => {
            scrollToElement(customerScrollRef, `[data-customer-step="${index}"]`);
          }, 100);
        }, 1000 + (index * 800));
        
        // Complete the step
        setTimeout(() => {
          setCustomerProgress(prev => [...prev, step.title]);
          setCustomerActiveStep(null);
        }, 1400 + (index * 800));
      });
    }
  }, [currentStep, isPlaying]);

  const renderOverview = () => (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold font-sans">Onboarding Dashboard</h3>
            <p className="text-emerald-100 text-sm font-sans">Real-time customer progress</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold font-sans">87%</div>
            <div className="text-emerald-100 text-xs font-sans">Avg. Completion</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6 bg-gray-50 border-b border-gray-100">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 font-sans">247</div>
            <div className="text-xs text-gray-600 font-sans">Active Users</div>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 font-sans">215</div>
            <div className="text-xs text-gray-600 font-sans">Completed</div>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 font-sans">2.3d</div>
            <div className="text-xs text-gray-600 font-sans">Avg. Time</div>
          </div>
        </div>
      </div>

      {/* Live Customer Progress */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 font-sans">Live Customer Progress</h4>
          <div className="flex items-center text-sm text-emerald-600">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
            <span className="font-sans">Live</span>
          </div>
        </div>
        
        <div className="space-y-3">
          {[
            { name: 'Sarah M.', company: 'TechCorp', progress: 85, status: 'active', timeLeft: '2 steps left' },
            { name: 'Mike R.', company: 'StartupXYZ', progress: 100, status: 'completed', timeLeft: 'Completed!' },
            { name: 'Lisa K.', company: 'GrowthCo', progress: 45, status: 'stuck', timeLeft: 'Needs help' },
            { name: 'David L.', company: 'ScaleTech', progress: 70, status: 'active', timeLeft: '1 day left' }
          ].map((customer, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs font-bold font-sans">{customer.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm font-sans">{customer.name}</div>
                  <div className="text-xs text-gray-500 font-sans">{customer.company}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center mb-1">
                  <div className="w-16 bg-gray-200 rounded-full h-1.5 mr-2">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        customer.status === 'completed' ? 'bg-emerald-500' :
                        customer.status === 'stuck' ? 'bg-red-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${customer.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-gray-700 font-sans">{customer.progress}%</span>
                </div>
                <div className={`text-xs font-sans ${
                  customer.status === 'completed' ? 'text-emerald-600' :
                  customer.status === 'stuck' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {customer.timeLeft}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderChecklistSetup = () => (
    <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[80vh] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-sans">Create New Checklist</h2>
          <p className="text-sm text-gray-600 mt-1 font-sans">
            Navigate between tabs freely • All changes saved when you click "Save Checklist"
          </p>
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-gray-50">
        <nav className="flex">
          <button
            className={`px-6 py-3 font-medium text-sm transition-colors font-sans relative ${
              checklistBuilderState.activeTab === 'settings'
                ? 'border-b-2 border-emerald-500 text-emerald-600 bg-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Settings
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm transition-colors font-sans relative ${
              checklistBuilderState.activeTab === 'steps'
                ? 'border-b-2 border-emerald-500 text-emerald-600 bg-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Steps 
            <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs">
              {checklistBuilderState.steps.length}
            </span>
          </button>
        </nav>
      </div>

      <div className="h-[60vh] overflow-y-auto" ref={builderScrollRef}>
        {/* Settings Tab */}
        {checklistBuilderState.activeTab === 'settings' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Basic Settings */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                    Checklist Title
                  </label>
                  <input
                    type="text"
                    value={checklistBuilderState.title}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                    placeholder="e.g., SaaS Onboarding Checklist"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                    Description
                  </label>
                  <textarea
                    value={checklistBuilderState.description}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                    placeholder="Brief description of this onboarding flow"
                    rows={3}
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 font-sans">
                    Visibility
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="visibility"
                        checked={checklistBuilderState.isPublic}
                        className="mr-3 text-emerald-600 focus:ring-emerald-500"
                        readOnly
                      />
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 text-emerald-500 mr-2" />
                        <span className="font-sans">Public - Anyone with the link can access</span>
                      </div>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="visibility"
                        checked={!checklistBuilderState.isPublic}
                        className="mr-3 text-emerald-600 focus:ring-emerald-500"
                        readOnly
                      />
                      <div className="flex items-center">
                        <Lock className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="font-sans">Password Protected</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column - Completion Message */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                    Completion Message
                  </label>
                  <textarea
                    value="Congratulations! Your website design project is now set up and ready to begin. Our team will be in touch within 24 hours to discuss next steps."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                    rows={8}
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1 font-sans">
                    This message will be displayed to customers when they complete all steps
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Steps Tab */}
        {checklistBuilderState.activeTab === 'steps' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 font-sans">Checklist Steps</h3>
                <p className="text-sm text-gray-600 font-sans">
                  Add, edit, and reorder the steps customers will complete
                </p>
              </div>
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center font-sans">
                <Plus className="w-4 h-4 mr-2" />
                Add Step
              </button>
            </div>

            {/* Steps List */}
            <div className="space-y-3">
              {checklistBuilderState.steps.map((step, index) => (
                <div 
                  key={index} 
                  data-step-index={index}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all duration-300 animate-slide-in"
                >
                  <div className="flex items-start">
                    <div className="flex items-center mr-3 mt-1">
                      <span className="text-sm text-gray-500 mr-2 font-sans">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <span className="text-sm mr-2">{getStepTypeIcon(step.step_type)}</span>
                            <h4 className="font-medium text-gray-900 font-sans">{step.title}</h4>
                          </div>
                          {step.description && (
                            <p className="text-sm text-gray-600 mt-1 font-sans">{step.description}</p>
                          )}
                          <div className="flex items-center mt-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium font-sans mr-2">
                              {getStepTypeLabel(step.step_type)}
                            </span>
                            {step.is_required && (
                              <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium font-sans">
                                Required
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 ml-4">
                          <button
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Move up"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            disabled={index === checklistBuilderState.steps.length - 1}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Move down"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit step"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete step"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {checklistBuilderState.steps.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 font-sans">No steps added yet</h3>
                  <p className="text-gray-600 mb-6 font-sans">
                    Add steps to create your onboarding checklist
                  </p>
                  <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-colors font-sans">
                    Add First Step
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
        <div className="text-sm text-gray-600 font-sans">
          <span className="text-orange-600 font-medium">● Building checklist...</span>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors font-sans">
            Cancel
          </button>
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center font-sans">
            <Save className="w-4 h-4 mr-2" />
            Create Checklist
          </button>
        </div>
      </div>
    </div>
  );

  const renderStepInput = (step: any, index: number) => {
    const isActive = customerActiveStep === index;
    const isCompleted = customerProgress.includes(step.title);
    const primaryColor = '#3b82f6';

    switch (step.step_type) {
      case 'checkbox':
        return (
          <div className="space-y-4">
            <div className={`rounded-lg p-4 transition-all duration-300 ${
              isActive ? 'bg-blue-50 border-2 border-blue-300' : 'bg-gray-50'
            }`}>
              <label className="flex items-start space-x-3 cursor-pointer">
                <div 
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center mt-0.5 transition-colors ${
                    isCompleted 
                      ? 'text-white' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ 
                    borderColor: isCompleted ? primaryColor : undefined,
                    backgroundColor: isCompleted ? primaryColor : undefined 
                  }}
                >
                  {isCompleted && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-lg font-medium text-gray-900 font-sans">{step.title}</div>
                  {step.description && (
                    <div className="text-gray-600 mt-1 font-sans">{step.description}</div>
                  )}
                </div>
              </label>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <div className={`rounded-lg p-4 transition-all duration-300 ${
              isActive ? 'bg-blue-50 border-2 border-blue-300' : 'bg-gray-50'
            }`}>
              <label className="block text-lg font-medium text-gray-900 mb-2 font-sans">{step.title}</label>
              {step.description && (
                <p className="text-gray-600 mb-4 font-sans">{step.description}</p>
              )}
              <input
                type="text"
                value={isCompleted ? "Q1 2024" : ""}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-gray-900 font-sans"
                placeholder={step.options || 'Enter text...'}
                readOnly
              />
            </div>
          </div>
        );

      case 'textarea':
        return (
          <div className="space-y-4">
            <div className={`rounded-lg p-4 transition-all duration-300 ${
              isActive ? 'bg-blue-50 border-2 border-blue-300' : 'bg-gray-50'
            }`}>
              <label className="block text-lg font-medium text-gray-900 mb-2 font-sans">{step.title}</label>
              {step.description && (
                <p className="text-gray-600 mb-4 font-sans">{step.description}</p>
              )}
              <textarea
                value={isCompleted ? "We're looking for a modern, clean design that appeals to tech-savvy professionals. Our brand is innovative yet trustworthy, and we want the website to reflect that balance." : ""}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-gray-900 font-sans"
                placeholder={step.options || 'Enter details...'}
                rows={4}
                readOnly
              />
            </div>
          </div>
        );

      case 'email':
        return (
          <div className="space-y-4">
            <div className={`rounded-lg p-4 transition-all duration-300 ${
              isActive ? 'bg-blue-50 border-2 border-blue-300' : 'bg-gray-50'
            }`}>
              <label className="block text-lg font-medium text-gray-900 mb-2 font-sans">{step.title}</label>
              {step.description && (
                <p className="text-gray-600 mb-4 font-sans">{step.description}</p>
              )}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={isCompleted ? "sarah@techcorp.com" : ""}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-gray-900 font-sans"
                  placeholder="Enter email address..."
                  readOnly
                />
              </div>
            </div>
          </div>
        );

      case 'url':
        return (
          <div className="space-y-4">
            <div className={`rounded-lg p-4 transition-all duration-300 ${
              isActive ? 'bg-blue-50 border-2 border-blue-300' : 'bg-gray-50'
            }`}>
              <label className="block text-lg font-medium text-gray-900 mb-2 font-sans">{step.title}</label>
              {step.description && (
                <p className="text-gray-600 mb-4 font-sans">{step.description}</p>
              )}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  value={isCompleted ? "https://dribbble.com/shots/modern-saas" : ""}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-gray-900 font-sans"
                  placeholder="https://example.com"
                  readOnly
                />
              </div>
            </div>
          </div>
        );

      case 'file_upload':
        return (
          <div className="space-y-4">
            <div className={`rounded-lg p-4 transition-all duration-300 ${
              isActive ? 'bg-blue-50 border-2 border-blue-300' : 'bg-gray-50'
            }`}>
              <label className="block text-lg font-medium text-gray-900 mb-2 font-sans">{step.title}</label>
              {step.description && (
                <p className="text-gray-600 mb-4 font-sans">{step.description}</p>
              )}
              <div className="relative">
                <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isCompleted ? 'border-green-300 bg-green-50' : 'border-gray-300'
                }`}>
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <div className="text-gray-600 mb-2 font-sans">
                    {isCompleted ? (
                      <span className="text-green-600 font-medium">✓ brand-assets.zip uploaded</span>
                    ) : (
                      'Drop files here or click to upload'
                    )}
                  </div>
                  {step.options && (
                    <div className="text-xs text-gray-500 font-sans">
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

  const renderCustomerView = () => (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="h-2 bg-blue-600"></div>
        
        <div className="px-6 py-8 text-center bg-blue-50">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-sans">Website Design Project</h1>
          <p className="text-gray-600 text-lg font-sans">Complete these steps to start your website design project</p>
          
          {/* Progress Bar */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 font-sans">Progress</span>
              <span className="text-sm font-medium text-gray-700 font-sans">
                {customerProgress.length}/{checklistSteps.length} completed
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="h-3 rounded-full transition-all duration-300 bg-blue-600"
                style={{ width: `${(customerProgress.length / checklistSteps.length) * 100}%` }}
              ></div>
            </div>
            <div className="text-center mt-2">
              <span className="text-lg font-bold text-blue-600 font-sans">
                {Math.round((customerProgress.length / checklistSteps.length) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Info Form */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 font-sans">Your Information</h2>
        
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
                value="sarah@techcorp.com"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans"
                readOnly
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
                value="Sarah Mitchell"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans"
                readOnly
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
                value="TechCorp"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="bg-white rounded-xl shadow-lg p-6 max-h-[60vh] overflow-y-auto" ref={customerScrollRef}>
        <h2 className="text-xl font-semibold text-gray-900 mb-6 font-sans">Checklist Steps</h2>
        
        <div className="space-y-6">
          {checklistSteps.map((step, index) => (
            <div key={index} data-customer-step={index}>
              {renderStepInput(step, index)}
            </div>
          ))}
        </div>

        {/* Complete Button */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors font-sans ${
              customerProgress.length === checklistSteps.length
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={customerProgress.length !== checklistSteps.length}
          >
            {customerProgress.length === checklistSteps.length ? (
              <>
                <CheckCircle className="w-5 h-5 inline mr-2" />
                Complete Checklist
              </>
            ) : (
              `Complete ${checklistSteps.filter(s => s.is_required).length - customerProgress.filter((_, i) => checklistSteps[i].is_required).length} required steps`
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderBranding = () => (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white shadow-sm rounded-xl border border-gray-200">
        <div className="px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-sans">Brand Settings</h1>
            <p className="text-gray-600 font-sans">Customize the appearance of your onboarding checklists</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Settings Panel */}
            <div className="space-y-6" ref={brandingScrollRef}>
              <div className="space-y-6">
                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                    Logo URL
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="url"
                      value="https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                      readOnly
                    />
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 font-sans">
                      <Upload className="h-4 w-4" />
                      <span>Upload</span>
                    </button>
                  </div>
                </div>

                {/* Primary Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                    Primary Color
                  </label>
                  <div className="flex space-x-3 items-center">
                    <input
                      type="color"
                      value={brandingState.primaryColor}
                      className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                      readOnly
                    />
                    <input
                      type="text"
                      value={brandingState.primaryColor}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
                      readOnly
                    />
                  </div>
                </div>

                {/* Secondary Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                    Secondary Color
                  </label>
                  <div className="flex space-x-3 items-center">
                    <input
                      type="color"
                      value={brandingState.secondaryColor}
                      className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                      readOnly
                    />
                    <input
                      type="text"
                      value={brandingState.secondaryColor}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
                      readOnly
                    />
                  </div>
                </div>

                {/* Font Family */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                    Font Family
                  </label>
                  <select
                    value={brandingState.fontFamily}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                    disabled
                  >
                    <option value="Montserrat">Montserrat (Default)</option>
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Live Preview */}
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 font-sans">Live Preview</h3>
                </div>
              </div>

              {/* Checklist Preview */}
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-lg">
                {/* Header with brand color */}
                <div 
                  className="h-3 w-full"
                  style={{ backgroundColor: brandingState.primaryColor }}
                ></div>
                
                <div 
                  className="px-6 py-8 text-center"
                  style={{ 
                    backgroundColor: `${brandingState.primaryColor}10`,
                    fontFamily: brandingState.fontFamily 
                  }}
                >
                  <div className="flex justify-center mb-4">
                    <img 
                      src="https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg" 
                      alt="Logo" 
                      className="h-12 max-w-48 object-contain"
                    />
                  </div>
                  <h1 className="text-2xl font-bold mb-2 text-gray-900">Website Design Project</h1>
                  <p className="text-gray-600">Complete these steps to start your website design project</p>
                </div>

                <div className="p-6 space-y-4" style={{ fontFamily: brandingState.fontFamily }}>
                  {/* Sample checklist steps */}
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <div 
                      className="w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5"
                      style={{ borderColor: brandingState.primaryColor, backgroundColor: brandingState.primaryColor }}
                    >
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Join Project Slack</h4>
                      <p className="text-sm text-gray-600 mt-1">Get access to our project communication channel</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                    <div 
                      className="w-5 h-5 rounded border-2 mt-0.5"
                      style={{ borderColor: brandingState.primaryColor }}
                    ></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Upload Logo & Brand Assets</h4>
                      <p className="text-sm text-gray-600 mt-1">Share your logo, brand guidelines, and visual assets</p>
                      <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-3 text-center">
                        <p className="text-sm text-gray-500">Drop files here or click to upload</p>
                      </div>
                    </div>
                  </div>

                  {/* Sample button */}
                  <button
                    type="button"
                    className="w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors mt-6"
                    style={{ 
                      backgroundColor: brandingState.secondaryColor,
                      fontFamily: brandingState.fontFamily 
                    }}
                  >
                    Submit Project Info
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderOverview();
      case 1:
        return renderChecklistSetup();
      case 2:
        return renderCustomerView();
      case 3:
        return renderBranding();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DemoHeader />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Demo Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-sans">
              See OnboardFlo in Action
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 font-sans">
              Watch how easy it is to create, customize, and track customer onboarding flows
            </p>
            
            {!isPlaying && (
              <button
                onClick={startDemo}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-sans"
              >
                Start Interactive Demo
              </button>
            )}
          </div>

          {isPlaying && (
            <>
              {/* Step Navigation */}
              <div className="flex items-center justify-center mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 flex items-center space-x-2">
                  {demoSteps.map((step, index) => (
                    <button
                      key={step.id}
                      onClick={() => {
                        setCurrentStep(index);
                        // Reset scroll when moving to branding
                        if (index === 3) {
                          setTimeout(() => scrollToTop(brandingScrollRef), 100);
                        }
                      }}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors font-sans ${
                        currentStep === index
                          ? 'bg-emerald-500 text-white'
                          : currentStep > index
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{index + 1}</span>
                        {currentStep > index && <CheckCircle className="w-4 h-4" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Step Info */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 font-sans">
                  {demoSteps[currentStep].title}
                </h2>
                <p className="text-gray-600 font-sans">
                  {demoSteps[currentStep].description}
                </p>
              </div>

              {/* Demo Content */}
              <div className="flex items-center justify-center mb-8">
                {renderCurrentStep()}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-sans"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                
                <button
                  onClick={nextStep}
                  disabled={currentStep === demoSteps.length - 1}
                  className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-sans"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}