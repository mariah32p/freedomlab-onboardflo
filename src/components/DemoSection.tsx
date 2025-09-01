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

export default function DemoSection() {
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
    'analytics'
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
    }
  ];

  const demoSteps = [
    {
      title: 'Project Discovery',
      description: 'Share your project vision and business objectives',
      type: 'textarea',
      placeholder: 'Describe your project goals...',
      required: true,
      content: "We're a B2B SaaS company targeting enterprise healthcare clients. We need a modern website showcasing our AI-powered analytics platform."
    },
    {
      title: 'Brand Assets',
      description: 'Upload your logo and brand guidelines',
      type: 'file_upload',
      placeholder: 'Accepted: .pdf, .ai, .jpg, .png',
      required: true,
      content: "HealthTech_Logo.zip, Brand_Guidelines.pdf"
    },
    {
      title: 'Content & Copy',
      description: 'Provide website content and materials',
      type: 'file_upload',
      placeholder: 'Accepted: .pdf, .doc, .txt',
      required: true,
      content: "Website_Copy.docx, Product_Info.pdf"
    },
    {
      title: 'Design References',
      description: 'Share inspiration and style preferences',
      type: 'textarea',
      placeholder: 'Share websites you like...',
      required: true,
      content: "We love Stripe's clean aesthetic and modern, professional style."
    },
    {
      title: 'Technical Requirements',
      description: 'Specify hosting and integration needs',
      type: 'textarea',
      placeholder: 'List technical requirements...',
      required: true,
      content: "React/Next.js, AWS hosting, Salesforce integration."
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
          }, 4000);
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
          }, 6000);
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
          }, 500);

          setTimeout(() => {
            if (!isCancelled && autoPlayRef.current) {
              setShowCustomerForm(false);
            }
          }, 1200);

          const processSteps = async () => {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            for (let stepIndex = 0; stepIndex < demoSteps.length; stepIndex++) {
              if (!autoPlayRef.current) break;
              
              const step = demoSteps[stepIndex];
              setCurrentCustomerStep(stepIndex);
              
              await new Promise(resolve => setTimeout(resolve, 600));
              if (!autoPlayRef.current) break;
              
              setIsTyping(true);
              const content = step.content;
              
              setCustomerStepContent(prev => ({
                ...prev,
                [`step-${stepIndex}`]: content
              }));
              
              setIsTyping(false);
              await new Promise(resolve => setTimeout(resolve, 400));
              
              if (!autoPlayRef.current) break;
              setCompletedSteps(prev => [...prev, `step-${stepIndex}`]);
              
              await new Promise(resolve => setTimeout(resolve, 600));
            }
            
            setTimeout(() => {
              if (autoPlayRef.current) advanceView();
            }, 800);
          };

          setTimeout(() => {
            if (!isCancelled && autoPlayRef.current) {
              processSteps();
            }
          }, 400);
          break;

        case 'analytics':
          timeout = setTimeout(() => {
            if (!isCancelled && autoPlayRef.current) advanceView();
          }, 4000);
          break;
      }
    };

    runViewSequence();

    return () => {
      isCancelled = true;
      if (timeout) clearTimeout(timeout);
    };
  }, [currentView, advanceView, autoPlay]);

  const renderDesktopDashboard = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 font-sans">Dashboard</h1>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Users, value: '127', label: 'Active Clients', color: 'blue' },
          { icon: CheckCircle, value: '94%', label: 'Completion Rate', color: 'emerald' },
          { icon: Clock, value: '2.8d', label: 'Avg. Time', color: 'purple' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className={`w-8 h-8 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 text-${stat.color}-600`} />
              </div>
              <div className="ml-3">
                <div className="text-lg font-bold text-gray-900 font-sans">{stat.value}</div>
                <div className="text-xs text-gray-600 font-sans">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 font-sans">Live Activity</h2>
          <div className="flex items-center text-sm text-emerald-600">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
            <span className="font-sans">Live</span>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { name: 'Sarah M.', company: 'HealthTech', status: '✓ Uploaded assets', progress: 87 },
            { name: 'Marcus C.', company: 'StartupXYZ', status: 'Working on requirements', progress: 62 },
            { name: 'Emily R.', company: 'GrowthCo', status: 'Reviewing concepts', progress: 78 }
          ].map((client, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-200">
              <div>
                <div className="font-semibold text-gray-900 text-sm font-sans">{client.name}</div>
                <div className="text-xs text-gray-600 font-sans">{client.company}</div>
                <div className="text-xs text-emerald-700 font-sans">{client.status}</div>
              </div>
              <div className="text-right">
                <div className="flex items-center">
                  <div className="w-12 bg-emerald-200 rounded-full h-1.5 mr-2">
                    <div 
                      className="bg-emerald-500 h-1.5 rounded-full transition-all duration-1000" 
                      style={{ width: `${client.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-gray-700 font-sans">{client.progress}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMobileDashboard = () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h1 className="text-lg font-bold text-gray-900 mb-1 font-sans">Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Users, value: '127', label: 'Clients', color: 'blue' },
          { icon: CheckCircle, value: '94%', label: 'Rate', color: 'emerald' },
          { icon: Clock, value: '2.8d', label: 'Avg Time', color: 'purple' },
          { icon: Target, value: '215', label: 'Done', color: 'green' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
            <div className="text-center">
              <div className={`w-6 h-6 bg-${stat.color}-100 rounded-lg flex items-center justify-center mx-auto mb-2`}>
                <stat.icon className={`w-3 h-3 text-${stat.color}-600`} />
              </div>
              <div className="text-sm font-bold text-gray-900 font-sans">{stat.value}</div>
              <div className="text-xs text-gray-600 font-sans">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900 font-sans">Live Activity</h2>
          <div className="flex items-center text-xs text-emerald-600">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1 animate-pulse"></div>
            <span className="font-sans">Live</span>
          </div>
        </div>
        <div className="space-y-2">
          {[
            { name: 'Sarah M.', status: '✓ Assets uploaded', progress: 87 },
            { name: 'Marcus C.', status: 'Working...', progress: 62 }
          ].map((client, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded bg-emerald-50">
              <div>
                <div className="font-medium text-gray-900 text-xs font-sans">{client.name}</div>
                <div className="text-xs text-emerald-700 font-sans">{client.status}</div>
              </div>
              <div className="text-xs font-bold text-gray-700 font-sans">{client.progress}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDesktopTemplateSelection = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-500 to-blue-600 p-6 text-white rounded-t-lg">
        <div className="text-center">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold mb-2 font-sans">Choose Your Template</h2>
          <p className="text-blue-100 font-sans">Start with a proven template</p>
        </div>
      </div>

      <div className="p-6 bg-white rounded-b-lg">
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm font-sans"
              placeholder="Search templates..."
              readOnly
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {templates.slice(0, 4).map((template) => (
            <div
              key={template.id}
              className={`bg-white border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedTemplate === template.id 
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20' 
                  : 'border-gray-200 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center mb-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-lg mr-3"
                  style={{ backgroundColor: `${template.color}20` }}
                >
                  {template.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 font-sans">{template.name}</h3>
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
                className={`w-full py-2 rounded-lg font-medium text-sm transition-all font-sans ${
                  selectedTemplate === template.id
                    ? 'bg-emerald-500 text-white'
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
  );

  const renderMobileTemplateSelection = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-emerald-500 to-blue-600 p-4 text-white rounded-lg">
        <div className="text-center">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold mb-1 font-sans">Choose Template</h2>
          <p className="text-blue-100 text-sm font-sans">Start with proven template</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4">
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm font-sans"
            placeholder="Search templates..."
            readOnly
          />
        </div>

        <div className="space-y-3">
          {templates.slice(0, 3).map((template) => (
            <div
              key={template.id}
              className={`border-2 rounded-lg p-3 transition-all ${
                selectedTemplate === template.id 
                  ? 'border-emerald-500 bg-emerald-50' 
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-6 h-6 rounded flex items-center justify-center text-sm mr-2"
                    style={{ backgroundColor: `${template.color}20` }}
                  >
                    {template.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 font-sans">{template.name}</h3>
                    <span 
                      className="inline-block px-1.5 py-0.5 rounded text-xs font-medium text-white"
                      style={{ backgroundColor: template.color }}
                    >
                      {template.category}
                    </span>
                  </div>
                </div>
                {selectedTemplate === template.id && (
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDesktopChecklistBuilder = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-sans">{checklistTitle || 'Building Your Checklist...'}</h2>
            <p className="text-blue-100 font-sans">{checklistDescription || 'Setting up your onboarding flow'}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="bg-white/20 text-white px-3 py-1.5 rounded-lg text-sm font-medium font-sans">
              Save
            </button>
            <button className="bg-emerald-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium font-sans">
              Publish
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-b-lg p-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 font-sans">Settings</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Title</label>
                  <input 
                    type="text" 
                    value={checklistTitle}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-sans"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Description</label>
                  <textarea 
                    value={checklistDescription}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-sans"
                    rows={2}
                    readOnly
                  />
                </div>
              </div>
            </div>

            {buildingStep > 0 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <h4 className="font-semibold text-emerald-900 mb-3 font-sans">
                  Adding Step {buildingStep}: {demoSteps[buildingStep - 1]?.title}
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
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

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 font-sans">Steps ({steps.length})</h3>
              <button className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center font-sans">
                <Plus className="w-3 h-3 mr-1" />
                Add
              </button>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {steps.map((step) => (
                <div key={step.id} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <span className="text-sm mr-2 mt-0.5">
                        {step.type === 'textarea' ? '📝' : step.type === 'file_upload' ? '📎' : '☑️'}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <h4 className="font-semibold text-gray-900 text-sm font-sans">{step.title}</h4>
                          {step.required && (
                            <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium font-sans">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 font-sans">{step.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {steps.length === 0 && (
                <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                  <Plus className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm font-sans">Building checklist...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMobileChecklistBuilder = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white rounded-lg">
        <h2 className="text-lg font-bold font-sans">{checklistTitle || 'Building Checklist...'}</h2>
        <p className="text-blue-100 text-sm font-sans">{checklistDescription || 'Setting up flow'}</p>
      </div>

      <div className="bg-white rounded-lg p-4">
        {buildingStep > 0 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4">
            <h4 className="font-medium text-emerald-900 mb-2 text-sm font-sans">
              Adding Step {buildingStep}
            </h4>
            <div className="w-full bg-emerald-200 rounded-full h-1.5">
              <div 
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${(buildingStep / demoSteps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900 font-sans">Steps ({steps.length})</h3>
            <button className="bg-emerald-500 text-white px-2 py-1 rounded text-xs font-medium font-sans">
              + Add
            </button>
          </div>
          
          {steps.map((step) => (
            <div key={step.id} className="border border-gray-200 rounded-lg p-2">
              <div className="flex items-center">
                <span className="text-sm mr-2">
                  {step.type === 'textarea' ? '📝' : step.type === 'file_upload' ? '📎' : '☑️'}
                </span>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-xs font-sans">{step.title}</h4>
                  {step.required && (
                    <span className="px-1 py-0.5 bg-red-100 text-red-600 rounded text-xs font-sans">Required</span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {steps.length === 0 && (
            <div className="text-center py-4 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500 text-xs font-sans">Building...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderDesktopCustomerExperience = () => (
    <div className="space-y-6">
      {showCustomerForm && (
        <div className="bg-white rounded-lg p-6">
          <div className="text-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2 font-sans">Welcome!</h2>
            <p className="text-gray-600 font-sans">Let's get started</p>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Name</label>
              <input
                type="text"
                value={customerData.name}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-sans"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Email</label>
              <input
                type="email"
                value={customerData.email}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-sans"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Company</label>
              <input
                type="text"
                value={customerData.company}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-sans"
                readOnly
              />
            </div>
          </div>
        </div>
      )}

      {!showCustomerForm && (
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
            <h1 className="text-2xl font-bold mb-2 font-sans">Website Design Project</h1>
            <p className="text-blue-100 font-sans">Complete these steps to get started</p>
            
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-100 font-sans">Progress</span>
                <span className="text-sm font-medium text-blue-100 font-sans">{completedSteps.length}/{demoSteps.length}</span>
              </div>
              <div className="w-full bg-blue-400/30 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(completedSteps.length / demoSteps.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {currentCustomerStep < demoSteps.length && (
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">
                    {demoSteps[currentCustomerStep].type === 'textarea' ? '📝' : 
                     demoSteps[currentCustomerStep].type === 'file_upload' ? '📎' : '☑️'}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 font-sans">
                      Step {currentCustomerStep + 1}: {demoSteps[currentCustomerStep].title}
                    </h3>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 font-sans">{demoSteps[currentCustomerStep].description}</p>
                
                {demoSteps[currentCustomerStep].type === 'textarea' && (
                  <div className="bg-white rounded-lg border-2 border-gray-200 p-3">
                    <textarea
                      value={customerStepContent[`step-${currentCustomerStep}`] || ''}
                      className="w-full border-0 focus:outline-none text-gray-800 resize-none font-sans text-sm"
                      rows={4}
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
                  <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <div className="text-gray-600 mb-2 font-sans text-sm">
                      {customerStepContent[`step-${currentCustomerStep}`] ? (
                        <span className="text-emerald-600 font-medium">{customerStepContent[`step-${currentCustomerStep}`]}</span>
                      ) : (
                        'Drop files here'
                      )}
                    </div>
                  </div>
                )}
                
                {completedSteps.includes(`step-${currentCustomerStep}`) && (
                  <div className="mt-4 flex items-center text-emerald-600 font-medium font-sans text-sm">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Step completed
                  </div>
                )}
              </div>
            )}

            {completedSteps.length > 0 && (
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200 mt-6">
                <h4 className="font-semibold text-emerald-900 mb-3 font-sans text-sm">
                  Completed ({completedSteps.length}/{demoSteps.length})
                </h4>
                <div className="space-y-2">
                  {completedSteps.map((stepId, index) => (
                    <div key={stepId} className="flex items-center text-sm text-emerald-700">
                      <CheckCircle className="w-3 h-3 mr-2 flex-shrink-0" />
                      <span className="font-sans text-xs">{demoSteps[index]?.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderMobileCustomerExperience = () => (
    <div className="space-y-4">
      {showCustomerForm && (
        <div className="bg-white rounded-lg p-4">
          <div className="text-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <User className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1 font-sans">Welcome!</h2>
            <p className="text-gray-600 text-sm font-sans">Let's get started</p>
          </div>
          
          <div className="space-y-3">
            <input
              type="text"
              value={customerData.name}
              placeholder="Your name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-sans"
              readOnly
            />
            <input
              type="email"
              value={customerData.email}
              placeholder="your@email.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-sans"
              readOnly
            />
            <input
              type="text"
              value={customerData.company}
              placeholder="Your company"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-sans"
              readOnly
            />
          </div>
        </div>
      )}

      {!showCustomerForm && (
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
            <h1 className="text-lg font-bold mb-1 font-sans">Website Design Project</h1>
            <p className="text-blue-100 text-sm font-sans">Complete these steps</p>
            
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-blue-100 font-sans">Progress</span>
                <span className="text-xs font-medium text-blue-100 font-sans">{completedSteps.length}/{demoSteps.length}</span>
              </div>
              <div className="w-full bg-blue-400/30 rounded-full h-1.5">
                <div 
                  className="bg-white h-1.5 rounded-full transition-all duration-1000"
                  style={{ width: `${(completedSteps.length / demoSteps.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="p-4">
            {currentCustomerStep < demoSteps.length && (
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="flex items-center mb-3">
                  <span className="text-lg mr-2">
                    {demoSteps[currentCustomerStep].type === 'textarea' ? '📝' : 
                     demoSteps[currentCustomerStep].type === 'file_upload' ? '📎' : '☑️'}
                  </span>
                  <h3 className="text-sm font-bold text-gray-900 font-sans">
                    Step {currentCustomerStep + 1}: {demoSteps[currentCustomerStep].title}
                  </h3>
                </div>
                
                {demoSteps[currentCustomerStep].type === 'textarea' && (
                  <div className="bg-white rounded border border-gray-200 p-2">
                    <textarea
                      value={customerStepContent[`step-${currentCustomerStep}`] || ''}
                      className="w-full border-0 focus:outline-none text-gray-800 resize-none font-sans text-xs"
                      rows={3}
                      readOnly
                    />
                  </div>
                )}
                
                {demoSteps[currentCustomerStep].type === 'file_upload' && (
                  <div className="bg-white border border-dashed border-gray-300 rounded p-3 text-center">
                    <Upload className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                    <div className="text-gray-600 text-xs font-sans">
                      {customerStepContent[`step-${currentCustomerStep}`] || 'Drop files here'}
                    </div>
                  </div>
                )}
                
                {completedSteps.includes(`step-${currentCustomerStep}`) && (
                  <div className="mt-2 flex items-center text-emerald-600 font-medium font-sans text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completed
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderDesktopAnalytics = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2 font-sans">Outstanding Results! 🎉</h1>
        <p className="text-emerald-600 font-sans">Your onboarding is performing excellently</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-emerald-600 font-sans">{demoSteps.length}/{demoSteps.length}</div>
          <div className="text-sm text-gray-600 font-sans">Steps Completed</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 font-sans">87%</div>
          <div className="text-sm text-gray-600 font-sans">Completion Rate</div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3 font-sans">🚀 What's next?</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center mr-2">
              <Check className="w-2 h-2 text-white" />
            </div>
            <p className="font-sans">Design team review within 24 hours</p>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center mr-2">
              <Calendar className="w-2 h-2 text-white" />
            </div>
            <p className="font-sans">Initial wireframes by Friday</p>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center mr-2">
              <Phone className="w-2 h-2 text-white" />
            </div>
            <p className="font-sans">Kickoff call next week</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMobileAnalytics = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-4 text-center">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle className="w-6 h-6 text-emerald-600" />
        </div>
        <h1 className="text-lg font-bold text-gray-900 mb-1 font-sans">Great Results! 🎉</h1>
        <p className="text-emerald-600 text-sm font-sans">Onboarding complete</p>
      </div>

      <div className="bg-white rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600 font-sans">{demoSteps.length}/{demoSteps.length}</div>
            <div className="text-xs text-gray-600 font-sans">Steps Done</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 font-sans">87%</div>
            <div className="text-xs text-gray-600 font-sans">Success Rate</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-3">
          <h3 className="font-medium text-gray-900 mb-2 text-sm font-sans">🚀 Next Steps</h3>
          <div className="space-y-1 text-xs text-gray-700">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
              <p className="font-sans">Team review in 24h</p>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <p className="font-sans">Wireframes by Friday</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-sans">
            See OnboardFlo in action
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-sans">
            Watch how easy it is to create, manage, and track customer onboarding flows
          </p>
        </div>

        {/* Desktop Demo */}
        <div className="hidden md:block">
          <div className="max-w-5xl mx-auto">
            {/* Browser mockup */}
            <div className="bg-gray-200 rounded-t-xl p-3">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="bg-white rounded-lg px-4 py-2 flex items-center">
                <div className="w-4 h-4 bg-gray-300 rounded mr-3"></div>
                <div className="text-sm text-gray-600 font-sans">onboardflo.com</div>
              </div>
            </div>
            
            <div className="bg-white border-x border-b border-gray-200 rounded-b-xl p-8 min-h-[500px]">
              <div className="transition-all duration-500 ease-in-out">
                {views[currentView] === 'dashboard' && renderDesktopDashboard()}
                {views[currentView] === 'template-selection' && renderDesktopTemplateSelection()}
                {views[currentView] === 'checklist-builder' && renderDesktopChecklistBuilder()}
                {views[currentView] === 'customer-experience' && renderDesktopCustomerExperience()}
                {views[currentView] === 'analytics' && renderDesktopAnalytics()}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Demo */}
        <div className="md:hidden">
          <div className="max-w-sm mx-auto">
            {/* Phone mockup */}
            <div className="bg-gray-900 rounded-3xl p-2">
              <div className="bg-black rounded-2xl p-1">
                <div className="bg-white rounded-2xl overflow-hidden">
                  {/* Status bar */}
                  <div className="bg-gray-900 px-4 py-2 flex items-center justify-between">
                    <div className="text-white text-xs font-sans">9:41</div>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-2 bg-white rounded-sm"></div>
                      <div className="w-1 h-2 bg-white rounded-sm"></div>
                    </div>
                  </div>
                  
                  {/* App header */}
                  <div className="bg-emerald-500 px-4 py-3 flex items-center">
                    <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center mr-2">
                      <Workflow className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-white font-bold text-sm font-sans">OnboardFlo</span>
                  </div>
                  
                  <div className="p-4 min-h-[400px] bg-gray-50">
                    <div className="transition-all duration-500 ease-in-out">
                      {views[currentView] === 'dashboard' && renderMobileDashboard()}
                      {views[currentView] === 'template-selection' && renderMobileTemplateSelection()}
                      {views[currentView] === 'checklist-builder' && renderMobileChecklistBuilder()}
                      {views[currentView] === 'customer-experience' && renderMobileCustomerExperience()}
                      {views[currentView] === 'analytics' && renderMobileAnalytics()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Controls */}
        <div className="flex items-center justify-center mt-8 space-x-4">
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors font-sans ${
              autoPlay 
                ? 'bg-emerald-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {autoPlay ? 'Pause Demo' : 'Play Demo'}
          </button>
          
          <div className="flex items-center space-x-2">
            {views.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentView(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentView === index ? 'bg-emerald-500' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Device labels */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500 font-sans">
            <span className="hidden md:inline">Desktop Experience</span>
            <span className="md:hidden">Mobile Experience</span>
          </p>
        </div>
      </div>
    </section>
  );
}