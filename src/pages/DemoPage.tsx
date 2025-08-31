import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Users,
  CheckCircle,
  Clock,
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
  Phone,
  MessageSquare,
  Camera,
  Monitor,
  Smartphone,
  Save,
  Send,
  Eye,
  X,
  Trash2,
  ArrowUp,
  ArrowDown,
  Settings,
  Search,
  Filter,
  ChevronRight,
  Workflow,
  Code,
  PenTool,
  Megaphone,
  ShoppingCart,
  Heart,
  Briefcase
} from 'lucide-react';

export default function DemoPage() {
  const [currentView, setCurrentView] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  
  // Template selection state
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Checklist builder state
  const [checklistTitle, setChecklistTitle] = useState('');
  const [checklistDescription, setChecklistDescription] = useState('');
  const [steps, setSteps] = useState<any[]>([]);
  const [buildingStep, setBuildingStep] = useState(0);
  
  // Customer experience state
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    company: ''
  });
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [currentCustomerStep, setCurrentCustomerStep] = useState(0);
  const [showCustomerForm, setShowCustomerForm] = useState(true);
  const [customerStepContent, setCustomerStepContent] = useState<Record<string, string>>({});
  const [isTyping, setIsTyping] = useState(false);

  const autoPlayRef = useRef(autoPlay);
  autoPlayRef.current = autoPlay;

  const views = [
    'dashboard',
    'template-selection', 
    'checklist-builder',
    'customer-experience',
    'completion'
  ];

  const templates = [
    {
      id: 'website-design',
      name: 'Website Design Project',
      category: 'Design',
      icon: '🎨',
      color: '#3b82f6',
      description: 'Complete onboarding flow for website design clients',
      steps: 5,
      popular: true
    },
    {
      id: 'web-development',
      name: 'Web Development Project',
      category: 'Development',
      icon: '💻',
      color: '#10b981',
      description: 'Technical onboarding for web development projects',
      steps: 6,
      popular: false
    },
    {
      id: 'ecommerce-setup',
      name: 'E-commerce Store Setup',
      category: 'E-commerce',
      icon: '🛒',
      color: '#f59e0b',
      description: 'Comprehensive onboarding for e-commerce projects',
      steps: 8,
      popular: false
    },
    {
      id: 'marketing-campaign',
      name: 'Marketing Campaign',
      category: 'Marketing',
      icon: '📈',
      color: '#ef4444',
      description: 'Strategic marketing campaign development',
      steps: 7,
      popular: false
    }
  ];

  const demoSteps = [
    {
      title: 'Project Discovery',
      description: 'Share your project vision and business objectives',
      type: 'textarea',
      placeholder: 'Describe your project goals...',
      required: true,
      content: "We're a B2B SaaS company targeting enterprise healthcare clients. We need a modern website showcasing our AI-powered analytics platform for CTOs and data scientists."
    },
    {
      title: 'Brand Assets',
      description: 'Upload your logo and brand guidelines',
      type: 'file_upload',
      placeholder: 'Accepted: .pdf, .ai, .jpg, .png',
      required: true,
      content: "HealthTech_Logo.zip, Brand_Guidelines.pdf, Colors.ai"
    },
    {
      title: 'Content & Copy',
      description: 'Provide website content and materials',
      type: 'file_upload',
      placeholder: 'Accepted: .pdf, .doc, .txt',
      required: true,
      content: "Website_Copy.docx, Product_Info.pdf, Team_Bios.docx"
    },
    {
      title: 'Design References',
      description: 'Share inspiration and style preferences',
      type: 'textarea',
      placeholder: 'Share websites you like...',
      required: true,
      content: "We love Stripe's clean aesthetic and Tableau's data visualization style. Modern, professional, trustworthy."
    },
    {
      title: 'Technical Requirements',
      description: 'Specify hosting and integration needs',
      type: 'textarea',
      placeholder: 'List technical requirements...',
      required: true,
      content: "React/Next.js, AWS hosting for HIPAA compliance, Salesforce integration, headless CMS for blog."
    }
  ];

  const advanceView = useCallback(() => {
    setCurrentView(prev => (prev + 1) % views.length);
  }, [views.length]);

  useEffect(() => {
    if (!autoPlay) return;

    const view = views[currentView];
    let timeout: NodeJS.Timeout;
    let isCancelled = false;

    const runViewSequence = async () => {
      switch (view) {
        case 'dashboard':
          timeout = setTimeout(() => {
            if (!isCancelled && autoPlayRef.current) advanceView();
          }, 3000);
          break;

        case 'template-selection':
          setSelectedTemplate(null);
          setSearchTerm('');
          
          setTimeout(() => {
            if (!isCancelled && autoPlayRef.current) setSearchTerm('website');
          }, 800);
          
          setTimeout(() => {
            if (!isCancelled && autoPlayRef.current) setSelectedTemplate('website-design');
          }, 1800);
          
          timeout = setTimeout(() => {
            if (!isCancelled && autoPlayRef.current) advanceView();
          }, 3000);
          break;

        case 'checklist-builder':
          setSteps([]);
          setChecklistTitle('');
          setChecklistDescription('');
          setBuildingStep(0);
          
          setTimeout(() => {
            if (!isCancelled && autoPlayRef.current) {
              setChecklistTitle('Website Design Project Onboarding');
              setChecklistDescription('Complete onboarding process for new website design clients');
            }
          }, 600);
          
          demoSteps.forEach((step, index) => {
            setTimeout(() => {
              if (!isCancelled && autoPlayRef.current) {
                setBuildingStep(index + 1);
                setSteps(prev => [...prev, { ...step, id: `step-${index}` }]);
              }
            }, 1200 + (index * 800));
          });
          
          timeout = setTimeout(() => {
            if (!isCancelled && autoPlayRef.current) advanceView();
          }, 1200 + (demoSteps.length * 800) + 1000);
          break;

        case 'customer-experience':
          setCustomerData({ name: '', email: '', company: '' });
          setCompletedSteps([]);
          setCurrentCustomerStep(0);
          setShowCustomerForm(true);
          setCustomerStepContent({});
          setIsTyping(false);

          setTimeout(() => {
            if (!isCancelled && autoPlayRef.current) {
              setCustomerData({
                name: 'Sarah Martinez',
                email: 'sarah@healthtech.com',
                company: 'HealthTech Solutions'
              });
            }
          }, 800);

          setTimeout(() => {
            if (!isCancelled && autoPlayRef.current) {
              setShowCustomerForm(false);
            }
          }, 2000);

          const processStep = async (stepIndex: number) => {
            if (stepIndex >= demoSteps.length || !autoPlayRef.current) {
              setTimeout(() => {
                if (!isCancelled && autoPlayRef.current) advanceView();
              }, 1000);
              return;
            }

            const step = demoSteps[stepIndex];
            setCurrentCustomerStep(stepIndex);
            
            await new Promise(resolve => setTimeout(resolve, 600));
            if (!autoPlayRef.current) return;

            setIsTyping(true);
            const content = step.content;
            
            for (let i = 0; i <= content.length; i++) {
              if (!autoPlayRef.current) break;
              setCustomerStepContent(prev => ({
                ...prev,
                [`step-${stepIndex}`]: content.slice(0, i)
              }));
              await new Promise(resolve => setTimeout(resolve, 20));
            }
            
            setIsTyping(false);
            await new Promise(resolve => setTimeout(resolve, 300));
            
            if (!autoPlayRef.current) return;
            setCompletedSteps(prev => [...prev, `step-${stepIndex}`]);
            
            await new Promise(resolve => setTimeout(resolve, 800));
            processStep(stepIndex + 1);
          };

          setTimeout(() => {
            if (!isCancelled && autoPlayRef.current) {
              processStep(0);
            }
          }, 2400);
          break;

        case 'completion':
          timeout = setTimeout(() => {
            if (!isCancelled && autoPlayRef.current) advanceView();
          }, 6000);
          break;
      }
    };

    runViewSequence();

    return () => {
      isCancelled = true;
      if (timeout) clearTimeout(timeout);
    };
  }, [currentView, advanceView, autoPlay]);

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 font-sans">OnboardFlo Dashboard</h1>
        <p className="text-xl text-gray-600 font-sans">Real-time customer onboarding insights</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: Users, value: '127', label: 'Active Clients', color: 'blue' },
          { icon: CheckCircle, value: '94%', label: 'Completion Rate', color: 'emerald' },
          { icon: Clock, value: '2.8d', label: 'Avg. Time', color: 'orange' },
          { icon: TrendingUp, value: '↑68%', label: 'vs Manual', color: 'purple' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className={`w-12 h-12 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-xl flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900 font-sans">{stat.value}</div>
                <div className="text-sm text-gray-600 font-sans">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Live Activity */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
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
            {[
              { name: 'Sarah M.', company: 'HealthTech • Website', status: '✓ Uploaded assets • 3m ago', progress: 87, color: 'emerald' },
              { name: 'Marcus C.', company: 'StartupXYZ • E-commerce', status: 'Working on requirements • 12m ago', progress: 62, color: 'blue' },
              { name: 'Emily R.', company: 'GrowthCo • Branding', status: 'Reviewing concepts • 45m ago', progress: 78, color: 'purple' }
            ].map((client, index) => (
              <div key={index} className={`flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-${client.color}-50 to-${client.color}-100 border border-${client.color}-200`}>
                <div className="flex items-center">
                  <div className={`w-10 h-10 bg-gradient-to-br from-${client.color}-400 to-${client.color}-500 rounded-full flex items-center justify-center mr-4 shadow-lg`}>
                    <span className="text-white text-sm font-bold font-sans">{client.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 font-sans">{client.name}</div>
                    <div className="text-sm text-gray-600 font-sans">{client.company}</div>
                    <div className={`text-xs text-${client.color}-700 font-sans`}>{client.status}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center mb-2">
                    <div className={`w-20 bg-${client.color}-200 rounded-full h-2 mr-3`}>
                      <div 
                        className={`bg-${client.color}-500 h-2 rounded-full transition-all duration-1000`} 
                        style={{ width: `${client.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-gray-700 font-sans">{client.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-sans">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Plus, text: 'Create Checklist', color: 'emerald' },
            { icon: Send, text: 'Send Reminder', color: 'blue' },
            { icon: BarChart3, text: 'View Analytics', color: 'purple' }
          ].map((action, index) => (
            <button key={index} className={`flex items-center justify-center p-4 bg-gradient-to-r from-${action.color}-500 to-${action.color}-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-sans`}>
              <action.icon className="w-5 h-5 mr-2" />
              {action.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTemplateSelection = () => (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-blue-600 p-8 text-white">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold mb-2 font-sans">Choose Your Template</h2>
            <p className="text-blue-100 text-lg font-sans">Start with a proven template or create from scratch</p>
          </div>
        </div>

        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
                placeholder="Search templates..."
                readOnly
              />
            </div>
            <select className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans">
              <option>All Categories</option>
              <option>Design</option>
              <option>Development</option>
            </select>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create from scratch */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-emerald-400 hover:bg-emerald-50 transition-all cursor-pointer group">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 group-hover:bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4 transition-colors">
                  <Plus className="w-6 h-6 text-gray-400 group-hover:text-emerald-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-sans">Start from Scratch</h3>
                <p className="text-gray-600 text-sm font-sans">Create a custom checklist</p>
              </div>
            </div>

            {/* Templates */}
            {templates.map((template) => (
              <div
                key={template.id}
                className={`bg-white border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg relative ${
                  selectedTemplate === template.id 
                    ? 'border-emerald-500 ring-4 ring-emerald-500/20 scale-105' 
                    : 'border-gray-200 hover:border-emerald-300'
                }`}
              >
                {template.popular && (
                  <div className="absolute -top-3 -right-3">
                    <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      POPULAR
                    </div>
                  </div>
                )}
                
                <div className="flex items-center mb-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mr-4"
                    style={{ backgroundColor: `${template.color}20` }}
                  >
                    {template.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 font-sans">{template.name}</h3>
                    <span 
                      className="inline-block px-2 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: template.color }}
                    >
                      {template.category}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 font-sans">{template.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-500 font-sans">{template.steps} steps</div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                    ))}
                    <span className="text-xs text-gray-500 ml-1 font-sans">(4.9)</span>
                  </div>
                </div>

                <button 
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 font-sans ${
                    selectedTemplate === template.id
                      ? 'bg-emerald-500 text-white shadow-lg'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {selectedTemplate === template.id ? 'Selected ✓' : 'Use Template'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderChecklistBuilder = () => (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-sans">{checklistTitle || 'Building Your Checklist...'}</h2>
              <p className="text-blue-100 font-sans">{checklistDescription || 'Setting up your onboarding flow'}</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold transition-all font-sans">
                <Save className="w-4 h-4 mr-2 inline" />
                Save Draft
              </button>
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold transition-all font-sans">
                Publish
              </button>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Settings */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 font-sans">Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Title</label>
                    <input 
                      type="text" 
                      value={checklistTitle}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg font-sans"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Description</label>
                    <textarea 
                      value={checklistDescription}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg font-sans"
                      rows={3}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {buildingStep > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                  <h4 className="font-semibold text-emerald-900 mb-4 font-sans">
                    Adding Step {buildingStep}: {demoSteps[buildingStep - 1]?.title}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse"></div>
                      <span className="text-sm text-emerald-800 font-sans">Configuring...</span>
                    </div>
                    <div className="w-full bg-emerald-200 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(buildingStep / demoSteps.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Steps */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 font-sans">Steps ({steps.length})</h3>
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium flex items-center font-sans">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Step
                </button>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {steps.map((step) => (
                  <div key={step.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <span className="text-lg mr-3 mt-1">
                          {step.type === 'textarea' ? '📝' : step.type === 'file_upload' ? '📎' : '☑️'}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h4 className="font-semibold text-gray-900 font-sans">{step.title}</h4>
                            {step.required && (
                              <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium font-sans">
                                Required
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 font-sans">{step.description}</p>
                          <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium font-sans">
                            {step.type === 'textarea' ? 'Long Text' : step.type === 'file_upload' ? 'File Upload' : 'Checkbox'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 ml-4">
                        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {steps.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 font-sans">Building checklist...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCustomerExperience = () => (
    <div className="max-w-4xl mx-auto">
      {showCustomerForm && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                placeholder="Your full name"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Email *</label>
              <input
                type="email"
                value={customerData.email}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                placeholder="your@email.com"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Company</label>
              <input
                type="text"
                value={customerData.company}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                placeholder="Your company"
                readOnly
              />
            </div>
          </div>
          
          <div className="flex justify-center mt-6">
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg font-sans">
              Continue to Checklist
            </button>
          </div>
        </div>
      )}

      {!showCustomerForm && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2 font-sans">Website Design Project Onboarding</h1>
              <p className="text-blue-100 font-sans">Complete these steps to get started</p>
              
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-100 font-sans">Progress</span>
                  <span className="text-sm font-medium text-blue-100 font-sans">{completedSteps.length}/{demoSteps.length} completed</span>
                </div>
                <div className="w-full bg-blue-400/30 rounded-full h-3">
                  <div 
                    className="bg-white h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${(completedSteps.length / demoSteps.length) * 100}%` }}
                  ></div>
                </div>
                <div className="text-center mt-2">
                  <span className="text-lg font-bold text-white font-sans">
                    {Math.round((completedSteps.length / demoSteps.length) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {currentCustomerStep < demoSteps.length && (
              <div className="bg-blue-50 rounded-xl p-8 mb-8 border-2 border-blue-200">
                <div className="flex items-center mb-6">
                  <span className="text-3xl mr-4">
                    {demoSteps[currentCustomerStep].type === 'textarea' ? '📝' : 
                     demoSteps[currentCustomerStep].type === 'file_upload' ? '📎' : '☑️'}
                  </span>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 font-sans">
                      Step {currentCustomerStep + 1}: {demoSteps[currentCustomerStep].title}
                    </h3>
                    {demoSteps[currentCustomerStep].required && (
                      <span className="inline-block mt-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium font-sans">
                        Required
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6 font-sans text-lg">{demoSteps[currentCustomerStep].description}</p>
                
                {demoSteps[currentCustomerStep].type === 'textarea' && (
                  <div className="bg-white rounded-lg border-2 border-gray-200 p-4">
                    <textarea
                      value={customerStepContent[`step-${currentCustomerStep}`] || ''}
                      className="w-full px-4 py-3 border-0 focus:outline-none text-gray-800 resize-none font-sans"
                      placeholder={demoSteps[currentCustomerStep].placeholder}
                      rows={6}
                      readOnly
                    />
                    {isTyping && (
                      <div className="flex items-center mt-2 text-blue-600">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
                        <span className="text-xs font-sans">Typing...</span>
                      </div>
                    )}
                  </div>
                )}
                
                {demoSteps[currentCustomerStep].type === 'file_upload' && (
                  <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <div className="text-gray-600 mb-4 font-sans text-lg">
                      {customerStepContent[`step-${currentCustomerStep}`] ? (
                        <div className="space-y-2">
                          <span className="text-emerald-600 font-medium">Files uploaded!</span>
                          <div className="text-sm text-gray-700 bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                            {customerStepContent[`step-${currentCustomerStep}`]}
                          </div>
                        </div>
                      ) : (
                        'Drop files here or click to upload'
                      )}
                    </div>
                    <div className="text-sm text-gray-500 font-sans">
                      {demoSteps[currentCustomerStep].placeholder}
                    </div>
                  </div>
                )}
                
                {completedSteps.includes(`step-${currentCustomerStep}`) && (
                  <div className="mt-6 flex items-center text-emerald-600 font-medium font-sans">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Step completed successfully
                  </div>
                )}
              </div>
            )}

            {completedSteps.length > 0 && (
              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                <h4 className="font-semibold text-emerald-900 mb-4 font-sans">
                  Completed Steps ({completedSteps.length}/{demoSteps.length})
                </h4>
                <div className="space-y-3">
                  {completedSteps.map((stepId, index) => (
                    <div key={stepId} className="flex items-center text-sm text-emerald-700">
                      <CheckCircle className="w-4 h-4 mr-3 flex-shrink-0" />
                      <span className="font-sans">{demoSteps[index]?.title}</span>
                    </div>
                  ))}
                </div>
                
                {completedSteps.length === demoSteps.length && (
                  <div className="mt-6 p-4 bg-emerald-100 rounded-lg border border-emerald-300">
                    <div className="flex items-center text-emerald-800 font-medium font-sans">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      All steps completed! Ready to submit.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderCompletion = () => (
    <div className="max-w-3xl mx-auto text-center">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/20">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-bold font-sans mb-4">Outstanding Work, Sarah! 🎉</h1>
            <p className="text-emerald-100 text-lg font-sans">Your website project onboarding is complete!</p>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 font-sans">{demoSteps.length}/{demoSteps.length}</div>
              <div className="text-sm text-gray-600 font-sans">Steps Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 font-sans">1.8</div>
              <div className="text-sm text-gray-600 font-sans">Days to Complete</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 font-sans">100%</div>
              <div className="text-sm text-gray-600 font-sans">Success Rate</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4 font-sans">🚀 What happens next?</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <p className="font-sans">Our design team will review your requirements within 24 hours</p>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <Calendar className="w-3 h-3 text-white" />
                </div>
                <p className="font-sans">You'll receive initial wireframes and mood boards by Friday</p>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <Phone className="w-3 h-3 text-white" />
                </div>
                <p className="font-sans">We'll schedule your project kickoff call for next week</p>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <Target className="w-3 h-3 text-white" />
                </div>
                <p className="font-sans">Expected project completion: 8-10 weeks</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl font-sans">
              View Project Portal
            </button>
            <button className="bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:border-gray-300 hover:shadow-md font-sans">
              Schedule Strategy Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Clean header without demo controls */}
      <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
              <Workflow className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 font-sans">OnboardFlo</span>
          </div>
        </div>
      </div>
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="transition-all duration-500 ease-in-out">
          {views[currentView] === 'dashboard' && renderDashboard()}
          {views[currentView] === 'template-selection' && renderTemplateSelection()}
          {views[currentView] === 'checklist-builder' && renderChecklistBuilder()}
          {views[currentView] === 'customer-experience' && renderCustomerExperience()}
          {views[currentView] === 'completion' && renderCompletion()}
        </div>
      </div>
    </div>
  );
}