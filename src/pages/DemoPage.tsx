import React, { useState, useEffect } from 'react';
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
import DemoHeader from '../components/DemoHeader';

export default function DemoPage() {
  const [currentView, setCurrentView] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  
  // Template selection state
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Checklist building state
  const [checklistTitle, setChecklistTitle] = useState('');
  const [checklistDescription, setChecklistDescription] = useState('');
  const [steps, setSteps] = useState<any[]>([]);
  const [buildingStep, setBuildingStep] = useState(0);
  
  // Customer experience state - MUCH SLOWER
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    company: ''
  });
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [currentCustomerStep, setCurrentCustomerStep] = useState(0);
  const [showCustomerForm, setShowCustomerForm] = useState(true);
  const [customerStepContent, setCustomerStepContent] = useState<Record<string, string>>({});
  const [isTypingStep, setIsTypingStep] = useState(false);
  const [typingStepId, setTypingStepId] = useState<string>('');

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
      content: "We're a B2B SaaS company targeting enterprise clients in the healthcare industry. We need a modern, professional website that showcases our AI-powered patient data analytics platform. Our target audience is CTOs and data scientists at hospitals and healthcare systems with 500+ beds. The site should emphasize trust, security, HIPAA compliance, and technical expertise while being approachable for non-technical decision makers."
    },
    {
      title: 'Brand Assets & Style Guide',
      description: 'Upload your logo, brand guidelines, color palette, and existing design materials',
      type: 'file_upload',
      placeholder: 'Accepted formats: .pdf, .ai, .jpg, .png, .zip',
      required: true,
      content: "HealthTech_Logo_Package.zip, Brand_Guidelines_2024.pdf, Color_Palette.ai, Typography_Guide.pdf"
    },
    {
      title: 'Website Content & Copy',
      description: 'Provide all text content including page copy, product descriptions, and company information',
      type: 'file_upload',
      placeholder: 'Accepted formats: .pdf, .doc, .docx, .txt',
      required: true,
      content: "Website_Copy_Draft.docx, Product_Descriptions.pdf, Team_Bios.docx, Case_Studies.pdf, Compliance_Documentation.pdf"
    },
    {
      title: 'Design Inspiration & References',
      description: 'Share websites you love, describe your preferred style, and provide visual inspiration',
      type: 'textarea',
      placeholder: 'Share website URLs you like and describe your preferred design style...',
      required: true,
      content: "Design inspiration: We love the clean, technical aesthetic of Stripe (stripe.com), the trust-building approach of Salesforce Health Cloud, and the data visualization style of Tableau. We want something modern but not too flashy - professional, trustworthy, and emphasizing security. Think 'enterprise healthcare' meets 'Silicon Valley innovation'. Reference sites: stripe.com, salesforce.com/products/health-cloud, tableau.com"
    },
    {
      title: 'Technical Requirements & Integrations',
      description: 'Specify hosting preferences, CMS requirements, third-party integrations, and special functionality',
      type: 'textarea',
      placeholder: 'List any specific technical requirements, integrations, or hosting preferences...',
      required: true,
      content: "Technical requirements: React/Next.js preferred, AWS hosting for HIPAA compliance, integrate with our existing API (REST + GraphQL), need headless CMS for blog and resources, Salesforce integration for lead capture, Google Analytics + Mixpanel for tracking, must support SSO (SAML), need patient data demo environment, mobile-responsive with offline capability for trade shows."
    },
    {
      title: 'Contact Information & Team Access',
      description: 'Provide team member details, social media profiles, and communication preferences',
      type: 'textarea',
      placeholder: 'List team members who need access and their contact information...',
      required: true,
      content: "Team contacts: sarah@healthtech.com (Project Lead), mike@healthtech.com (CTO), lisa@healthtech.com (VP Marketing), david@healthtech.com (Head of Sales). Social: @healthtechAI on Twitter/LinkedIn. Slack workspace: healthtech-team.slack.com. Preferred communication: Slack for daily updates, email for formal approvals, weekly video calls on Fridays 2 PM EST."
    },
    {
      title: 'Budget & Timeline Confirmation',
      description: 'Review and confirm project budget, payment schedule, and timeline expectations',
      type: 'checkbox',
      placeholder: '',
      required: true,
      content: "Budget confirmed: $25,000 for full website redesign and development. Timeline: 8-10 weeks including 2 weeks for compliance review. Payment: 40% upfront, 40% at design approval, 20% on launch. Additional $5K allocated for ongoing maintenance and updates."
    },
    {
      title: 'Project Kickoff Call Scheduling',
      description: 'Schedule our initial strategy session and project planning meeting',
      type: 'checkbox',
      placeholder: '',
      required: true,
      content: "Kickoff call scheduled for next Tuesday at 2 PM EST. Attendees: Sarah (client), Mike (CTO), our design team lead, and project manager. Agenda: technical requirements review, design direction alignment, compliance requirements discussion, project timeline finalization. Follow-up: weekly check-ins every Friday, design reviews via Figma, development updates via project portal."
    }
  ];

  // Auto-advance through views - MUCH SLOWER FOR CUSTOMER EXPERIENCE
  useEffect(() => {
    if (!autoPlay) return;
    
    const timer = setInterval(() => {
      setCurrentView(prev => (prev + 1) % views.length);
    }, 15000); // 15 seconds per view

    return () => clearInterval(timer);
  }, [autoPlay]);

  // Reset state when view changes and simulate interactions
  useEffect(() => {
    if (views[currentView] === 'template-selection') {
      // Reset template selection
      setSelectedTemplate(null);
      setSearchTerm('');
      
      // Simulate searching and selecting template
      setTimeout(() => setSearchTerm('website'), 1500);
      setTimeout(() => setSelectedTemplate('website-design'), 3500);
    }
    
    if (views[currentView] === 'checklist-builder') {
      // Reset checklist builder
      setSteps([]);
      setChecklistTitle('');
      setChecklistDescription('');
      setBuildingStep(0);
      
      // Simulate building the checklist
      setTimeout(() => {
        setChecklistTitle('Website Design Project Onboarding');
        setChecklistDescription('Complete onboarding process for new website design clients');
      }, 1500);
      
      // Add steps one by one
      websiteDesignSteps.forEach((step, index) => {
        setTimeout(() => {
          setBuildingStep(index + 1);
          setSteps(prev => [...prev, { ...step, id: `step-${index}` }]);
        }, 3000 + (index * 800));
      });
    }
    
    if (views[currentView] === 'customer-experience') {
      // Reset customer state
      setCustomerData({ name: '', email: '', company: '' });
      setCompletedSteps([]);
      setCurrentCustomerStep(0);
      setShowCustomerForm(true);
      setCustomerStepContent({});
      setIsTypingStep(false);
      setTypingStepId('');
      
      // Simulate customer filling out form
      setTimeout(() => {
        setCustomerData({
          name: 'Sarah Martinez',
          email: 'sarah@healthtech.com',
          company: 'HealthTech Solutions'
        });
      }, 2000);
      
      setTimeout(() => {
        setShowCustomerForm(false);
        setCurrentCustomerStep(0);
      }, 4000);
      
      // THE MAIN EVENT - Customer going through ALL 8 steps with proper timing
      websiteDesignSteps.forEach((step, index) => {
        const baseDelay = 5000; // Start after form is hidden
        const stepDuration = 6000; // 6 seconds per step - MUCH LONGER
        
        // Show step
        setTimeout(() => {
          setCurrentCustomerStep(index);
        }, baseDelay + (index * stepDuration));
        
        // Start typing content
        setTimeout(() => {
          setIsTypingStep(true);
          setTypingStepId(`step-${index}`);
          
          // Simulate typing the content
          const content = step.content;
          let charIndex = 0;
          
          const typeInterval = setInterval(() => {
            if (charIndex < content.length) {
              setCustomerStepContent(prev => ({ 
                ...prev, 
                [`step-${index}`]: content.slice(0, charIndex + 1) 
              }));
              charIndex++;
            } else {
              clearInterval(typeInterval);
              setIsTypingStep(false);
              
              // Complete the step after typing is done
              setTimeout(() => {
                setCompletedSteps(prev => [...prev, `step-${index}`]);
              }, 500);
            }
          }, 30); // Typing speed
          
        }, baseDelay + (index * stepDuration) + 1000); // Start typing 1 second after step shows
      });
    }
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
              <div className="text-2xl font-bold text-gray-900 font-sans">127</div>
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
              <div className="text-2xl font-bold text-gray-900 font-sans">2.8d</div>
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
              <div className="text-2xl font-bold text-gray-900 font-sans">↑68%</div>
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
                  <div className="text-sm text-gray-600 font-sans">HealthTech Solutions • Website Redesign</div>
                  <div className="text-xs text-emerald-700 font-sans">✓ Just uploaded brand assets • 3 min ago</div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center mb-2">
                  <div className="w-20 bg-emerald-200 rounded-full h-2 mr-3">
                    <div className="bg-emerald-500 h-2 rounded-full transition-all duration-1000" style={{ width: '87%' }}></div>
                  </div>
                  <span className="text-sm font-bold text-gray-700 font-sans">87%</span>
                </div>
                <div className="text-xs text-emerald-600 font-sans">7/8 steps • 2.3 days</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-white text-sm font-bold font-sans">MC</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 font-sans">Marcus Chen</div>
                  <div className="text-sm text-gray-600 font-sans">StartupXYZ • E-commerce Platform</div>
                  <div className="text-xs text-blue-700 font-sans">Working on technical requirements • 12 min ago</div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center mb-2">
                  <div className="w-20 bg-blue-200 rounded-full h-2 mr-3">
                    <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000" style={{ width: '62%' }}></div>
                  </div>
                  <span className="text-sm font-bold text-gray-700 font-sans">62%</span>
                </div>
                <div className="text-xs text-blue-600 font-sans">6/10 steps • 1.8 days</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-white text-sm font-bold font-sans">ER</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 font-sans">Emily Rodriguez</div>
                  <div className="text-sm text-gray-600 font-sans">GrowthCo • Brand Identity Project</div>
                  <div className="text-xs text-purple-700 font-sans">Reviewing design concepts • 45 min ago</div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center mb-2">
                  <div className="w-20 bg-purple-200 rounded-full h-2 mr-3">
                    <div className="bg-purple-500 h-2 rounded-full transition-all duration-1000" style={{ width: '78%' }}></div>
                  </div>
                  <span className="text-sm font-bold text-gray-700 font-sans">78%</span>
                </div>
                <div className="text-xs text-purple-600 font-sans">7/9 steps • 3.1 days</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-sans">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-sans">
            <Plus className="w-5 h-5 mr-2" />
            Create New Checklist
          </button>
          <button className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-sans">
            <Send className="w-5 h-5 mr-2" />
            Send Client Reminder
          </button>
          <button className="flex items-center justify-center p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-sans">
            <BarChart3 className="w-5 h-5 mr-2" />
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );

  const renderTemplateSelection = () => (
    <div className="max-w-6xl mx-auto pt-8">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-blue-600 p-8 text-white">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold font-sans mb-2">Choose Your Template</h2>
            <p className="text-blue-100 text-lg font-sans">Start with a proven template or create from scratch</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                placeholder="Search templates..."
                readOnly
              />
            </div>
            <select className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans">
              <option value="All">All Categories</option>
              <option value="Design">Design</option>
              <option value="Development">Development</option>
              <option value="Marketing">Marketing</option>
              <option value="E-commerce">E-commerce</option>
            </select>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create from Scratch */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-emerald-400 hover:bg-emerald-50 transition-all cursor-pointer group">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 group-hover:bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4 transition-colors">
                  <Plus className="w-6 h-6 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-sans">Start from Scratch</h3>
                <p className="text-gray-600 text-sm font-sans">Create a completely custom checklist</p>
              </div>
            </div>

            {/* Template Cards */}
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
                    <h3 className="text-lg font-semibold text-gray-900 font-sans">{template.name}</h3>
                    <span 
                      className="inline-block px-2 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: template.color }}
                    >
                      {template.category}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 font-sans leading-relaxed">{template.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-500 font-sans">
                    {template.steps} steps included
                  </div>
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
    <div className="max-w-7xl mx-auto pt-8">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-sans">{checklistTitle || 'Building Your Checklist...'}</h2>
              <p className="text-blue-100 font-sans">{checklistDescription || 'Setting up your client onboarding flow'}</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg font-sans">
                <Save className="w-4 h-4 mr-2 inline" />
                Save Draft
              </button>
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg font-sans">
                Publish Checklist
              </button>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Checklist Settings */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 font-sans">Checklist Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Title</label>
                    <input 
                      type="text" 
                      value={checklistTitle}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Description</label>
                    <textarea 
                      value={checklistDescription}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans"
                      rows={3}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Building indicator */}
              {buildingStep > 0 && buildingStep <= websiteDesignSteps.length && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                  <h4 className="font-semibold text-emerald-900 mb-4 font-sans">
                    Adding Step {buildingStep}: {websiteDesignSteps[buildingStep - 1]?.title}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse"></div>
                      <span className="text-sm text-emerald-800 font-sans">Configuring step settings...</span>
                    </div>
                    <div className="w-full bg-emerald-200 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(buildingStep / websiteDesignSteps.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Steps Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 font-sans">Checklist Steps ({steps.length})</h3>
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center font-sans">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Step
                </button>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {steps.map((step, index) => (
                  <div key={step.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <span className="text-lg mr-3 mt-1">
                          {step.type === 'textarea' ? '📝' : 
                           step.type === 'file_upload' ? '📎' : 
                           step.type === 'checkbox' ? '☑️' : '📝'}
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
                          <p className="text-sm text-gray-600 font-sans leading-relaxed">{step.description}</p>
                          <div className="mt-2 flex items-center">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium font-sans">
                              {step.type === 'textarea' ? 'Long Text' : 
                               step.type === 'file_upload' ? 'File Upload' : 
                               step.type === 'checkbox' ? 'Checkbox' : 'Text Input'}
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
                    <p className="text-gray-500 font-sans">Building your checklist...</p>
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
    <div className="max-w-4xl mx-auto pt-8">
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
          {/* Progress Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white">
            <div className="text-center">
              <h1 className="text-3xl font-bold font-sans mb-2">Website Design Project Onboarding</h1>
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
            {/* Current Step - THE MAIN FOCUS */}
            {currentCustomerStep < websiteDesignSteps.length && (
              <div className="bg-blue-50 rounded-xl p-8 mb-8 border-2 border-blue-200">
                <div className="flex items-center mb-6">
                  <span className="text-3xl mr-4">
                    {websiteDesignSteps[currentCustomerStep].type === 'textarea' ? '📝' : 
                     websiteDesignSteps[currentCustomerStep].type === 'file_upload' ? '📎' : '☑️'}
                  </span>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 font-sans">
                      Step {currentCustomerStep + 1}: {websiteDesignSteps[currentCustomerStep].title}
                    </h3>
                    {websiteDesignSteps[currentCustomerStep].required && (
                      <span className="inline-block mt-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium font-sans">
                        Required
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-gray-700 mb-6 font-sans leading-relaxed text-lg">{websiteDesignSteps[currentCustomerStep].description}</p>
                
                {websiteDesignSteps[currentCustomerStep].type === 'textarea' && (
                  <div className="bg-white rounded-lg border-2 border-gray-200 p-4">
                    <textarea
                      value={customerStepContent[`step-${currentCustomerStep}`] || ''}
                      className="w-full px-4 py-3 border-0 focus:outline-none focus:ring-0 font-sans text-gray-800 resize-none"
                      placeholder={websiteDesignSteps[currentCustomerStep].placeholder}
                      rows={8}
                      readOnly
                    />
                    {isTypingStep && typingStepId === `step-${currentCustomerStep}` && (
                      <div className="flex items-center mt-2 text-blue-600">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
                        <span className="text-xs font-sans">Typing...</span>
                      </div>
                    )}
                  </div>
                )}
                
                {websiteDesignSteps[currentCustomerStep].type === 'file_upload' && (
                  <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <div className="text-gray-600 mb-4 font-sans text-lg">
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
                    <div className="text-sm text-gray-500 font-sans">
                      {websiteDesignSteps[currentCustomerStep].placeholder}
                    </div>
                  </div>
                )}
                
                {websiteDesignSteps[currentCustomerStep].type === 'checkbox' && (
                  <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
                    <label className="flex items-start cursor-pointer">
                      <div className={`w-8 h-8 rounded border-2 flex items-center justify-center mr-4 mt-1 transition-colors ${
                        completedSteps.includes(`step-${currentCustomerStep}`) 
                          ? 'bg-blue-500 border-blue-500 text-white' 
                          : 'border-gray-300'
                      }`}>
                        {completedSteps.includes(`step-${currentCustomerStep}`) && (
                          <Check className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <span className="text-lg font-medium text-gray-900 font-sans block mb-2">
                          I confirm and agree to proceed
                        </span>
                        {customerStepContent[`step-${currentCustomerStep}`] && (
                          <div className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 border border-gray-200">
                            {customerStepContent[`step-${currentCustomerStep}`]}
                          </div>
                        )}
                      </div>
                    </label>
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

            {/* Completed Steps Summary */}
            {completedSteps.length > 0 && (
              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                <h4 className="font-semibold text-emerald-900 mb-4 font-sans">Completed Steps ({completedSteps.length}/8)</h4>
                <div className="space-y-3">
                  {completedSteps.map((stepId, index) => (
                    <div key={stepId} className="flex items-center text-sm text-emerald-700">
                      <CheckCircle className="w-4 h-4 mr-3 flex-shrink-0" />
                      <span className="font-sans">
                        {websiteDesignSteps[index]?.title}
                      </span>
                    </div>
                  ))}
                </div>
                
                {completedSteps.length === 8 && (
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
    <div className="max-w-3xl mx-auto text-center pt-8">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/20">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-8 text-white relative overflow-hidden">
          {/* Confetti Animation */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
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
                {['🎉', '✨', '🎊', '⭐'][Math.floor(Math.random() * 4)]}
              </div>
            ))}
          </div>
          
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
              <div className="text-3xl font-bold text-emerald-600 font-sans">8/8</div>
              <div className="text-sm text-gray-600 font-sans">Steps Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 font-sans">2.3</div>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <DemoHeader />
      
      {/* Demo Controls */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors font-sans ${
                autoPlay 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {autoPlay ? 'Pause Demo' : 'Play Demo'}
            </button>
            <div className="flex space-x-1">
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
        </div>
      </div>
      
      <div className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="transition-all duration-500 ease-in-out">
            {views[currentView] === 'dashboard' && renderDashboard()}
            {views[currentView] === 'template-selection' && renderTemplateSelection()}
            {views[currentView] === 'checklist-builder' && renderChecklistBuilder()}
            {views[currentView] === 'customer-experience' && renderCustomerExperience()}
            {views[currentView] === 'completion' && renderCompletion()}
          </div>
        </div>
      </div>
    </div>
  );
}