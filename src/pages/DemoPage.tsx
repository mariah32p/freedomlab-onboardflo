import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Plus,
  Edit,
  ExternalLink,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  BarChart3,
  Target,
  Zap,
  Mail,
  Building,
  User,
  Upload,
  Link as LinkIcon,
  Calendar,
  Star,
  Palette,
  Globe,
  FileText,
  CreditCard,
  Phone,
  MessageSquare,
  Camera,
  Layers,
  Monitor,
  Smartphone,
  Save,
  Send,
  Eye,
  X,
  Trash2,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import DemoHeader from '../components/DemoHeader';

export default function DemoPage() {
  const [currentView, setCurrentView] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Checklist building state
  const [checklistTitle, setChecklistTitle] = useState('');
  const [checklistDescription, setChecklistDescription] = useState('');
  const [steps, setSteps] = useState<any[]>([]);
  const [currentStepForm, setCurrentStepForm] = useState({
    title: '',
    description: '',
    type: 'textarea',
    required: true
  });
  
  // Customer experience state
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    company: ''
  });
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [currentCustomerStep, setCurrentCustomerStep] = useState(0);
  const [showCustomerForm, setShowCustomerForm] = useState(true);

  const views = [
    'dashboard',
    'create-checklist', 
    'build-checklist',
    'customer-experience',
    'completion'
  ];

  // Auto-advance through views
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentView(prev => (prev + 1) % views.length);
    }, 15000); // 15 seconds per view

    return () => clearInterval(timer);
  }, []);

  // Reset state when view changes
  useEffect(() => {
    setCurrentStep(0);
    
    if (views[currentView] === 'create-checklist') {
      setChecklistTitle('');
      setChecklistDescription('');
    }
    
    if (views[currentView] === 'build-checklist') {
      setSteps([]);
      setCurrentStepForm({
        title: '',
        description: '',
        type: 'textarea',
        required: true
      });
    }
    
    if (views[currentView] === 'customer-experience') {
      setCustomerData({ name: '', email: '', company: '' });
      setCompletedSteps([]);
      setCurrentCustomerStep(0);
      setShowCustomerForm(true);
    }
  }, [currentView]);

  // Simulate typing and interactions for each view
  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];

    if (views[currentView] === 'create-checklist') {
      // Simulate selecting template
      timeouts.push(setTimeout(() => setCurrentStep(1), 2000));
    }
    
    if (views[currentView] === 'build-checklist') {
      // Simulate building checklist step by step
      timeouts.push(setTimeout(() => {
        setChecklistTitle('Website Design Project Onboarding');
        setChecklistDescription('Complete onboarding process for new website design clients');
        setCurrentStep(1);
      }, 1000));
      
      // Add steps one by one
      const stepData = [
        {
          title: 'Project Discovery & Requirements',
          description: 'Share your project vision, target audience, and key objectives',
          type: 'textarea',
          required: true
        },
        {
          title: 'Brand Assets & Style Guide',
          description: 'Upload your logo, brand guidelines, and design inspiration',
          type: 'file_upload',
          required: true
        },
        {
          title: 'Website Content & Copy',
          description: 'Provide all text content, including page copy and descriptions',
          type: 'file_upload',
          required: true
        },
        {
          title: 'Design Inspiration & References',
          description: 'Share websites you love and describe your preferred style',
          type: 'textarea',
          required: true
        },
        {
          title: 'Technical Requirements',
          description: 'Specify hosting preferences, integrations, and special functionality',
          type: 'textarea',
          required: false
        },
        {
          title: 'Contact Information & Team',
          description: 'Provide team member details and social media profiles',
          type: 'textarea',
          required: true
        },
        {
          title: 'Budget & Timeline Confirmation',
          description: 'Confirm project budget and timeline expectations',
          type: 'checkbox',
          required: true
        },
        {
          title: 'Project Kickoff Call',
          description: 'Schedule our initial strategy session',
          type: 'checkbox',
          required: true
        }
      ];

      stepData.forEach((step, index) => {
        timeouts.push(setTimeout(() => {
          setCurrentStepForm(step);
          setCurrentStep(2 + index);
        }, 2000 + (index * 1500)));
        
        timeouts.push(setTimeout(() => {
          setSteps(prev => [...prev, { ...step, id: `step-${index}` }]);
        }, 2500 + (index * 1500)));
      });
    }
    
    if (views[currentView] === 'customer-experience') {
      // Simulate customer filling out form
      timeouts.push(setTimeout(() => {
        setCustomerData({
          name: 'Sarah Martinez',
          email: 'sarah@techcorp.com',
          company: 'TechCorp Solutions'
        });
      }, 2000));
      
      timeouts.push(setTimeout(() => {
        setShowCustomerForm(false);
        setCurrentStep(1);
      }, 4000));
      
      // Simulate completing steps
      const stepIds = ['step-0', 'step-1', 'step-2', 'step-3'];
      stepIds.forEach((stepId, index) => {
        timeouts.push(setTimeout(() => {
          setCompletedSteps(prev => [...prev, stepId]);
          setCurrentCustomerStep(index + 1);
        }, 5000 + (index * 2000)));
      });
    }

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [currentView]);

  const renderDashboard = () => (
    <div className="space-y-8 pt-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900 font-sans">89</div>
              <div className="text-sm text-gray-600 font-sans">Active Clients</div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900 font-sans">94%</div>
              <div className="text-sm text-gray-600 font-sans">Completion Rate</div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900 font-sans">3.2d</div>
              <div className="text-sm text-gray-600 font-sans">Avg. Time</div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900 font-sans">↑73%</div>
              <div className="text-sm text-gray-600 font-sans">vs Manual</div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Activity */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 font-sans">Live Client Activity</h2>
            <div className="flex items-center text-sm text-emerald-600">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
              <span className="font-sans">Live</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-white text-sm font-bold font-sans">SM</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 font-sans">Sarah Martinez</div>
                  <div className="text-sm text-gray-600 font-sans">Website Design Project</div>
                  <div className="text-xs text-emerald-700 font-sans">✓ Just uploaded brand assets • 2 min ago</div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center mb-2">
                  <div className="w-20 bg-emerald-200 rounded-full h-2 mr-3">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-sm font-bold text-gray-700 font-sans">75%</span>
                </div>
                <div className="text-xs text-emerald-600 font-sans">6/8 steps • 2.1 days</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-white text-sm font-bold font-sans">MC</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 font-sans">Marcus Chen</div>
                  <div className="text-sm text-gray-600 font-sans">E-commerce Website</div>
                  <div className="text-xs text-blue-700 font-sans">Working on design inspiration • 15 min ago</div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center mb-2">
                  <div className="w-20 bg-blue-200 rounded-full h-2 mr-3">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                  <span className="text-sm font-bold text-gray-700 font-sans">50%</span>
                </div>
                <div className="text-xs text-blue-600 font-sans">4/8 steps • 1.5 days</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCreateChecklist = () => (
    <div className="max-w-4xl mx-auto pt-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Plus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4 font-sans">Create New Onboarding Checklist</h2>
          <p className="text-gray-600 text-lg font-sans">Choose a template or start from scratch</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div 
            className={`bg-gradient-to-br from-blue-50 to-purple-50 border-2 rounded-xl p-6 shadow-lg transition-all cursor-pointer ${
              currentStep >= 1 ? 'border-blue-500 scale-105 ring-4 ring-blue-500/20' : 'border-blue-300'
            }`}
          >
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 font-sans">Website Design Project</h3>
              <span className="inline-block px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-medium mt-2">
                Recommended
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4 font-sans">
              Complete onboarding flow for website design clients including discovery, assets, and project setup
            </p>
            <div className="space-y-2 mb-6">
              <div className="text-xs font-medium text-gray-700 mb-2 font-sans">8 steps included:</div>
              <div className="text-xs text-gray-600 space-y-1">
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                  <span className="font-sans">Project discovery & requirements</span>
                </div>
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                  <span className="font-sans">Brand assets & style guide upload</span>
                </div>
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                  <span className="font-sans">Content & copy collection</span>
                </div>
                <div className="text-xs text-gray-500 font-sans">+5 more steps</div>
              </div>
            </div>
            <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl font-sans">
              Use This Template ✨
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Edit className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 font-sans">Start from Scratch</h3>
            </div>
            <p className="text-gray-600 text-sm mb-6 font-sans">
              Create a completely custom checklist tailored to your specific needs
            </p>
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold transition-colors font-sans">
              Create Custom Checklist
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBuildChecklist = () => (
    <div className="max-w-6xl mx-auto pt-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-sans">{checklistTitle || 'Website Design Project Checklist'}</h2>
              <p className="text-blue-100 font-sans">{checklistDescription || 'Building your client onboarding flow'}</p>
            </div>
            <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg font-sans">
              Save Checklist
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Settings Panel */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Checklist Title</label>
                <input 
                  type="text" 
                  value={checklistTitle}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Description</label>
                <textarea 
                  value={checklistDescription}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans"
                  rows={3}
                  readOnly
                />
              </div>

              {/* Current step being added */}
              {currentStep >= 2 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <h4 className="font-medium text-emerald-900 mb-3 font-sans">Adding Step {currentStep - 1}</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-emerald-800 mb-1 font-sans">Step Title</label>
                      <input
                        type="text"
                        value={currentStepForm.title}
                        className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-sm font-sans"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-emerald-800 mb-1 font-sans">Description</label>
                      <textarea
                        value={currentStepForm.description}
                        className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-sm font-sans"
                        rows={2}
                        readOnly
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={currentStepForm.required}
                          className="mr-2 text-emerald-600"
                          readOnly
                        />
                        <span className="text-xs text-emerald-800 font-sans">Required step</span>
                      </div>
                      <button className="bg-emerald-600 text-white px-3 py-1 rounded text-xs font-sans">
                        Add Step
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Steps Preview */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 font-sans">Checklist Steps ({steps.length})</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-lg mr-3">
                        {step.type === 'textarea' ? '📝' : 
                         step.type === 'file_upload' ? '📎' : 
                         step.type === 'checkbox' ? '☑️' : '📝'}
                      </span>
                      <div>
                        <div className="font-medium text-gray-900 text-sm font-sans">{step.title}</div>
                        <div className="text-xs text-gray-500 font-sans">{step.type.replace('_', ' ')}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {step.required && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium font-sans">
                          Required
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCustomerExperience = () => (
    <div className="max-w-3xl mx-auto pt-8">
      {showCustomerForm && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 font-sans">Welcome to Your Website Project!</h2>
            <p className="text-gray-600 font-sans">Let's get started with some basic information</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Full Name *</label>
              <input
                type="text"
                value={customerData.name}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans"
                placeholder="Your full name"
                readOnly
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Email Address *</label>
              <input
                type="email"
                value={customerData.email}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans"
                placeholder="your@email.com"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Company</label>
              <input
                type="text"
                value={customerData.company}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans"
                placeholder="Your company"
                readOnly
              />
            </div>
          </div>
          
          <div className="flex justify-center mt-6">
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl font-sans">
              Continue to Checklist
            </button>
          </div>
        </div>
      )}

      {!showCustomerForm && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white">
            <div className="text-center">
              <h1 className="text-3xl font-bold font-sans mb-2">Website Design Project</h1>
              <p className="text-blue-100 font-sans">Complete these steps to get your project started</p>
              
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-100 font-sans">Progress</span>
                  <span className="text-sm font-medium text-blue-100 font-sans">{completedSteps.length}/8 completed</span>
                </div>
                <div className="w-full bg-blue-400/30 rounded-full h-3">
                  <div 
                    className="bg-white h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(completedSteps.length / 8) * 100}%` }}
                  ></div>
                </div>
                <div className="text-center mt-2">
                  <span className="text-lg font-bold text-white font-sans">
                    {Math.round((completedSteps.length / 8) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="space-y-6">
              {/* Show current step being worked on */}
              {currentCustomerStep < 4 && (
                <div className="bg-blue-50 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-4">📝</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 font-sans">
                        Step {currentCustomerStep + 1}: Project Discovery & Requirements
                      </h3>
                      <span className="inline-block mt-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium font-sans">
                        Required
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 font-sans">Share your project vision, target audience, and key objectives</p>
                  <textarea
                    value={completedSteps.includes('step-0') ? 
                      "We're a boutique marketing agency specializing in B2B SaaS companies. We need a modern, professional website that showcases our case studies and attracts enterprise clients. Our target audience is CMOs and marketing directors at companies with 50-500 employees." : 
                      ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans"
                    placeholder="Describe your project goals, target audience, and key requirements..."
                    rows={4}
                    readOnly
                  />
                  {completedSteps.includes('step-0') && (
                    <div className="mt-3 text-emerald-600 font-medium text-sm font-sans">
                      ✓ Step completed
                    </div>
                  )}
                </div>
              )}

              {/* Show completed steps summary */}
              {completedSteps.length > 0 && (
                <div className="bg-emerald-50 rounded-xl p-4">
                  <h4 className="font-semibold text-emerald-900 mb-3 font-sans">Completed Steps</h4>
                  <div className="space-y-2">
                    {completedSteps.map((stepId, index) => (
                      <div key={stepId} className="flex items-center text-sm text-emerald-700">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        <span className="font-sans">
                          {index === 0 && 'Project Discovery & Requirements'}
                          {index === 1 && 'Brand Assets & Style Guide'}
                          {index === 2 && 'Website Content & Copy'}
                          {index === 3 && 'Design Inspiration & References'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderCompletion = () => (
    <div className="max-w-2xl mx-auto text-center pt-8">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/20">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-8 text-white">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold font-sans mb-4">Fantastic Work, Sarah! 🎉</h1>
          <p className="text-emerald-100 text-lg font-sans">Your website project onboarding is complete!</p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 font-sans">8/8</div>
              <div className="text-sm text-gray-600 font-sans">Steps Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 font-sans">2.1</div>
              <div className="text-sm text-gray-600 font-sans">Days to Complete</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 font-sans">100%</div>
              <div className="text-sm text-gray-600 font-sans">Success Rate</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 font-sans">What happens next?</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p className="font-sans">✓ Our design team will review your requirements within 24 hours</p>
              <p className="font-sans">✓ You'll receive initial wireframes and mood boards by Friday</p>
              <p className="font-sans">✓ We'll schedule your project kickoff call for next week</p>
              <p className="font-sans">✓ Expected project completion: 3-4 weeks</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl font-sans">
              View Project Portal
            </button>
            <button className="bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:border-gray-300 hover:shadow-md font-sans">
              Schedule Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <DemoHeader />
      
      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="transition-all duration-500 ease-in-out">
            {views[currentView] === 'dashboard' && renderDashboard()}
            {views[currentView] === 'create-checklist' && renderCreateChecklist()}
            {views[currentView] === 'build-checklist' && renderBuildChecklist()}
            {views[currentView] === 'customer-experience' && renderCustomerExperience()}
            {views[currentView] === 'completion' && renderCompletion()}
          </div>
        </div>
      </div>
    </div>
  );
}