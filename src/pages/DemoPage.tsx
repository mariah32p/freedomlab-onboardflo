import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle,
  Users,
  BarChart3,
  Clock,
  ArrowRight,
  Sparkles,
  Eye,
  Send,
  Copy,
  Plus,
  Edit,
  Palette,
  Link as LinkIcon,
  Trash2,
  ExternalLink,
  Mail,
  Building,
  User,
  Check,
  AlertCircle,
  TrendingUp,
  Calendar,
  RotateCcw,
  Upload,
  X,
  Save
} from 'lucide-react';
import DemoHeader from '../components/DemoHeader';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  duration: number;
}

// Defined outside the component for performance and stability.
const demoSteps: DemoStep[] = [
    {
      id: 'dashboard',
      title: 'Dashboard Overview',
      description: 'Real-time customer onboarding analytics and activity feed',
      duration: 2500,
    },
    {
      id: 'checklists',
      title: 'Checklist Management',
      description: 'Create and manage onboarding flows with templates',
      // FIX: Increased duration to allow the entire animation to play.
      duration: 7000,
    },
    {
      id: 'submissions',
      title: 'Customer Submissions',
      description: 'Track customer progress and manage submissions',
      duration: 2500,
    },
    {
      id: 'customer-view',
      title: 'Customer Experience',
      description: 'Beautiful, mobile-friendly checklist interface',
      duration: 11000,
    },
    {
      id: 'branding',
      title: 'Brand Customization',
      description: 'Customize colors, fonts, and logos to match your brand',
      duration: 4000,
    }
  ];


export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [builderActiveTab, setBuilderActiveTab] = useState<'settings' | 'steps'>('settings');
  const [builderSteps, setBuilderSteps] = useState<any[]>([]);
  const [animatedStats, setAnimatedStats] = useState({ users: 0, completed: 0, rate: 0, days: 0 });
  const [animatedProgress, setAnimatedProgress] = useState<Record<string, number>>({});
  const [activityItems, setActivityItems] = useState([
    { user: 'Emma W.', action: 'uploaded brand assets', time: '5 min ago', type: 'success' },
    { user: 'Alex P.', action: 'completed requirements', time: '12 min ago', type: 'success' },
    { user: 'Mike R.', action: 'started onboarding', time: '15 min ago', type: 'info' },
    { user: 'Lisa K.', action: 'needs assistance', time: '1 hour ago', type: 'warning' }
  ]);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [showNewActivity, setShowNewActivity] = useState(false);
  const [checklistSetupStep, setChecklistSetupStep] = useState(0);
  const [setupSteps, setSetupSteps] = useState<any[]>([]);
  const [currentActiveStep, setCurrentActiveStep] = useState<string | null>(null);
  const [checklistSteps, setChecklistSteps] = useState<any[]>([]);
  const [checklistSettings, setChecklistSettings] = useState({
    title: '',
    description: '',
    visibility: ''
  });
  const [activeChecklistTab, setActiveChecklistTab] = useState<'settings' | 'steps'>('settings');

  // FIX: Added a ref to control the scrolling of the checklist builder's step list.
  const checklistStepsContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto-advance steps
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      if (currentStep < demoSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
        setProgress(0);
      } else {
        // Simplified the reset logic to prevent stalling.
        setCurrentStep(0);
        setProgress(0);
        setAnimatedStats({ users: 0, completed: 0, rate: 0, days: 0 });
        setAnimatedProgress({});
        setShowNewActivity(false);
        setActivityItems([
          { user: 'Mike R.', action: 'started onboarding', time: '15 min ago', type: 'info' },
          { user: 'Lisa K.', action: 'needs assistance', time: '1 hour ago', type: 'warning' },
          { user: 'David L.', action: 'completed step 3', time: '2 hours ago', type: 'success' }
        ]);
        setCompletedSteps([]);
      }
    }, demoSteps[currentStep].duration);

    return () => clearTimeout(timer);
  }, [currentStep, isPlaying]);

  // Progress bar animation
  useEffect(() => {
    const duration = demoSteps[currentStep].duration;
    const interval = 50;
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      if (isPlaying) {
        setProgress(prev => {
          const newProgress = prev + increment;
          return newProgress >= 100 ? 100 : newProgress;
        });
      }
    }, interval);

    return () => clearInterval(timer);
  }, [currentStep, isPlaying]);

  // Step-specific animations
  useEffect(() => {
    // FIX: Automatically scroll to the top when the step changes for a better UX.
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Reset animations when step changes
    setAnimatedStats({ users: 0, completed: 0, rate: 0, days: 0 });
    setAnimatedProgress({});
    setActivityItems([
      { user: 'Emma W.', action: 'uploaded brand assets', time: '5 min ago', type: 'success' },
      { user: 'Alex P.', action: 'completed requirements', time: '12 min ago', type: 'success' },
      { user: 'Mike R.', action: 'started onboarding', time: '15 min ago', type: 'info' },
      { user: 'Lisa K.', action: 'needs assistance', time: '1 hour ago', type: 'warning' }
    ]);
    setCompletedSteps([]);
    setShowNewActivity(false);

    if (currentStep === 0) {
      // Dashboard animations
      setTimeout(() => {
        setAnimatedStats({ users: 247, completed: 215, rate: 87, days: 2.3 });
      }, 200);

      setTimeout(() => {
        setShowNewActivity(true);
        setTimeout(() => {
          setActivityItems([
            { user: 'Sarah M.', action: 'completed setup', time: '2 min ago', type: 'success' },
            { user: 'Emma W.', action: 'uploaded brand assets', time: '5 min ago', type: 'success' },
            { user: 'Alex P.', action: 'completed requirements', time: '12 min ago', type: 'success' },
            { user: 'Mike R.', action: 'started onboarding', time: '15 min ago', type: 'info' },
            { user: 'Lisa K.', action: 'needs assistance', time: '1 hour ago', type: 'warning' }
          ]);
          setShowNewActivity(false);
        }, 500);
      }, 1500); // Adjusted to fit new shorter slide duration
    } else if (currentStep === 1) {
      // Reset checklist builder state
      setChecklistSteps([]);
      setChecklistSettings({ title: '', description: '', visibility: '' });
      setActiveChecklistTab('settings');
      setChecklistSetupStep(0);

      // Settings autofill sequence
      setTimeout(() => {
        setChecklistSetupStep(1);
        setChecklistSettings(prev => ({ ...prev, title: 'Website Design Project' }));
      }, 300);
      
      setTimeout(() => {
        setChecklistSetupStep(2);
        setChecklistSettings(prev => ({ ...prev, description: 'Complete these steps to start your website design project' }));
      }, 800);
      
      setTimeout(() => {
        setChecklistSetupStep(3);
        setChecklistSettings(prev => ({ ...prev, visibility: 'Public - Anyone with the link can access' }));
      }, 2000);

      // Switch to steps tab
      setTimeout(() => {
        setActiveChecklistTab('steps');
      }, 2200);

      // Add steps one by one
      const stepsToAdd = [
        { title: 'Join Project Slack', step_type: 'checkbox', is_required: true },
        { title: 'Upload Logo & Brand Assets', step_type: 'file_upload', is_required: true },
        { title: 'Brand Requirements & Vision', step_type: 'textarea', is_required: true },
        { title: 'Primary Contact Information', step_type: 'email', is_required: true },
        { title: 'Design Inspiration Links', step_type: 'url', is_required: false },
        { title: 'Project Timeline', step_type: 'text', is_required: true },
        { title: 'Schedule Kickoff Meeting', step_type: 'checkbox', is_required: true }
      ];

      stepsToAdd.forEach((step, index) => {
        setTimeout(() => {
          setChecklistSteps(prev => [...prev, { ...step, id: `step-${index}` }]);
        }, 2500 + (index * 400));
      });
    } else if (currentStep === 2) {
      // Checklist setup animation - first settings, then steps
      setSetupSteps([]);
      setChecklistSetupStep(0);
      
      // Settings autofill sequence
      setTimeout(() => setChecklistSetupStep(1), 300); // Title
      setTimeout(() => setChecklistSetupStep(2), 800); // Description
      setTimeout(() => setChecklistSetupStep(3), 1200); // Visibility
      
      // Then add steps that match the customer view
      const steps = [
        { title: 'Join Project Slack', description: 'Accept invitation to our design team workspace', step_type: 'checkbox' },
        { title: 'Upload Logo & Brand Assets', description: 'Share your current logo, brand guidelines, and any existing materials', step_type: 'file_upload' },
        { title: 'Brand Requirements & Vision', description: 'Tell us about your brand personality, target audience, and design preferences', step_type: 'textarea' },
        { title: 'Primary Contact Information', description: 'Who should we contact for design feedback and approvals?', step_type: 'email' },
        { title: 'Design Inspiration Links', description: 'Share websites or designs you love for style reference', step_type: 'url' },
        { title: 'Project Timeline', description: 'When do you need the website completed?', step_type: 'text' },
        { title: 'Schedule Kickoff Meeting', description: 'Book a 60-minute strategy session to discuss your project in detail', step_type: 'checkbox' }
      ];
      
      steps.forEach((step, index) => {
        setTimeout(() => {
          setSetupSteps(prev => [...prev, step]);
        }, 1600 + (index * 300)); // Start after settings, then 300ms between steps
      });
    } else if (currentStep === 3) {
      // Customer view animations - slower progression through all steps
      const steps = ['slack', 'logo', 'brand', 'contact', 'inspiration', 'timeline', 'kickoff'];
      steps.forEach((step, index) => {
        setTimeout(() => {
          // Set as active step first
          setCurrentActiveStep(step);
          
          // Scroll to the step
          setTimeout(() => {
            const stepElement = document.getElementById(`step-${step}`);
            if (stepElement) {
              stepElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
              });
            }
          }, 100);
          
          // Complete the step after showing it's active
          setTimeout(() => {
            setCompletedSteps(prev => [...prev, step]);
            setCurrentActiveStep(null);
          }, 800);
        }, (index + 1) * 1500);
      });
    }
  }, [currentStep]);

  // FIX: Add a new useEffect to handle auto-scrolling in the checklist builder.
  // This effect runs whenever the list of checklistSteps changes.
  useEffect(() => {
    if (checklistStepsContainerRef.current) {
      const container = checklistStepsContainerRef.current;
      // Scroll to the bottom of the container to show the newly added step.
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [checklistSteps]);

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
    setProgress(0);
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const renderDashboard = () => (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 font-sans">Dashboard</h1>
        <p className="text-gray-600 font-sans">Overview of your onboarding performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900 font-sans">{animatedStats.users}</div>
              <div className="text-sm text-gray-600 font-sans">Active Customers</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900 font-sans">{animatedStats.rate}%</div>
              <div className="text-sm text-gray-600 font-sans">Completion Rate</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900 font-sans">{animatedStats.days}</div>
              <div className="text-sm text-gray-600 font-sans">Avg Days</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900 font-sans">12</div>
              <div className="text-sm text-gray-600 font-sans">Need Help</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 font-sans">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {/* New activity notification sliding in from right */}
            {showNewActivity && (
              <div className="flex items-start animate-slide-in">
                <div className="w-2 h-2 rounded-full mt-2 mr-3 bg-emerald-500"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 font-sans">
                    <span className="font-medium">Sarah M.</span> completed setup
                  </p>
                  <p className="text-xs text-gray-500 font-sans">2 min ago</p>
                </div>
              </div>
            )}
            {activityItems.map((activity, index) => (
              <div
                key={index}
                className="flex items-start"
              >
                <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                  activity.type === 'success' ? 'bg-emerald-500' :
                  activity.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 font-sans">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 font-sans">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderChecklists = () => (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 font-sans mb-2">Create New Checklist</h2>
        <p className="text-gray-600 font-sans">Watch as we build a website design onboarding checklist</p>
      </div>

      {/* Checklist Builder Interface */}
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 font-sans">Checklist Builder</h3>
            <p className="text-sm text-gray-600 mt-1 font-sans">Creating a professional onboarding flow</p>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="border-b border-gray-200 bg-gray-50">
          <nav className="flex">
            <button
              className={`px-6 py-3 font-medium text-sm transition-colors font-sans relative ${
                activeChecklistTab === 'settings'
                  ? 'border-b-2 border-emerald-500 text-emerald-600 bg-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Settings
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm transition-colors font-sans relative ${
                activeChecklistTab === 'steps'
                  ? 'border-b-2 border-emerald-500 text-emerald-600 bg-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Steps
              <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs">
                {checklistSteps.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1">
            {/* Form */}
            <div className="space-y-6">
              {activeChecklistTab === 'settings' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                      Checklist Title
                    </label>
                    <input
                      type="text"
                      value={checklistSetupStep >= 1 ? "Website Design Project" : ""}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans transition-all duration-300 ${
                        checklistSetupStep >= 1 ? 'bg-white' : 'bg-gray-50'
                      }`}
                      placeholder="e.g., SaaS Onboarding Checklist"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                      Description
                    </label>
                    <textarea
                      value={checklistSetupStep >= 2 ? "Complete these steps to start your website design project" : ""}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans transition-all duration-300 ${
                        checklistSetupStep >= 2 ? 'bg-white' : 'bg-gray-50'
                      }`}
                      placeholder="Brief description of this onboarding flow"
                      rows={3}
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3 font-sans">
                      Visibility
                    </label>
                    <div className={`space-y-3 transition-all duration-300 ${
                      checklistSetupStep >= 3 ? 'opacity-100' : 'opacity-50'
                    }`}>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="visibility"
                          checked={checklistSetupStep >= 3}
                          className="mr-3 text-emerald-600 focus:ring-emerald-500"
                          readOnly
                        />
                        <div className="flex items-center">
                          <Eye className={`w-4 h-4 mr-2 ${checklistSetupStep >= 3 ? 'text-emerald-500' : 'text-gray-400'}`} />
                          <span className="font-sans">Public - Anyone with the link can access</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeChecklistTab === 'steps' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 font-sans">Checklist Steps</h3>
                      <p className="text-sm text-gray-600 font-sans">
                        Add, edit, and reorder the steps customers will complete
                      </p>
                    </div>
                  </div>

                  {checklistSteps.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-gray-400 text-lg">+</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 font-sans">No steps added yet</h3>
                      <p className="text-gray-600 font-sans">
                        Add steps to create your onboarding checklist
                      </p>
                    </div>
                  ) : (
                    // FIX: Added ref and styling to make this container scrollable.
                    <div
                      ref={checklistStepsContainerRef}
                      className="space-y-3 max-h-[400px] overflow-y-auto p-1 pr-2 rounded-lg border"
                    >
                      {checklistSteps.map((step, index) => (
                        <div key={step.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow animate-slide-in">
                          <div className="flex items-start">
                            <div className="flex items-center mr-3 mt-1">
                              <span className="text-sm text-gray-500 mr-2 font-sans">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center mb-1">
                                    <span className="text-sm mr-2">
                                      {step.step_type === 'text' ? '📝' :
                                        step.step_type === 'textarea' ? '📄' :
                                        step.step_type === 'file_upload' ? '📎' :
                                        step.step_type === 'url' ? '🔗' :
                                        step.step_type === 'email' ? '📧' : '☑️'}
                                    </span>
                                    <h4 className="font-medium text-gray-900 font-sans">{step.title}</h4>
                                  </div>
                                  <div className="flex items-center mt-2">
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium font-sans mr-2">
                                      {step.step_type === 'checkbox' ? 'Checkbox' :
                                        step.step_type === 'text' ? 'Text Input' :
                                        step.step_type === 'textarea' ? 'Long Text' :
                                        step.step_type === 'file_upload' ? 'File Upload' :
                                        step.step_type === 'url' ? 'Website URL' :
                                        step.step_type === 'email' ? 'Email' : 'Checkbox'}
                                    </span>
                                    {step.is_required && (
                                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium font-sans">
                                        Required
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1 ml-4">
                                  <button className="p-1 text-gray-400 hover:text-gray-600">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>
                                  </button>
                                  <button className="p-1 text-gray-400 hover:text-gray-600">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </button>
                                  <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                  <button className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600 font-sans">
            {checklistSteps.length > 0 && activeChecklistTab === 'steps' && (
              <span className="text-emerald-600 font-medium">● Building checklist...</span>
            )}
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
    </div>
  );

  const renderSubmissions = () => (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 font-sans">Customer Submissions</h1>
        <p className="text-gray-600 font-sans">Track customer progress across all your onboarding checklists</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900 font-sans">44</div>
              <div className="text-sm text-gray-600 font-sans">Total Links</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900 font-sans">8</div>
              <div className="text-sm text-gray-600 font-sans">Pending</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900 font-sans">15</div>
              <div className="text-sm text-gray-600 font-sans">Active</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900 font-sans">21</div>
              <div className="text-sm text-gray-600 font-sans">Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Sessions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 font-sans">Customer Sessions</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              {
                name: 'Sarah Mitchell',
                email: 'sarah@techflow.com',
                company: 'TechFlow Inc',
                checklist: 'Website Design Onboarding',
                status: 'started',
                progress: 85,
                linkName: 'Corporate Website Redesign',
                created: 'Jan 15, 2025 2:14 PM',
                lastActivity: '5 min ago'
              },
              {
                name: 'Michael Rodriguez',
                email: 'mike@datavault.io',
                company: 'DataVault',
                checklist: 'Website Design Feedback & Approval',
                status: 'completed',
                progress: 100,
                linkName: 'Homepage Feedback Round 2',
                created: 'Jan 14, 2025 10:30 AM',
                lastActivity: '2 hours ago'
              },
              {
                name: 'Lisa Chen',
                email: 'lisa@growthco.com',
                company: 'GrowthCo',
                checklist: 'Website Design Offboarding',
                status: 'started',
                progress: 45,
                linkName: 'Final Deliverables & Training',
                created: 'Jan 14, 2025 4:22 PM',
                lastActivity: '1 hour ago'
              },
              {
                name: 'David Thompson',
                email: 'david@scaletech.ai',
                company: 'ScaleTech AI',
                checklist: 'Website Design Onboarding',
                status: 'started',
                progress: 70,
                linkName: 'E-commerce Platform Setup',
                created: 'Jan 13, 2025 11:45 AM',
                lastActivity: '30 min ago'
              }
            ].map((session, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center flex-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white text-sm font-bold font-sans">
                      {session.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-gray-900 font-sans">{session.name}</h3>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium font-sans">
                            {session.linkName}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-1">
                          <div className="flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            <span className="font-sans">{session.email}</span>
                          </div>
                          <div className="flex items-center">
                            <Building className="w-3 h-3 mr-1" />
                            <span className="font-sans">{session.company}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="font-sans">Checklist: {session.checklist}</span>
                          <span className="font-sans">Created: {session.created}</span>
                          <span className="font-sans">Last activity: {session.lastActivity}</span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className={`text-sm font-medium font-sans ${
                          session.status === 'completed' ? 'text-emerald-600' : 'text-blue-600'
                        }`}>
                          {session.status === 'completed' ? 'Completed' : 'In Progress'}
                        </div>
                        {session.status === 'completed' ? (
                          <div className="text-xs text-emerald-600 mt-1 font-sans font-medium">
                            100% complete
                          </div>
                        ) : (
                          <div className="text-xs text-gray-500 mt-1 font-sans">
                            {animatedProgress[session.name.split(' ')[0].toLowerCase()] || 0}% complete
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCustomerView = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="h-2 bg-emerald-500"></div>

        <div className="px-6 py-8 text-center bg-emerald-50">
          <div className="flex justify-center mb-4">
            <img
              src="/Freedom Lab Logos (3).png"
              alt="Freedom Lab Logo"
              className="h-8 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-sans">Website Design Project</h1>
          <p className="text-gray-600 text-lg font-sans">Complete these steps to start your website design project</p>

          <div className="mt-6 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 font-sans">Progress</span>
              <span className="text-sm font-medium text-gray-700 font-sans">
                {completedSteps.length}/7 completed
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-3 bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${(completedSteps.length / 7) * 100}%` }}
              ></div>
            </div>
            <div className="text-center mt-2">
              <span className="text-lg font-bold text-emerald-600 font-sans">
                {Math.round((completedSteps.length / 7) * 100)}%
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {[
            {
              id: 'slack',
              title: 'Join Project Slack',
              desc: 'Accept invitation to our design team workspace',
              type: 'checkbox'
            },
            {
              id: 'logo',
              title: 'Upload Logo & Brand Assets',
              desc: 'Share your current logo, brand guidelines, and any existing materials',
              type: 'file_upload'
            },
            {
              id: 'brand',
              title: 'Brand Requirements & Vision',
              desc: 'Tell us about your brand personality, target audience, and design preferences',
              type: 'textarea'
            },
            {
              id: 'contact',
              title: 'Primary Contact Information',
              desc: 'Who should we contact for design feedback and approvals?',
              type: 'email'
            },
            {
              id: 'inspiration',
              title: 'Design Inspiration Links',
              desc: 'Share websites or designs you love for style reference',
              type: 'url'
            },
            {
              id: 'timeline',
              title: 'Project Timeline',
              desc: 'When do you need the website completed?',
              type: 'text'
            },
            {
              id: 'kickoff',
              title: 'Schedule Kickoff Meeting',
              desc: 'Book a 60-minute strategy session to discuss your project in detail',
              type: 'checkbox'
            }
          ].map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isActive = currentActiveStep === step.id || (index === completedSteps.length && !isCompleted && !currentActiveStep);

            return (
              <div
                key={step.id}
                id={`step-${step.id}`}
                className={`flex items-start space-x-3 p-4 rounded-lg transition-all duration-300 ${
                  isActive ? 'bg-blue-50 border border-blue-200' :
                  isCompleted ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-50'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center mt-0.5 transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : isActive
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300'
                  }`}
                >
                  {isCompleted && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 font-sans">{step.title}</h4>
                  <p className="text-sm text-gray-600 mt-1 font-sans">{step.desc}</p>
                  {isActive && step.type === 'textarea' && (
                    <textarea
                      placeholder="Tell us about your brand vision, target audience, and design style preferences..."
                      className="w-full mt-3 px-3 py-3 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                      rows={3}
                    />
                  )}
                  {isActive && step.type === 'text' && (
                    <input
                      type="text"
                      placeholder="e.g., March 15, 2025"
                      className="w-full mt-3 px-3 py-3 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                    />
                  )}
                  {isActive && step.type === 'email' && (
                    <div className="mt-3 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        placeholder="contact@yourcompany.com"
                        className="w-full pl-10 pr-3 py-3 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                      />
                    </div>
                  )}
                  {isActive && step.type === 'url' && (
                    <div className="mt-3 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LinkIcon className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="url"
                        placeholder="https://example.com/inspiration"
                        className="w-full pl-10 pr-3 py-3 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                      />
                    </div>
                  )}
                  {isActive && step.type === 'file_upload' && (
                    <div className="mt-3 border-2 border-dashed border-blue-300 rounded-lg p-4 text-center bg-blue-50">
                      <Upload className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                      <div className="text-blue-600 text-sm font-medium font-sans mb-1">
                        Drop files here or click to upload
                      </div>
                      <div className="text-xs text-blue-500 font-sans">
                        PNG, JPG, PDF, AI files accepted
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderBranding = () => (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white shadow-sm rounded-xl border border-gray-200">
        <div className="px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-sans">Brand Settings</h1>
            <p className="text-gray-600 font-sans">Customize the appearance of your onboarding checklists</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Settings Panel */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Logo</label>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value="https://example.com/logo.png"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                    placeholder="https://example.com/logo.png"
                    readOnly
                  />
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 font-sans">
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 font-sans">Color Presets</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { name: 'OnboardFlo Default', primary: '#10b981', secondary: '#059669' },
                    { name: 'Ocean Blue', primary: '#0066cc', secondary: '#00a8ff' },
                    { name: 'Forest Green', primary: '#2d5a27', secondary: '#4caf50' },
                    { name: 'Sunset Orange', primary: '#e65100', secondary: '#ff9800' },
                    { name: 'Royal Purple', primary: '#4a148c', secondary: '#9c27b0' },
                    { name: 'Crimson Red', primary: '#b71c1c', secondary: '#f44336' },
                    { name: 'Deep Teal', primary: '#004d40', secondary: '#00695c' },
                    { name: 'Warm Pink', primary: '#c2185b', secondary: '#e91e63' }
                  ].map((preset, index) => (
                    <button
                      key={preset.name}
                      className={`flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors text-left ${
                        index === 0 ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex space-x-1">
                        <div
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: preset.primary }}
                        ></div>
                        <div
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: preset.secondary }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-700 font-sans">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Primary Color</label>
                <div className="flex space-x-3 items-center">
                  <div className="w-12 h-10 bg-emerald-500 border border-gray-300 rounded-lg"></div>
                  <input
                    type="text"
                    value="#10b981"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                    readOnly
                  />
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

              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-lg">
                <div className="h-3 w-full bg-emerald-500"></div>

                <div className="px-6 py-8 text-center bg-emerald-50">
                  <div className="flex justify-center mb-4">
                    <img
                      src="/Freedom Lab Logos (3).png"
                      alt="Freedom Lab Logo"
                      className="h-4 object-contain"
                    />
                  </div>
                  <h1 className="text-2xl font-bold mb-2 text-gray-900 font-sans">SaaS Onboarding Checklist</h1>
                  <p className="text-gray-600 font-sans">Complete these steps to get started with our platform</p>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-start space-x-3 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="w-5 h-5 rounded border-2 border-emerald-500 bg-emerald-500 flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 font-sans">Account Setup</h4>
                      <p className="text-sm text-gray-600 mt-1 font-sans">Complete your profile and verify your email</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                    <div className="w-5 h-5 rounded border-2 border-emerald-500 mt-0.5"></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 font-sans">Project Requirements</h4>
                      <p className="text-sm text-gray-600 mt-1 font-sans">Tell us about your project goals and requirements</p>
                    </div>
                  </div>

                  <button className="w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors mt-6 bg-emerald-600 font-sans">
                    Submit Onboarding Info
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
      case 0: return renderDashboard();
      case 1: return renderChecklists();
      case 2: return renderSubmissions();
      case 3: return renderCustomerView();
      case 4: return renderBranding();
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DemoHeader />
      <div className="pt-20">
        {/* Demo Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
}