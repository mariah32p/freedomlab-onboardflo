import React, { useState, useEffect, useRef } from 'react';
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

export default function DemoSection() {
  const [currentView, setCurrentView] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  
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

  const views = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'templates', name: 'Templates', icon: Sparkles },
    { id: 'builder', name: 'Builder', icon: Edit },
    { id: 'customer', name: 'Customer View', icon: User },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp }
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

  // Intersection Observer to trigger animation when section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-advance demo when visible
  useEffect(() => {
    if (!isVisible) return;

    const runDemoSequence = async () => {
      // Reset state
      setCurrentView(0);
      setSelectedTemplate(null);
      setSearchTerm('');
      setSteps([]);
      setChecklistTitle('');
      setChecklistDescription('');
      setBuildingStep(0);
      setCustomerData({ name: '', email: '', company: '' });
      setCompletedSteps([]);
      setCurrentCustomerStep(0);
      setShowCustomerForm(true);
      setCustomerStepContent({});
      setIsTyping(false);

      // 1. Dashboard view (3 seconds)
      await new Promise(resolve => setTimeout(resolve, 3000));
      setCurrentView(1);

      // 2. Template selection (show search, then select template)
      await new Promise(resolve => setTimeout(resolve, 800));
      setSearchTerm('website');
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSelectedTemplate('website-design');
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCurrentView(2);

      // 3. Checklist builder (build the checklist step by step)
      await new Promise(resolve => setTimeout(resolve, 600));
      setChecklistTitle('Website Design Project Onboarding');
      setChecklistDescription('Complete onboarding process for new website design clients');
      
      // Add steps one by one with animation
      for (let i = 0; i < demoSteps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setBuildingStep(i + 1);
        setSteps(prev => [...prev, { ...demoSteps[i], id: `step-${i}` }]);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCurrentView(3);

      // 4. Customer experience (customer fills out and completes)
      await new Promise(resolve => setTimeout(resolve, 500));
      setCustomerData({
        name: 'Sarah Martinez',
        email: 'sarah@healthtech.com',
        company: 'HealthTech Solutions'
      });
      
      await new Promise(resolve => setTimeout(resolve, 700));
      setShowCustomerForm(false);
      
      // Customer completes steps one by one
      for (let stepIndex = 0; stepIndex < demoSteps.length; stepIndex++) {
        await new Promise(resolve => setTimeout(resolve, 600));
        setCurrentCustomerStep(stepIndex);
        
        await new Promise(resolve => setTimeout(resolve, 400));
        setIsTyping(true);
        
        await new Promise(resolve => setTimeout(resolve, 300));
        setCustomerStepContent(prev => ({
          ...prev,
          [`step-${stepIndex}`]: demoSteps[stepIndex].content
        }));
        
        setIsTyping(false);
        await new Promise(resolve => setTimeout(resolve, 400));
        setCompletedSteps(prev => [...prev, `step-${stepIndex}`]);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCurrentView(4);
      
      // 5. Analytics/Completion view (show results)
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Loop back to beginning
      runDemoSequence();
    };

    runDemoSequence();
  }, [isVisible]);

  const renderBrowserFrame = (content: React.ReactNode) => (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
      {/* Browser Header */}
      <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <div className="flex-1 mx-4">
            <div className="bg-white rounded-md px-3 py-1 text-sm text-gray-600 font-mono">
              onboardflo.com/{views[currentView].id}
            </div>
          </div>
          <div className="w-16"></div>
        </div>
      </div>

      {/* App Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
              <Workflow className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 font-sans">OnboardFlo</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            {views.map((view, index) => {
              const Icon = view.icon;
              return (
                <div
                  key={view.id}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                    currentView === index
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium font-sans">{view.name}</span>
                  {currentView === index && (
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              );
            })}
          </nav>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold font-sans">JD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-gray-50 min-h-[600px]">
        {content}
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 font-sans">Dashboard Overview</h1>
        <p className="text-gray-600 font-sans">Track your onboarding performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Users, value: '127', label: 'Active Clients', color: 'blue' },
          { icon: CheckCircle, value: '94%', label: 'Completion Rate', color: 'emerald' },
          { icon: Clock, value: '2.8d', label: 'Avg. Time', color: 'purple' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className={`w-10 h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
              </div>
              <div className="ml-4">
                <div className="text-xl font-bold text-gray-900 font-sans">{stat.value}</div>
                <div className="text-sm text-gray-600 font-sans">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Live Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 font-sans">Recent Activity</h2>
            <div className="flex items-center text-sm text-emerald-600">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
              <span className="font-sans">Live</span>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {[
              { name: 'Sarah M.', company: 'HealthTech • Website', status: '✓ Uploaded assets • 3m ago', progress: 87, color: 'emerald' },
              { name: 'Marcus C.', company: 'StartupXYZ • E-commerce', status: 'Working on requirements • 12m ago', progress: 62, color: 'blue' },
              { name: 'Emily R.', company: 'GrowthCo • Branding', status: 'Reviewing concepts • 45m ago', progress: 78, color: 'purple' }
            ].map((client, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg bg-${client.color}-50 border border-${client.color}-200`}>
                <div>
                  <div className="font-semibold text-gray-900 font-sans">{client.name}</div>
                  <div className="text-sm text-gray-600 font-sans">{client.company}</div>
                  <div className={`text-xs text-${client.color}-700 font-sans`}>{client.status}</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center mb-2">
                    <div className={`w-16 bg-${client.color}-200 rounded-full h-1.5 mr-2`}>
                      <div 
                        className={`bg-${client.color}-500 h-1.5 rounded-full transition-all duration-1000`} 
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
    </div>
  );

  const renderTemplateSelection = () => (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 font-sans">Choose Your Template</h1>
        <p className="text-gray-600 font-sans">Start with a proven template or create from scratch</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="flex-1 relative max-w-md">
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
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Create from scratch */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-emerald-400 hover:bg-emerald-50 transition-all cursor-pointer group">
          <div className="text-center">
            <div className="w-10 h-10 bg-gray-100 group-hover:bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3 transition-colors">
              <Plus className="w-5 h-5 text-gray-400 group-hover:text-emerald-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 font-sans">Start from Scratch</h3>
            <p className="text-gray-600 text-sm font-sans">Create a custom checklist</p>
          </div>
        </div>

        {/* Templates */}
        {templates.slice(0, 5).map((template) => (
          <div
            key={template.id}
            className={`bg-white border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 relative ${
              selectedTemplate === template.id 
                ? 'border-emerald-500 ring-2 ring-emerald-500/20 scale-105' 
                : 'border-gray-200 hover:border-emerald-300'
            }`}
          >
            {template.popular && (
              <div className="absolute -top-2 -right-2">
                <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                  POPULAR
                </div>
              </div>
            )}
            
            <div className="flex items-center mb-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg mr-3"
                style={{ backgroundColor: `${template.color}20` }}
              >
                {template.icon}
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 font-sans">{template.name}</h3>
                <span 
                  className="inline-block px-2 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: template.color }}
                >
                  {template.category}
                </span>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 font-sans">{template.description}</p>

            <button 
              className={`w-full py-2 rounded-lg font-medium transition-all duration-200 font-sans text-sm ${
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
  );

  const renderChecklistBuilder = () => (
    <div className="p-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white rounded-t-xl">
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

      <div className="bg-white p-6">
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
            
            {/* Mobile Demo - Hidden on desktop */}
            <div className="md:hidden relative max-w-xs mx-auto">
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
  );

  const renderCustomerExperience = () => (
    <div className="p-6">
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
    <div className="p-6">
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
            <div className="grid grid-cols-2 gap-8 mb-8 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 font-sans">{demoSteps.length}/{demoSteps.length}</div>
                <div className="text-sm text-gray-600 font-sans">Steps Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 font-sans">1.8</div>
                <div className="text-sm text-gray-600 font-sans">Days to Complete</div>
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
          </div>
        </div>
      </div>
    </div>
  );

  const renderMobileMockup = () => (
    <div className="bg-gray-900 rounded-3xl p-2 shadow-2xl max-w-sm mx-auto">
      {/* Phone Frame */}
      <div className="bg-black rounded-2xl p-1">
        <div className="bg-white rounded-xl overflow-hidden">
          {/* Phone Status Bar */}
          <div className="bg-gray-900 px-4 py-2 flex items-center justify-between text-white text-xs">
            <span className="font-sans">9:41</span>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-2 border border-white rounded-sm">
                <div className="w-3 h-1 bg-white rounded-sm"></div>
              </div>
            </div>
          </div>

          {/* Mobile App Header */}
          <div className="bg-emerald-500 px-4 py-3 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center mr-2">
                  <Workflow className="w-4 h-4" />
                </div>
                <span className="font-bold font-sans text-sm">OnboardFlo</span>
              </div>
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold font-sans">JD</span>
              </div>
            </div>
          </div>

          {/* Mobile Content */}
          <div className="bg-gray-50 min-h-[400px] p-4">
            {views[currentView].id === 'dashboard' && renderMobileDashboard()}
            {views[currentView].id === 'templates' && renderMobileTemplates()}
            {views[currentView].id === 'builder' && renderMobileBuilder()}
            {views[currentView].id === 'customer' && renderMobileCustomer()}
            {views[currentView].id === 'analytics' && renderMobileAnalytics()}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMobileDashboard = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900 font-sans">Dashboard</h2>
      
      {/* Mobile Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900 font-sans">127</div>
              <div className="text-xs text-gray-600 font-sans">Clients</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900 font-sans">94%</div>
              <div className="text-xs text-gray-600 font-sans">Complete</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Activity */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-3 border-b border-gray-200">
          <h3 className="font-medium text-gray-900 font-sans text-sm">Recent Activity</h3>
        </div>
        <div className="p-3 space-y-2">
          {[
            { name: 'Sarah M.', status: 'Completed setup', progress: 100 },
            { name: 'Mike R.', status: 'In progress', progress: 65 }
          ].map((client, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 text-sm font-sans">{client.name}</div>
                <div className="text-xs text-gray-600 font-sans">{client.status}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-700 font-sans">{client.progress}%</div>
                <div className="w-12 bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-emerald-500 h-1 rounded-full transition-all duration-1000"
                    style={{ width: `${client.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMobileTemplates = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900 font-sans">Choose Template</h2>
      
      {/* Mobile Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm font-sans"
          placeholder="Search templates..."
          readOnly
        />
      </div>

      {/* Mobile Templates */}
      <div className="space-y-3">
        {templates.slice(0, 3).map((template) => (
          <div
            key={template.id}
            className={`bg-white border rounded-lg p-3 transition-all duration-300 ${
              selectedTemplate === template.id 
                ? 'border-emerald-500 ring-2 ring-emerald-500/20' 
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-center mb-2">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm mr-3"
                style={{ backgroundColor: `${template.color}20` }}
              >
                {template.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 text-sm font-sans">{template.name}</h3>
                <span 
                  className="inline-block px-2 py-0.5 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: template.color }}
                >
                  {template.category}
                </span>
              </div>
            </div>
            <p className="text-gray-600 text-xs mb-3 font-sans">{template.description}</p>
            <button 
              className={`w-full py-2 rounded-lg font-medium transition-all text-xs font-sans ${
                selectedTemplate === template.id
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {selectedTemplate === template.id ? 'Selected ✓' : 'Use Template'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMobileBuilder = () => (
    <div className="space-y-4">
      <div className="bg-blue-500 text-white p-4 rounded-lg -m-4 mb-4">
        <h2 className="font-bold font-sans text-sm">{checklistTitle || 'Building Checklist...'}</h2>
        <p className="text-blue-100 text-xs font-sans">{checklistDescription || 'Setting up flow'}</p>
      </div>

      {buildingStep > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
          <div className="text-sm font-medium text-emerald-900 mb-2 font-sans">
            Adding Step {buildingStep}
          </div>
          <div className="w-full bg-emerald-200 rounded-full h-1.5">
            <div 
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${(buildingStep / demoSteps.length) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Mobile Steps List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900 text-sm font-sans">Steps ({steps.length})</h3>
          <button className="bg-emerald-500 text-white px-3 py-1 rounded-lg text-xs font-medium font-sans">
            <Plus className="w-3 h-3 mr-1 inline" />
            Add
          </button>
        </div>
        
        {steps.slice(0, 3).map((step) => (
          <div key={step.id} className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="flex items-start">
              <span className="text-sm mr-2 mt-0.5">
                {step.type === 'textarea' ? '📝' : step.type === 'file_upload' ? '📎' : '☑️'}
              </span>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 text-sm font-sans">{step.title}</h4>
                <p className="text-xs text-gray-600 font-sans">{step.description}</p>
                {step.required && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium font-sans">
                    Required
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {steps.length > 3 && (
          <div className="text-center text-xs text-gray-500 font-sans">
            +{steps.length - 3} more steps
          </div>
        )}
      </div>
    </div>
  );

  const renderMobileCustomer = () => (
    <div className="space-y-4">
      {showCustomerForm ? (
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-6 h-6 text-white" />
            </div>
            <h2 className="font-bold text-gray-900 font-sans text-sm">Welcome!</h2>
            <p className="text-gray-600 text-xs font-sans">Let's get started</p>
          </div>
          
          <div className="space-y-3">
            <input
              type="text"
              value={customerData.name}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-sans"
              placeholder="Full name"
              readOnly
            />
            <input
              type="email"
              value={customerData.email}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-sans"
              placeholder="Email"
              readOnly
            />
            <input
              type="text"
              value={customerData.company}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-sans"
              placeholder="Company"
              readOnly
            />
          </div>
          
          <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg font-medium text-sm mt-4 font-sans">
            Continue
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Mobile Progress Header */}
          <div className="bg-blue-500 text-white p-4 rounded-lg -m-4 mb-4">
            <h2 className="font-bold text-sm font-sans">Website Project</h2>
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-blue-100 font-sans">Progress</span>
                <span className="text-xs text-blue-100 font-sans">{completedSteps.length}/{demoSteps.length}</span>
              </div>
              <div className="w-full bg-blue-400/30 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(completedSteps.length / demoSteps.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Current Mobile Step */}
          {currentCustomerStep < demoSteps.length && (
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center mb-3">
                <span className="text-lg mr-2">
                  {demoSteps[currentCustomerStep].type === 'textarea' ? '📝' : 
                   demoSteps[currentCustomerStep].type === 'file_upload' ? '📎' : '☑️'}
                </span>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm font-sans">
                    Step {currentCustomerStep + 1}: {demoSteps[currentCustomerStep].title}
                  </h3>
                  {demoSteps[currentCustomerStep].required && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium font-sans">
                      Required
                    </span>
                  )}
                </div>
              </div>
              
              <p className="text-gray-600 mb-3 text-xs font-sans">{demoSteps[currentCustomerStep].description}</p>
              
              {demoSteps[currentCustomerStep].type === 'textarea' && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <textarea
                    value={customerStepContent[`step-${currentCustomerStep}`] || ''}
                    className="w-full border-0 focus:outline-none text-gray-800 resize-none text-xs font-sans bg-transparent"
                    placeholder={demoSteps[currentCustomerStep].placeholder}
                    rows={3}
                    readOnly
                  />
                  {isTyping && (
                    <div className="flex items-center mt-2 text-blue-600">
                      <div className="animate-spin rounded-full h-2 w-2 border-b border-blue-600 mr-2"></div>
                      <span className="text-xs font-sans">Typing...</span>
                    </div>
                  )}
                </div>
              )}
              
              {demoSteps[currentCustomerStep].type === 'file_upload' && (
                <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <div className="text-gray-600 text-xs font-sans">
                    {customerStepContent[`step-${currentCustomerStep}`] ? (
                      <span className="text-emerald-600 font-medium">{customerStepContent[`step-${currentCustomerStep}`]}</span>
                    ) : (
                      'Tap to upload'
                    )}
                  </div>
                </div>
              )}
              
              {completedSteps.includes(`step-${currentCustomerStep}`) && (
                <div className="mt-3 flex items-center text-emerald-600 font-medium text-xs font-sans">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Completed
                </div>
              )}
            </div>
          )}

          {/* Mobile Completed Steps */}
          {completedSteps.length > 0 && (
            <div className="bg-emerald-50 rounded-lg p-3">
              <h4 className="font-medium text-emerald-900 mb-2 text-xs font-sans">
                Completed ({completedSteps.length}/{demoSteps.length})
              </h4>
              <div className="space-y-1">
                {completedSteps.slice(0, 2).map((stepId, index) => (
                  <div key={stepId} className="flex items-center text-xs text-emerald-700">
                    <CheckCircle className="w-3 h-3 mr-2 flex-shrink-0" />
                    <span className="font-sans">{demoSteps[index]?.title}</span>
                  </div>
                ))}
                {completedSteps.length > 2 && (
                  <div className="text-xs text-emerald-600 font-sans">
                    +{completedSteps.length - 2} more completed
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderMobileAnalytics = () => (
    <div className="space-y-4">
      <div className="bg-emerald-500 text-white p-4 rounded-lg -m-4 mb-4 text-center">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle className="w-6 h-6" />
        </div>
        <h2 className="font-bold font-sans text-sm">Great Work, Sarah! 🎉</h2>
        <p className="text-emerald-100 text-xs font-sans">Project onboarding complete!</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-lg p-3 text-center shadow-sm">
          <div className="text-xl font-bold text-emerald-600 font-sans">{demoSteps.length}/{demoSteps.length}</div>
          <div className="text-xs text-gray-600 font-sans">Steps Done</div>
        </div>
        <div className="bg-white rounded-lg p-3 text-center shadow-sm">
          <div className="text-xl font-bold text-blue-600 font-sans">1.8</div>
          <div className="text-xs text-gray-600 font-sans">Days</div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-3 shadow-sm">
        <h3 className="font-medium text-gray-900 mb-3 text-sm font-sans">🚀 What's next?</h3>
        <div className="space-y-2 text-xs text-gray-700">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
              <Check className="w-2 h-2 text-white" />
            </div>
            <p className="font-sans">Design review in 24h</p>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
              <Calendar className="w-2 h-2 text-white" />
            </div>
            <p className="font-sans">Wireframes by Friday</p>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
              <Phone className="w-2 h-2 text-white" />
            </div>
            <p className="font-sans">Kickoff call next week</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-sans">
            See OnboardFlo in action
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-sans">
            Watch how easy it is to create, customize, and track customer onboarding flows
          </p>
        </div>
        
          {/* Right side - Demo Mockup */}
          <div className="lg:order-2">
            {/* Desktop Demo - Hidden on mobile */}
            <div className="hidden md:block relative">
              {renderBrowserFrame(
                <div className="transition-all duration-500 ease-in-out">
                  {views[currentView].id === 'dashboard' && renderDashboard()}
                  {views[currentView].id === 'templates' && renderTemplateSelection()}
                  {views[currentView].id === 'builder' && renderChecklistBuilder()}
                  {views[currentView].id === 'customer' && renderCustomerExperience()}
                  {views[currentView].id === 'analytics' && renderCompletion()}
                </div>
              )}
            </div>

            {/* Mobile Demo */}
            <div className="lg:col-span-1">
              {renderMobileMockup()}
            </div>
          </div>
          
          {/* Demo Progress Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {views.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentView === index ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              ></div>
            ))}
          </div>
          
          {/* Device Labels */}
          <div className="flex justify-center mt-4 space-x-8 text-sm text-gray-600 font-sans">
            <div className="flex items-center">
              <Monitor className="w-4 h-4 mr-2" />
              Desktop Experience
            </div>
            <div className="flex items-center">
              <Smartphone className="w-4 h-4 mr-2" />
              Mobile Experience
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}