import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Bell,
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
  Star
} from 'lucide-react';
import DemoHeader from '../components/DemoHeader';

// Demo data with authentic personas
const demoCustomers = [
  {
    id: '1',
    name: 'Sarah Martinez',
    email: 'sarah@techcorp.com',
    company: 'TechCorp',
    checklist: 'SaaS Platform Onboarding',
    progress: 85,
    status: 'active',
    lastActivity: '2 minutes ago',
    stepsCompleted: 6,
    totalSteps: 7,
    currentStep: 'API Integration Setup',
    avatar: 'SM',
    timeSpent: '2.1 days',
    startDate: '3 days ago'
  },
  {
    id: '2',
    name: 'Marcus Chen',
    email: 'marcus@startupxyz.com',
    company: 'StartupXYZ',
    checklist: 'Agency Partnership Onboarding',
    progress: 45,
    status: 'active',
    lastActivity: '15 minutes ago',
    stepsCompleted: 4,
    totalSteps: 9,
    currentStep: 'Brand Asset Upload',
    avatar: 'MC',
    timeSpent: '1.2 days',
    startDate: '2 days ago'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily@growthco.com',
    company: 'GrowthCo',
    checklist: 'Consulting Engagement Setup',
    progress: 100,
    status: 'completed',
    lastActivity: '1 hour ago',
    stepsCompleted: 8,
    totalSteps: 8,
    currentStep: 'Completed!',
    avatar: 'ER',
    timeSpent: '1.8 days',
    startDate: '4 days ago'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david@scaletech.io',
    company: 'ScaleTech',
    checklist: 'Enterprise Implementation',
    progress: 70,
    status: 'needs_help',
    lastActivity: '3 hours ago',
    stepsCompleted: 7,
    totalSteps: 10,
    currentStep: 'Security Review',
    avatar: 'DK',
    timeSpent: '3.5 days',
    startDate: '5 days ago'
  }
];

const demoChecklists = [
  {
    id: '1',
    title: 'SaaS Platform Onboarding',
    description: 'Complete setup flow for new SaaS customers',
    steps: 7,
    sessions: 12,
    completionRate: 87,
    avgTime: '2.3 days',
    color: '#10b981'
  },
  {
    id: '2',
    title: 'Agency Partnership Onboarding',
    description: 'Streamlined process for new agency partners',
    steps: 9,
    sessions: 8,
    completionRate: 92,
    avgTime: '1.8 days',
    color: '#3b82f6'
  },
  {
    id: '3',
    title: 'Enterprise Implementation',
    description: 'Comprehensive setup for enterprise clients',
    steps: 10,
    sessions: 5,
    completionRate: 78,
    avgTime: '4.2 days',
    color: '#8b5cf6'
  }
];

const demoSteps = [
  { title: 'Account Setup & Profile', type: 'checkbox', required: true, completed: true },
  { title: 'Team Member Invitations', type: 'email', required: true, completed: true },
  { title: 'Project Requirements', type: 'textarea', required: true, completed: true },
  { title: 'Brand Assets Upload', type: 'file_upload', required: true, completed: true },
  { title: 'Integration Preferences', type: 'checkbox', required: true, completed: true },
  { title: 'API Configuration', type: 'text', required: true, completed: true },
  { title: 'Final Review & Launch', type: 'checkbox', required: true, completed: false }
];

export default function DemoPage() {
  const [currentView, setCurrentView] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [completingStep, setCompletingStep] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [typingText, setTypingText] = useState('');

  const views = [
    'dashboard',
    'customer-detail', 
    'checklist-builder',
    'customer-experience',
    'completion-celebration',
    'analytics'
  ];

  // Auto-advance through views every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentView(prev => (prev + 1) % views.length);
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  // Typing effect for notifications
  useEffect(() => {
    if (currentView === 1) {
      const text = "Sarah just completed API setup! 🎉";
      let i = 0;
      setTypingText('');
      
      const typeTimer = setInterval(() => {
        if (i < text.length) {
          setTypingText(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(typeTimer);
          setTimeout(() => setShowNotification(true), 500);
        }
      }, 50);

      return () => clearInterval(typeTimer);
    }
  }, [currentView]);

  // Completion celebration effect
  useEffect(() => {
    if (currentView === 4) {
      setTimeout(() => {
        setCompletingStep(true);
        setTimeout(() => {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        }, 1000);
      }, 2000);
    } else {
      setCompletingStep(false);
      setShowConfetti(false);
    }
  }, [currentView]);

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900 font-sans">247</div>
              <div className="text-sm text-gray-600 font-sans">Active Customers</div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900 font-sans">87%</div>
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
              <div className="text-2xl font-bold text-gray-900 font-sans">2.3d</div>
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
              <div className="text-2xl font-bold text-gray-900 font-sans">↑60%</div>
              <div className="text-sm text-gray-600 font-sans">vs Manual</div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Customer Activity */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 font-sans">Live Customer Activity</h2>
            <div className="flex items-center text-sm text-emerald-600">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
              <span className="font-sans">Live</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {demoCustomers.map((customer, index) => (
              <div key={customer.id} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-white transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:shadow-md">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-white text-sm font-bold font-sans">{customer.avatar}</span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <div className="font-semibold text-gray-900 font-sans">{customer.name}</div>
                      <div className="text-sm text-gray-500 font-sans">from {customer.company}</div>
                    </div>
                    <div className="text-sm text-gray-600 font-sans">{customer.checklist}</div>
                    <div className="text-xs text-gray-500 font-sans">
                      {customer.currentStep} • {customer.lastActivity}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center mb-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          customer.status === 'completed' ? 'bg-emerald-500' :
                          customer.status === 'needs_help' ? 'bg-red-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${customer.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-gray-700 font-sans">{customer.progress}%</span>
                  </div>
                  <div className={`text-xs font-medium font-sans ${
                    customer.status === 'completed' ? 'text-emerald-600' :
                    customer.status === 'needs_help' ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {customer.stepsCompleted}/{customer.totalSteps} steps • {customer.timeSpent}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCustomerDetail = () => (
    <div className="space-y-6">
      {/* Customer Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-6">
              <span className="text-2xl font-bold">SM</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold font-sans">Sarah Martinez</h2>
              <p className="text-blue-100 font-sans">Senior Developer at TechCorp</p>
              <p className="text-blue-200 text-sm font-sans">sarah@techcorp.com • Started 3 days ago</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold font-sans">85%</div>
            <div className="text-blue-100 font-sans">Complete</div>
          </div>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 font-sans">SaaS Platform Onboarding Progress</h3>
        <div className="space-y-4">
          {demoSteps.map((step, index) => (
            <div key={index} className={`flex items-center p-4 rounded-xl transition-all duration-300 ${
              step.completed 
                ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200' 
                : index === 6 
                ? 'bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 shadow-md' 
                : 'bg-gray-50 border border-gray-200'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                step.completed 
                  ? 'bg-emerald-500 text-white' 
                  : index === 6 
                  ? 'bg-blue-500 text-white animate-pulse' 
                  : 'bg-gray-300 text-gray-600'
              }`}>
                {step.completed ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-bold font-sans">{index + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 font-sans">{step.title}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium font-sans ${
                        step.type === 'checkbox' ? 'bg-green-100 text-green-700' :
                        step.type === 'email' ? 'bg-blue-100 text-blue-700' :
                        step.type === 'textarea' ? 'bg-purple-100 text-purple-700' :
                        step.type === 'file_upload' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {step.type.replace('_', ' ')}
                      </span>
                      {step.required && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium font-sans">
                          Required
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {step.completed ? (
                      <div className="text-emerald-600 text-sm font-medium font-sans">✓ Completed</div>
                    ) : index === 6 ? (
                      <div className="text-blue-600 text-sm font-medium font-sans animate-pulse">In Progress</div>
                    ) : (
                      <div className="text-gray-400 text-sm font-sans">Pending</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time notification */}
      {showNotification && (
        <div className="fixed top-24 right-4 bg-white rounded-xl shadow-xl border border-emerald-200 p-4 max-w-sm animate-slide-in z-50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-sm font-sans">Step Completed!</div>
              <div className="text-xs text-gray-600 font-sans">{typingText}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderChecklistBuilder = () => (
    <div className="space-y-6">
      {/* Builder Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 font-sans">Create New Checklist</h2>
            <p className="text-gray-600 font-sans">Build your customer onboarding flow</p>
          </div>
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-sans">
            Save Checklist
          </button>
        </div>
      </div>

      {/* Builder Interface */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Settings Panel */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 font-sans">Checklist Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Title</label>
              <input 
                type="text" 
                value="Enterprise Client Onboarding"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Description</label>
              <textarea 
                value="Comprehensive onboarding process for enterprise customers including security review, integration setup, and team training."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                rows={3}
                readOnly
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input type="radio" checked className="mr-2 text-emerald-600" readOnly />
                <span className="text-sm font-sans">Public</span>
              </label>
              <label className="flex items-center">
                <input type="radio" className="mr-2 text-emerald-600" readOnly />
                <span className="text-sm font-sans">Password Protected</span>
              </label>
            </div>
          </div>
        </div>

        {/* Steps Panel */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 font-sans">Checklist Steps</h3>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center font-sans">
              <Plus className="w-4 h-4 mr-2" />
              Add Step
            </button>
          </div>
          <div className="space-y-3">
            {[
              { title: 'Security Assessment', type: 'file_upload', icon: '🔒' },
              { title: 'Integration Requirements', type: 'textarea', icon: '🔧' },
              { title: 'Team Training Schedule', type: 'checkbox', icon: '📅' },
              { title: 'Go-Live Checklist', type: 'checkbox', icon: '🚀' }
            ].map((step, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center">
                  <span className="text-lg mr-3">{step.icon}</span>
                  <div>
                    <div className="font-medium text-gray-900 font-sans">{step.title}</div>
                    <div className="text-xs text-gray-500 font-sans">{step.type.replace('_', ' ')}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCustomerExperience = () => (
    <div className="max-w-2xl mx-auto">
      {/* Customer View Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-t-2xl p-8 text-white shadow-xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold font-sans mb-2">Welcome to TechCorp!</h1>
          <p className="text-emerald-100 font-sans">Complete your onboarding to get started</p>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-emerald-100 font-sans">Progress</span>
              <span className="text-sm font-medium text-emerald-100 font-sans">6/7 completed</span>
            </div>
            <div className="w-full bg-emerald-400/30 rounded-full h-3">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-500"
                style={{ width: '85%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Steps */}
      <div className="bg-white rounded-b-2xl shadow-xl p-6">
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 font-sans">Account Setup Complete</h4>
                <p className="text-sm text-emerald-700 font-sans">✓ Profile created and email verified</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-md">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 animate-pulse">
                <span className="text-white text-xs font-bold font-sans">7</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 font-sans">API Integration Setup</h4>
                <p className="text-sm text-blue-700 font-sans">Configure your API endpoints and authentication</p>
                <div className="mt-3">
                  <input 
                    type="text" 
                    placeholder="Enter your API endpoint URL..."
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-sans"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-sans">
              Complete Final Step
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompletionCelebration = () => (
    <div className="max-w-2xl mx-auto text-center">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              <div className={`w-2 h-2 rounded-full ${
                ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500'][Math.floor(Math.random() * 5)]
              }`}></div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-8 text-white">
          <div className={`w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-1000 ${
            completingStep ? 'scale-110 rotate-12' : ''
          }`}>
            <CheckCircle className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold font-sans mb-4">Congratulations, Sarah! 🎉</h1>
          <p className="text-emerald-100 text-lg font-sans">You've successfully completed your TechCorp onboarding!</p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 font-sans">7/7</div>
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
            <h3 className="font-semibold text-gray-900 mb-3 font-sans">What's Next?</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p className="font-sans">✓ Your account is fully configured and ready to use</p>
              <p className="font-sans">✓ Our team will reach out within 24 hours for your kickoff call</p>
              <p className="font-sans">✓ Access your dashboard and start exploring features</p>
            </div>
          </div>

          <button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-sans">
            Access Your Dashboard
          </button>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold font-sans">Analytics Dashboard</h2>
            <p className="text-purple-100 font-sans">Insights into your onboarding performance</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold font-sans">↑60%</div>
            <div className="text-purple-100 font-sans">Improvement</div>
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Completion Trends */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 font-sans">Completion Trends</h3>
          <div className="space-y-4">
            {[
              { period: 'This Week', rate: 92, change: '+8%', color: 'emerald' },
              { period: 'Last Week', rate: 84, change: '+12%', color: 'blue' },
              { period: 'This Month', rate: 87, change: '+15%', color: 'purple' }
            ].map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 font-sans">{stat.period}</div>
                  <div className="text-sm text-gray-600 font-sans">{stat.rate}% completion rate</div>
                </div>
                <div className={`text-${stat.color}-600 font-semibold font-sans`}>
                  {stat.change}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Checklists */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 font-sans">Top Performing Checklists</h3>
          <div className="space-y-3">
            {demoChecklists.map((checklist, index) => (
              <div key={checklist.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: checklist.color }}
                  ></div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm font-sans">{checklist.title}</div>
                    <div className="text-xs text-gray-600 font-sans">{checklist.sessions} sessions</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900 text-sm font-sans">{checklist.completionRate}%</div>
                  <div className="text-xs text-gray-600 font-sans">{checklist.avgTime}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-sans">Key Insights</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-center mb-2">
              <Target className="w-5 h-5 text-emerald-600 mr-2" />
              <span className="font-medium text-emerald-800 font-sans">Best Practice</span>
            </div>
            <p className="text-sm text-emerald-700 font-sans">
              Checklists with 5-8 steps have 23% higher completion rates
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-medium text-blue-800 font-sans">Timing</span>
            </div>
            <p className="text-sm text-blue-700 font-sans">
              Most customers complete onboarding within 2-3 business days
            </p>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center mb-2">
              <Zap className="w-5 h-5 text-purple-600 mr-2" />
              <span className="font-medium text-purple-800 font-sans">Impact</span>
            </div>
            <p className="text-sm text-purple-700 font-sans">
              Structured onboarding reduces support tickets by 60%
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentView = () => {
    switch (views[currentView]) {
      case 'dashboard': return renderDashboard();
      case 'customer-detail': return renderCustomerDetail();
      case 'checklist-builder': return renderChecklistBuilder();
      case 'customer-experience': return renderCustomerExperience();
      case 'completion-celebration': return renderCompletionCelebration();
      case 'analytics': return renderAnalytics();
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <DemoHeader />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Auto-playing demo content */}
          <div className="transition-all duration-500 ease-in-out">
            {renderCurrentView()}
          </div>
        </div>
      </div>
    </div>
  );
}