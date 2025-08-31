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
  X
} from 'lucide-react';
import DemoHeader from '../components/DemoHeader';

// Comprehensive website designer onboarding checklist
const designerChecklistSteps = [
  {
    id: '1',
    title: 'Project Discovery & Requirements',
    description: 'Help us understand your business, goals, and vision for the website',
    type: 'textarea',
    placeholder: 'Tell us about your business, target audience, and what you want to achieve with your new website...',
    required: true,
    completed: false,
    icon: '🎯',
    sampleResponse: 'We\'re a boutique marketing agency specializing in B2B SaaS companies. We need a modern, professional website that showcases our case studies and attracts enterprise clients. Our target audience is CMOs and marketing directors at companies with 50-500 employees.'
  },
  {
    id: '2',
    title: 'Brand Assets & Style Guide',
    description: 'Upload your logo, brand colors, fonts, and any existing brand guidelines',
    type: 'file_upload',
    placeholder: 'Upload brand assets (logos, style guides, etc.)',
    required: true,
    completed: false,
    icon: '🎨',
    acceptedFiles: '.pdf,.ai,.eps,.jpg,.png,.zip'
  },
  {
    id: '3',
    title: 'Website Content & Copy',
    description: 'Provide all text content, including page copy, service descriptions, and team bios',
    type: 'file_upload',
    placeholder: 'Upload content documents',
    required: true,
    completed: false,
    icon: '📝',
    acceptedFiles: '.pdf,.doc,.docx,.txt'
  },
  {
    id: '4',
    title: 'Design Inspiration & References',
    description: 'Share websites you love, design styles you prefer, and any specific functionality you need',
    type: 'textarea',
    placeholder: 'Share links to websites you admire and describe what you like about them...',
    required: true,
    completed: false,
    icon: '💡',
    sampleResponse: 'Love the clean, modern look of stripe.com and the interactive elements on linear.app. Want something that feels premium but not overwhelming. Need a portfolio section to showcase our case studies with before/after metrics.'
  },
  {
    id: '5',
    title: 'Technical Requirements',
    description: 'Specify hosting preferences, CMS needs, integrations, and any special functionality',
    type: 'textarea',
    placeholder: 'List any technical requirements, integrations, or special functionality needed...',
    required: false,
    completed: false,
    icon: '⚙️',
    sampleResponse: 'Need integration with HubSpot for lead capture, Google Analytics for tracking, and Calendly for booking consultations. Prefer WordPress or Webflow for easy content updates.'
  },
  {
    id: '6',
    title: 'Contact Information & Team Details',
    description: 'Provide team member information, contact details, and social media profiles',
    type: 'textarea',
    placeholder: 'Share team bios, contact information, and social media links...',
    required: true,
    completed: false,
    icon: '👥',
    sampleResponse: 'CEO: Sarah Johnson (LinkedIn: /in/sarahjohnson), Creative Director: Mike Chen (Portfolio: mikechen.design), Head of Strategy: Lisa Park. Main contact: hello@marketingpro.com, (555) 123-4567'
  },
  {
    id: '7',
    title: 'Budget & Timeline Confirmation',
    description: 'Confirm project budget, timeline expectations, and payment schedule',
    type: 'checkbox',
    placeholder: '',
    required: true,
    completed: false,
    icon: '💰'
  },
  {
    id: '8',
    title: 'Project Kickoff Call',
    description: 'Schedule our initial strategy session to align on vision and next steps',
    type: 'checkbox',
    placeholder: '',
    required: true,
    completed: false,
    icon: '📞'
  }
];

export default function DemoPage() {
  const [currentView, setCurrentView] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [completingStep, setCompletingStep] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [showCustomerForm, setShowCustomerForm] = useState(true);
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    company: ''
  });

  const views = [
    'dashboard',
    'create-checklist',
    'checklist-builder',
    'customer-link',
    'customer-experience',
    'completion-celebration'
  ];

  // Auto-advance through views every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentView(prev => (prev + 1) % views.length);
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  // Reset state when view changes
  useEffect(() => {
    if (views[currentView] === 'customer-experience') {
      setShowCustomerForm(true);
      setCompletedSteps([]);
      setCurrentStepIndex(0);
      setCustomerData({ name: '', email: '', company: '' });
      
      // Auto-fill customer form after 2 seconds
      setTimeout(() => {
        setCustomerData({
          name: 'Sarah Martinez',
          email: 'sarah@techcorp.com',
          company: 'TechCorp Solutions'
        });
        setTimeout(() => {
          setShowCustomerForm(false);
        }, 1500);
      }, 2000);
    }
    
    if (views[currentView] === 'completion-celebration') {
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

  // Customer experience step progression
  useEffect(() => {
    if (views[currentView] === 'customer-experience' && !showCustomerForm) {
      const progressSteps = () => {
        const stepIds = ['1', '2', '3', '4'];
        let currentStep = 0;
        
        const interval = setInterval(() => {
          if (currentStep < stepIds.length) {
            setCompletedSteps(prev => [...prev, stepIds[currentStep]]);
            setCurrentStepIndex(currentStep + 1);
            currentStep++;
          } else {
            clearInterval(interval);
          }
        }, 1500);
        
        return interval;
      };
      
      const timer = setTimeout(progressSteps, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentView, showCustomerForm]);

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

      {/* Live Customer Activity */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 font-sans">Live Client Onboarding Activity</h2>
            <div className="flex items-center text-sm text-emerald-600">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
              <span className="font-sans">Live</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 shadow-md">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-white text-sm font-bold font-sans">SM</span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="font-semibold text-gray-900 font-sans">Sarah Martinez</div>
                    <div className="text-sm text-gray-500 font-sans">from TechCorp Solutions</div>
                  </div>
                  <div className="text-sm text-gray-600 font-sans">Website Design Project</div>
                  <div className="text-xs text-emerald-700 font-sans">
                    ✓ Just completed brand assets upload • 2 minutes ago
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center mb-2">
                  <div className="w-20 bg-emerald-200 rounded-full h-2 mr-3">
                    <div className="bg-emerald-500 h-2 rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-sm font-bold text-gray-700 font-sans">75%</span>
                </div>
                <div className="text-xs text-emerald-600 font-sans font-medium">
                  6/8 steps • 2.1 days
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-white text-sm font-bold font-sans">MC</span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="font-semibold text-gray-900 font-sans">Marcus Chen</div>
                    <div className="text-sm text-gray-500 font-sans">from StartupXYZ</div>
                  </div>
                  <div className="text-sm text-gray-600 font-sans">E-commerce Website Project</div>
                  <div className="text-xs text-blue-700 font-sans">
                    Currently working on: Design inspiration & references • 15 minutes ago
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center mb-2">
                  <div className="w-20 bg-blue-200 rounded-full h-2 mr-3">
                    <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: '50%' }}></div>
                  </div>
                  <span className="text-sm font-bold text-gray-700 font-sans">50%</span>
                </div>
                <div className="text-xs text-blue-600 font-sans">
                  4/8 steps • 1.5 days
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-white text-sm font-bold font-sans">ER</span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="font-semibold text-gray-900 font-sans">Emily Rodriguez</div>
                    <div className="text-sm text-gray-500 font-sans">from GrowthCo</div>
                  </div>
                  <div className="text-sm text-gray-600 font-sans">Portfolio Website Redesign</div>
                  <div className="text-xs text-purple-700 font-sans">
                    🎉 Project completed! Launched yesterday
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center mb-2">
                  <div className="w-20 bg-purple-200 rounded-full h-2 mr-3">
                    <div className="bg-purple-500 h-2 rounded-full transition-all duration-500" style={{ width: '100%' }}></div>
                  </div>
                  <span className="text-sm font-bold text-gray-700 font-sans">100%</span>
                </div>
                <div className="text-xs text-purple-600 font-sans font-medium">
                  8/8 steps • 4.2 days
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCreateChecklist = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Plus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4 font-sans">Create New Onboarding Checklist</h2>
          <p className="text-gray-600 text-lg font-sans">Choose a template or start from scratch</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Template Option - Highlighted */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-300 rounded-xl p-6 shadow-lg transform scale-105">
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

          {/* Custom Option */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Edit className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 font-sans">Start from Scratch</h3>
            </div>
            <p className="text-gray-600 text-sm mb-6 font-sans">
              Create a completely custom checklist tailored to your specific client onboarding needs
            </p>
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold transition-colors font-sans">
              Create Custom Checklist
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderChecklistBuilder = () => (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-sans">Website Design Project Checklist</h2>
              <p className="text-blue-100 font-sans">Customize your client onboarding flow</p>
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
                  value="Website Design Project Onboarding"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Description</label>
                <textarea 
                  value="Complete onboarding process for new website design clients including project discovery, asset collection, and kickoff setup."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans"
                  rows={3}
                  readOnly
                />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-3 font-sans">Quick Stats</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600 font-sans">8</div>
                    <div className="text-blue-700 font-sans">Steps</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600 font-sans">94%</div>
                    <div className="text-blue-700 font-sans">Completion</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Steps Preview */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 font-sans">Checklist Steps Preview</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {designerChecklistSteps.slice(0, 6).map((step, index) => (
                  <div key={step.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center">
                      <span className="text-lg mr-3">{step.icon}</span>
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
                      <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="text-center py-2">
                  <span className="text-sm text-gray-500 font-sans">+2 more steps</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCustomerLink = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <LinkIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4 font-sans">Create Customer Link</h2>
          <p className="text-gray-600 text-lg font-sans">Generate a trackable link for your client</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
              Link Name <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="text"
              value="Sarah from TechCorp - Website Redesign"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
              readOnly
            />
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <div className="font-medium text-emerald-900 text-sm font-sans">Customer Link Created!</div>
                <div className="text-xs text-emerald-700 font-sans">Ready to send to your client</div>
              </div>
            </div>
            
            <div className="bg-white border border-emerald-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="flex-1 font-mono text-sm text-gray-600 break-all">
                  https://onboardflo.com/c/website-design/abc123xyz
                </div>
                <button className="flex-shrink-0 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center font-sans">
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </button>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900 font-sans">How it works</span>
            </div>
            <div className="text-sm text-blue-800 space-y-2 font-sans">
              <p>Send this link to your client and track their progress in real-time as they complete each step.</p>
              <p>They'll see a beautiful, branded experience while you get detailed analytics and notifications.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCustomerExperience = () => (
    <div className="max-w-3xl mx-auto">
      {/* Customer Information Form */}
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
                onChange={(e) => setCustomerData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans"
                placeholder="Your full name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Email Address *</label>
              <input
                type="email"
                value={customerData.email}
                onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Company</label>
              <input
                type="text"
                value={customerData.company}
                onChange={(e) => setCustomerData(prev => ({ ...prev, company: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans"
                placeholder="Your company"
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

      {/* Checklist Experience */}
      {!showCustomerForm && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white">
            <div className="text-center">
              <h1 className="text-3xl font-bold font-sans mb-2">Website Design Project</h1>
              <p className="text-blue-100 font-sans">Complete these steps to get your project started</p>
              
              {/* Progress Bar */}
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

          {/* Current Step */}
          <div className="p-8">
            {currentStepIndex < designerChecklistSteps.length && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl mr-4">{designerChecklistSteps[currentStepIndex].icon}</span>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 font-sans">
                        Step {currentStepIndex + 1}: {designerChecklistSteps[currentStepIndex].title}
                      </h3>
                      {designerChecklistSteps[currentStepIndex].required && (
                        <span className="inline-block mt-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium font-sans">
                          Required
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 font-sans">
                      {completedSteps.includes(designerChecklistSteps[currentStepIndex].id) ? (
                        <span className="text-emerald-600 font-medium">✓ Completed</span>
                      ) : (
                        'In Progress...'
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-gray-700 mb-4 font-sans">{designerChecklistSteps[currentStepIndex].description}</p>
                  
                  {designerChecklistSteps[currentStepIndex].type === 'textarea' ? (
                    <textarea
                      value={completedSteps.includes(designerChecklistSteps[currentStepIndex].id) ? designerChecklistSteps[currentStepIndex].sampleResponse || '' : ''}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans"
                      placeholder={designerChecklistSteps[currentStepIndex].placeholder}
                      rows={4}
                      readOnly
                    />
                  ) : designerChecklistSteps[currentStepIndex].type === 'file_upload' ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <div className="text-gray-600 mb-2 font-sans">
                        {completedSteps.includes(designerChecklistSteps[currentStepIndex].id) ? (
                          <span className="text-emerald-600 font-medium">✓ Brand-Guidelines-2024.pdf uploaded</span>
                        ) : (
                          'Drop files here or click to upload'
                        )}
                      </div>
                      {designerChecklistSteps[currentStepIndex].acceptedFiles && (
                        <div className="text-xs text-gray-500 font-sans">
                          Accepted: {designerChecklistSteps[currentStepIndex].acceptedFiles}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center mt-0.5 transition-colors ${
                          completedSteps.includes(designerChecklistSteps[currentStepIndex].id)
                            ? 'bg-blue-500 border-blue-500 text-white' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}>
                          {completedSteps.includes(designerChecklistSteps[currentStepIndex].id) && (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="text-lg font-medium text-gray-900 font-sans">{designerChecklistSteps[currentStepIndex].title}</div>
                          <div className="text-gray-600 mt-1 font-sans">{designerChecklistSteps[currentStepIndex].description}</div>
                        </div>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
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
              <div className={`w-3 h-3 rounded-full ${
                ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500'][Math.floor(Math.random() * 5)]
              }`}></div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/20">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-8 text-white">
          <div className={`w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-1000 ${
            completingStep ? 'scale-110 rotate-12' : ''
          }`}>
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
            <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-sans">
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

  const renderCurrentView = () => {
    switch (views[currentView]) {
      case 'dashboard': return renderDashboard();
      case 'create-checklist': return renderCreateChecklist();
      case 'checklist-builder': return renderChecklistBuilder();
      case 'customer-link': return renderCustomerLink();
      case 'customer-experience': return renderCustomerExperience();
      case 'completion-celebration': return renderCompletionCelebration();
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