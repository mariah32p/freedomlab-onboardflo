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

// Types
interface Template {
  id: string;
  name: string;
  category: string;
  icon: string;
  color: string;
  description: string;
  steps: number;
  popular: boolean;
}

interface Step {
  id: string;
  title: string;
  description: string;
  type: string;
  placeholder: string;
  required: boolean;
  content: string;
}

interface CustomerData {
  name: string;
  email: string;
  company: string;
}

interface DemoHeaderProps {
  currentView: number;
  views: string[];
  autoPlay: boolean;
  setAutoPlay: (value: boolean) => void;
  setCurrentView: (value: number) => void;
}

// Mock DemoHeader component
const DemoHeader: React.FC<DemoHeaderProps> = ({ 
  currentView, 
  views, 
  autoPlay, 
  setAutoPlay, 
  setCurrentView 
}) => (
  <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-white/20 z-50">
    <div className="max-w-7xl mx-auto px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900">Demo: Client Onboarding</h1>
          <div className="flex items-center space-x-2">
            {views.map((view, index) => (
              <button
                key={view}
                onClick={() => setCurrentView(index)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  currentView === index 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {view.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              autoPlay 
                ? 'bg-emerald-500 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {autoPlay ? 'Pause Demo' : 'Play Demo'}
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default function DemoPage() {
  const [currentView, setCurrentView] = useState<number>(0);
  const [autoPlay, setAutoPlay] = useState<boolean>(true);
  
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const [checklistTitle, setChecklistTitle] = useState<string>('');
  const [checklistDescription, setChecklistDescription] = useState<string>('');
  const [steps, setSteps] = useState<Step[]>([]);
  const [buildingStep, setBuildingStep] = useState<number>(0);
  const stepsContainerRef = useRef<HTMLDivElement>(null);
  
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    email: '',
    company: ''
  });
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [currentCustomerStep, setCurrentCustomerStep] = useState<number>(0);
  const [showCustomerForm, setShowCustomerForm] = useState<boolean>(true);
  const [customerStepContent, setCustomerStepContent] = useState<Record<string, string>>({});
  const [isTypingStep, setIsTypingStep] = useState<boolean>(false);
  const [typingStepId, setTypingStepId] = useState<string>('');

  const autoPlayRef = useRef(autoPlay);
  autoPlayRef.current = autoPlay;

  const views = [
    'dashboard',
    'template-selection', 
    'checklist-builder',
    'customer-experience',
    'completion'
  ];

  const templates: Template[] = [
    {
      id: 'website-design',
      name: 'Website Design Project',
      category: 'Design',
      icon: '🎨',
      color: '#3b82f6',
      description: 'Complete onboarding flow for website design clients including discovery, assets, and project setup',
      steps: 8,
      popular: true
    },
    {
      id: 'web-development',
      name: 'Web Development Project',
      category: 'Development',
      icon: '💻',
      color: '#10b981',
      description: 'Technical onboarding for web development projects with requirements gathering',
      steps: 6,
      popular: false
    },
    {
      id: 'ecommerce-setup',
      name: 'E-commerce Store Setup',
      category: 'E-commerce',
      icon: '🛒',
      color: '#f59e0b',
      description: 'Comprehensive onboarding for e-commerce website projects',
      steps: 10,
      popular: false
    },
    {
      id: 'marketing-campaign',
      name: 'Marketing Campaign Launch',
      category: 'Marketing',
      icon: '📈',
      color: '#ef4444',
      description: 'Strategic onboarding for marketing campaign development',
      steps: 7,
      popular: false
    },
    {
      id: 'brand-identity',
      name: 'Brand Identity Design',
      category: 'Design',
      icon: '✨',
      color: '#8b5cf6',
      description: 'Complete brand identity development process',
      steps: 9,
      popular: false
    },
    {
      id: 'app-development',
      name: 'Mobile App Development',
      category: 'Development',
      icon: '📱',
      color: '#06b6d4',
      description: 'Mobile app development project onboarding',
      steps: 12,
      popular: false
    }
  ];

  const websiteDesignSteps = [
    {
      title: 'Project Discovery & Requirements',
      description: 'Share your project vision, target audience, and key business objectives',
      type: 'textarea',
      placeholder: 'Describe your project goals, target audience, and key requirements...',
      required: true,
      content: "We're a B2B SaaS company targeting enterprise clients in the healthcare industry. We need a modern, professional website that showcases our AI-powered patient data analytics platform. Our target audience is CTOs and data scientists at hospitals and healthcare systems with 500+ beds."
    },
    {
      title: 'Brand Assets & Style Guide',
      description: 'Upload your logo, brand guidelines, color palette, and existing design materials',
      type: 'file_upload',
      placeholder: 'Accepted formats: .pdf, .ai, .jpg, .png, .zip',
      required: true,
      content: "HealthTech_Logo_Package.zip, Brand_Guidelines_2024.pdf, Color_Palette.ai"
    },
    {
      title: 'Website Content & Copy',
      description: 'Provide all text content including page copy, product descriptions, and company information',
      type: 'file_upload',
      placeholder: 'Accepted formats: .pdf, .doc, .docx, .txt',
      required: true,
      content: "Website_Copy_Draft.docx, Product_Descriptions.pdf, Team_Bios.docx"
    },
    {
      title: 'Design Inspiration & References',
      description: 'Share websites you love, describe your preferred style, and provide visual inspiration',
      type: 'textarea',
      placeholder: 'Share website URLs you like and describe your preferred design style...',
      required: true,
      content: "We love the clean, technical aesthetic of Stripe (stripe.com) and the data visualization style of Tableau. We want something modern but professional, trustworthy, and emphasizing security."
    },
    {
      title: 'Technical Requirements & Integrations',
      description: 'Specify hosting preferences, CMS requirements, third-party integrations, and special functionality',
      type: 'textarea',
      placeholder: 'List any specific technical requirements, integrations, or hosting preferences...',
      required: true,
      content: "Technical requirements: React/Next.js preferred, AWS hosting for HIPAA compliance, Salesforce integration for lead capture, and a headless CMS for the blog."
    },
  ];

  const demoChecklistSteps = websiteDesignSteps.slice(0, 5);

  const advanceView = useCallback(() => {
    setCurrentView(prev => (prev + 1) % views.length);
  }, [views.length]);

  useEffect(() => {
    if (!autoPlay) return;

    const view = views[currentView];
    let viewTimeout: NodeJS.Timeout;
    let isCancelled = false;

    switch (view) {
      case 'dashboard':
        viewTimeout = setTimeout(advanceView, 4000);
        break;

      case 'template-selection':
        setSelectedTemplate(null);
        setSearchTerm('');
        
        setTimeout(() => setSearchTerm('website'), 1000);
        setTimeout(() => setSelectedTemplate('website-design'), 2500);
        viewTimeout = setTimeout(advanceView, 4500);
        break;

      case 'checklist-builder':
        setSteps([]);
        setChecklistTitle('');
        setChecklistDescription('');
        setBuildingStep(0);
        
        setTimeout(() => {
          setChecklistTitle('Website Design Project Onboarding');
          setChecklistDescription('Complete onboarding process for new website design clients');
        }, 1000);
        
        demoChecklistSteps.forEach((step, index) => {
          setTimeout(() => {
            if (isCancelled) return;
            setBuildingStep(index + 1);
            setSteps(prev => [...prev, { ...step, id: `step-${index}` }]);
          }, 2000 + (index * 1200));
        });
        
        const builderDuration = 2000 + (demoChecklistSteps.length * 1200) + 1500;
        viewTimeout = setTimeout(advanceView, builderDuration);
        break;

      case 'customer-experience': {
        const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

        const runCustomerFlow = async () => {
          if (isCancelled) return;
          setCustomerData({ name: '', email: '', company: '' });
          setCompletedSteps([]);
          setCurrentCustomerStep(0);
          setShowCustomerForm(true);
          setCustomerStepContent({});
          setIsTypingStep(false);
          setTypingStepId('');

          await sleep(1000);
          if (isCancelled || !autoPlayRef.current) return;
          setCustomerData({
            name: 'Sarah Martinez',
            email: 'sarah@healthtech.com',
            company: 'HealthTech Solutions'
          });

          await sleep(2000);
          if (isCancelled || !autoPlayRef.current) return;
          setShowCustomerForm(false);
          
          await sleep(500);

          for (let i = 0; i < demoChecklistSteps.length; i++) {
            if (isCancelled || !autoPlayRef.current) return;
            
            const step = demoChecklistSteps[i];
            setCurrentCustomerStep(i);
            await sleep(1000);

            if (isCancelled || !autoPlayRef.current) return;
            await new Promise<void>(resolve => {
              setIsTypingStep(true);
              setTypingStepId(`step-${i}`);
              const content = step.content;
              let charIndex = 0;
              const typeInterval = setInterval(() => {
                if (isCancelled || charIndex >= content.length) {
                  clearInterval(typeInterval);
                  resolve();
                } else {
                  setCustomerStepContent(prev => ({...prev, [`step-${i}`]: content.slice(0, charIndex + 1)}));
                  charIndex++;
                }
              }, 15);
            });

            if (isCancelled || !autoPlayRef.current) return;
            setIsTypingStep(false);
            await sleep(500);

            if (isCancelled || !autoPlayRef.current) return;
            setCompletedSteps(prev => [...prev, `step-${i}`]);
            await sleep(1500);
          }
          
          if (isCancelled || !autoPlayRef.current) return;
          await sleep(500);
          advanceView();
        };

        runCustomerFlow();
        break;
      }
      case 'completion':
        viewTimeout = setTimeout(advanceView, 8000);
        break;
      default:
        break;
    }

    return () => {
      isCancelled = true;
      if (viewTimeout) clearTimeout(viewTimeout);
    };
  }, [currentView, advanceView, autoPlay, demoChecklistSteps]);
  
  useEffect(() => {
    if (stepsContainerRef.current) {
      const scrollElement = stepsContainerRef.current;
      scrollElement.scrollTo({
        top: scrollElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [steps]);

  const renderDashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">127</div>
              <div className="text-sm text-gray-600">Active Clients</div>
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">94%</div>
              <div className="text-sm text-gray-600">Completion Rate</div>
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">2.8d</div>
              <div className="text-sm text-gray-600">Avg. Time</div>
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">↑68%</div>
              <div className="text-sm text-gray-600">vs Manual</div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Live Client Activity</h2>
            <div className="flex items-center text-sm text-emerald-600">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
              <span>Live</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              {
                initials: 'SM',
                name: 'Sarah Martinez',
                company: 'HealthTech Solutions • Website Redesign',
                status: '✓ Just uploaded brand assets • 3 min ago',
                progress: 87,
                steps: '7/8 steps • 2.3 days',
                color: 'emerald'
              },
              {
                initials: 'MC',
                name: 'Marcus Chen',
                company: 'StartupXYZ • E-commerce Platform',
                status: 'Working on technical requirements • 12 min ago',
                progress: 62,
                steps: '6/10 steps • 1.8 days',
                color: 'blue'
              },
              {
                initials: 'ER',
                name: 'Emily Rodriguez',
                company: 'GrowthCo • Brand Identity Project',
                status: 'Reviewing design concepts • 45 min ago',
                progress: 78,
                steps: '7/9 steps • 3.1 days',
                color: 'purple'
              }
            ].map((client, index) => (
              <div key={index} className={`flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-${client.color}-50 to-${client.color}-100 border border-${client.color}-200`}>
                <div className="flex items-center">
                  <div className={`w-10 h-10 bg-gradient-to-br from-${client.color}-400 to-${client.color}-500 rounded-full flex items-center justify-center mr-4 shadow-lg`}>
                    <span className="text-white text-sm font-bold">{client.initials}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{client.name}</div>
                    <div className="text-sm text-gray-600">{client.company}</div>
                    <div className={`text-xs text-${client.color}-700`}>{client.status}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center mb-2">
                    <div className={`w-20 bg-${client.color}-200 rounded-full h-2 mr-3`}>
                      <div className={`bg-${client.color}-500 h-2 rounded-full transition-all duration-1000`} style={{ width: `${client.progress}%` }}></div>
                    </div>
                    <span className="text-sm font-bold text-gray-700">{client.progress}%</span>
                  </div>
                  <div className={`text-xs text-${client.color}-600`}>{client.steps}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all duration-200">
            <Plus className="w-5 h-5 mr-2" />
            Create New Checklist
          </button>
          <button className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-200">
            <Send className="w-5 h-5 mr-2" />
            Send Client Reminder
          </button>
          <button className="flex items-center justify-center p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200">
            <BarChart3 className="w-5 h-5 mr-2" />
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );

  const renderTemplateSelection = () => (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-blue-600 p-8 text-white">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Choose Your Template</h2>
            <p className="text-blue-100 text-lg">Start with a proven template or create from scratch</p>
          </div>
        </div>
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Search templates..."
                readOnly
              />
            </div>
            <select className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
              <option value="All">All Categories</option>
              <option value="Design">Design</option>
              <option value="Development">Development</option>
              <option value="Marketing">Marketing</option>
              <option value="E-commerce">E-commerce</option>
            </select>
          </div>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-emerald-400 hover:bg-emerald-50 transition-all cursor-pointer group">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 group-hover:bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4 transition-colors">
                  <Plus className="w-6 h-6 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Start from Scratch</h3>
                <p className="text-gray-600 text-sm">Create a completely custom checklist</p>
              </div>
            </div>
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
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mr-4 shadow-sm"
                    style={{ backgroundColor: `${template.color}20` }}
                  >
                    {template.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                    <span 
                      className="inline-block px-2 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: template.color }}
                    >
                      {template.category}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{template.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-500">
                    {template.steps} steps included
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">(4.9)</span>
                  </div>
                </div>

                <button 
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                    selectedTemplate === template.id
                      ? 'bg-emerald-500 text-white shadow-lg'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {selectedTemplate === template.id ? 'Selected ✓' : 'Use This Template'}
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
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{checklistTitle || 'Building Your Checklist...'}</h2>
              <p className="text-blue-100">{checklistDescription || 'Setting up your client onboarding flow'}</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg">
                <Save className="w-4 h-4 mr-2 inline" />
                Save Draft
              </button>
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg">
                Publish Checklist
              </button>
            </div>
          </div>
        </div>
        <div className="p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Checklist Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input 
                      type="text" 
                      value={checklistTitle}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea 
                      value={checklistDescription}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      readOnly
                    />
                  </div>
                </div>
              </div>
              {buildingStep > 0 && buildingStep <= demoChecklistSteps.length && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                  <h4 className="font-semibold text-emerald-900 mb-4">
                    Adding Step {buildingStep}: {demoChecklistSteps[buildingStep - 1]?.title}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse"></div>
                      <span className="text-sm text-emerald-800">Configuring step settings...</span>
                    </div>
                    <div className="w-full bg-emerald-200 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(buildingStep / demoChecklistSteps.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Checklist Steps ({steps.length})</h3>
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Step
                </button>
              </div>
              
              <div ref={stepsContainerRef} className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {steps.map((step) => (
                  <div key={step.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <span className="text-lg mr-3 mt-1">
                          {step.type === 'textarea' ? '📝' : '📎'}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h4 className="font-semibold text-gray-900">{step.title}</h4>
                            {step.required && (
                              <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                Required
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                          <div className="mt-2 flex items-center">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                              {step.type === 'textarea' ? 'Long Text' : 'File Upload'}
                            </span>
                          </div>
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
                    <p className="text-gray-500">Building your checklist...</p>
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
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Your Website Project!</h2>
            <p className="text-gray-600">Let's get started with some basic information</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                value={customerData.name}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your full name"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
              <input
                type="email"
                value={customerData.email}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="your@email.com"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
              <input
                type="text"
                value={customerData.company}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your company"
                readOnly
              />
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl">
              Continue to Checklist
            </button>
          </div>
        </div>
      )}

      {!showCustomerForm && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Website Design Project Onboarding</h1>
              <p className="text-blue-100">Complete these steps to get your project started</p>
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-100">Progress</span>
                  <span className="text-sm font-medium text-blue-100">{completedSteps.length}/{demoChecklistSteps.length} completed</span>
                </div>
                <div className="w-full bg-blue-400/30 rounded-full h-3">
                  <div 
                    className="bg-white h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(completedSteps.length / demoChecklistSteps.length) * 100}%` }}
                  ></div>
                </div>
                <div className="text-center mt-2">
                  <span className="text-lg font-bold text-white">
                    {Math.round((completedSteps.length / demoChecklistSteps.length) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-8">
            {currentCustomerStep < demoChecklistSteps.length && (
              <div className="bg-blue-50 rounded-xl p-8 mb-8 border-2 border-blue-200">
                <div className="flex items-center mb-6">
                  <span className="text-3xl mr-4">
                    {demoChecklistSteps[currentCustomerStep].type === 'textarea' ? '📝' : '📎'}
                  </span>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Step {currentCustomerStep + 1}: {demoChecklistSteps[currentCustomerStep].title}
                    </h3>
                    {demoChecklistSteps[currentCustomerStep].required && (
                      <span className="inline-block mt-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                        Required
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed text-lg">{demoChecklistSteps[currentCustomerStep].description}</p>
                {demoChecklistSteps[currentCustomerStep].type === 'textarea' && (
                  <div className="bg-white rounded-lg border-2 border-gray-200 p-4">
                    <textarea
                      value={customerStepContent[`step-${currentCustomerStep}`] || ''}
                      className="w-full px-4 py-3 border-0 focus:outline-none focus:ring-0 text-gray-800 resize-none"
                      placeholder={demoChecklistSteps[currentCustomerStep].placeholder}
                      rows={8}
                      readOnly
                    />
                    {isTypingStep && typingStepId === `step-${currentCustomerStep}` && (
                      <div className="flex items-center mt-2 text-blue-600">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
                        <span className="text-xs">Typing...</span>
                      </div>
                    )}
                  </div>
                )}
                {demoChecklistSteps[currentCustomerStep].type === 'file_upload' && (
                  <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <div className="text-gray-600 mb-4 text-lg">
                      {customerStepContent[`step-${currentCustomerStep}`] ? (
                        <div className="space-y-2">
                          <span className="text-emerald-600 font-medium">Files uploaded successfully!</span>
                          <div className="text-sm text-gray-700 bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                            {customerStepContent[`step-${currentCustomerStep}`]}
                          </div>
                        </div>
                      ) : (
                        'Drop files here or click to upload'
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {demoChecklistSteps[currentCustomerStep].placeholder}
                    </div>
                  </div>
                )}
                {completedSteps.includes(`step-${currentCustomerStep}`) && (
                  <div className="mt-6 flex items-center text-emerald-600 font-medium">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Step completed successfully
                  </div>
                )}
              </div>
            )}

            {completedSteps.length > 0 && (
              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                <h4 className="font-semibold text-emerald-900 mb-4">Completed Steps ({completedSteps.length}/{demoChecklistSteps.length})</h4>
                <div className="space-y-3">
                  {completedSteps.map((stepId, index) => (
                    <div key={stepId} className="flex items-center text-sm text-emerald-700">
                      <CheckCircle className="w-4 h-4 mr-3 flex-shrink-0" />
                      <span>
                        {demoChecklistSteps[index]?.title}
                      </span>
                    </div>
                  ))}
                </div>
                
                {completedSteps.length === demoChecklistSteps.length && (
                  <div className="mt-6 p-4 bg-emerald-100 rounded-lg border border-emerald-300">
                    <div className="flex items-center text-emerald-800 font-medium">
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
            <h1 className="text-4xl font-bold mb-4">Outstanding Work, Sarah!</h1>
            <p className="text-emerald-100 text-lg">Your website project onboarding is complete!</p>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">{demoChecklistSteps.length}/{demoChecklistSteps.length}</div>
              <div className="text-sm text-gray-600">Steps Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">1.8</div>
              <div className="text-sm text-gray-600">Days to Complete</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">100%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">🚀 What happens next?</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <p>Our design team will review your requirements within 24 hours</p>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <Calendar className="w-3 h-3 text-white" />
                </div>
                <p>You'll receive initial wireframes and mood boards by Friday</p>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <Phone className="w-3 h-3 text-white" />
                </div>
                <p>We'll schedule your project kickoff call for next week</p>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <Target className="w-3 h-3 text-white" />
                </div>
                <p>Expected project completion: 8-10 weeks</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl">
              View Project Portal
            </button>
            <button className="bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:border-gray-300 hover:shadow-md">
              Schedule Strategy Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <DemoHeader 
        currentView={currentView}
        views={views}
        autoPlay={autoPlay}
        setAutoPlay={setAutoPlay}
        setCurrentView={setCurrentView}
      />
      
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        {views[currentView] === 'dashboard' && renderDashboard()}
        {views[currentView] === 'template-selection' && renderTemplateSelection()}
        {views[currentView] === 'checklist-builder' && renderChecklistBuilder()}
        {views[currentView] === 'customer-experience' && renderCustomerExperience()}
        {views[currentView] === 'completion' && renderCompletion()}
      </div>
    </div>
  );
}