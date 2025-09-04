import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { useChecklists } from '../hooks/useChecklists';
import PaymentBanner from '../components/PaymentBanner';
import TrialBanner from '../components/TrialBanner';
import { CreateChecklistData } from '../types/checklist';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Plus, 
  Sparkles, 
  Lock, 
  Globe, 
  Users, 
  BarChart3,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  X
} from 'lucide-react';

interface StepData {
  title: string;
  description: string;
  step_type: 'checkbox' | 'text' | 'textarea' | 'file_upload' | 'url' | 'email' | 'secure_text';
  options?: string;
  is_required: boolean;
  order_index: number;
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  brandColor: string;
  completionMessage: string;
  steps: Omit<StepData, 'order_index'>[];
}

const templates: Template[] = [
  {
    id: 'website-development',
    name: 'Website Development Project',
    description: 'Complete onboarding for website design and development clients',
    category: 'Development',
    icon: '💻',
    brandColor: '#3b82f6',
    completionMessage: 'Thank you! We have everything we need to start building your amazing website. We\'ll be in touch within 24 hours with next steps.',
    steps: [
      { title: 'Project Overview', description: 'Tell us about your business and what you want to achieve with this website', step_type: 'textarea', is_required: true },
      { title: 'Target Audience', description: 'Who is your ideal customer or website visitor?', step_type: 'text', is_required: true },
      { title: 'Brand Assets', description: 'Upload your logo, brand guidelines, or any existing marketing materials', step_type: 'file_upload', options: '.pdf,.jpg,.png,.ai,.eps,.zip', is_required: false },
      { title: 'Content Requirements', description: 'What pages do you need? Do you have existing content or need help creating it?', step_type: 'textarea', is_required: true },
      { title: 'Inspiration Websites', description: 'Share 2-3 websites you like the design or functionality of', step_type: 'url', is_required: false },
      { title: 'Technical Preferences', description: 'WordPress, Custom CMS, E-commerce, Blog, Contact Forms, Newsletter Signup', step_type: 'checkbox', is_required: true }
    ]
  },
  {
    id: 'ecommerce-development',
    name: 'E-commerce Store Development',
    description: 'Build online stores that convert visitors into customers',
    category: 'E-commerce',
    icon: '🛒',
    brandColor: '#f59e0b',
    completionMessage: 'Perfect! Your e-commerce journey starts now. We\'ll send you a detailed development roadmap within 24 hours.',
    steps: [
      { title: 'Store Overview', description: 'What products will you sell? Describe your business and target market', step_type: 'textarea', is_required: true },
      { title: 'Product Categories', description: 'List the main product categories you\'ll offer', step_type: 'text', is_required: true },
      { title: 'Product Information', description: 'Upload product catalogs, images, or inventory lists if available', step_type: 'file_upload', options: '.pdf,.xlsx,.csv,.jpg,.png,.zip', is_required: false },
      { title: 'Payment Methods', description: 'PayPal, Stripe, Square, Apple Pay, Crypto, Bank Transfer', step_type: 'checkbox', is_required: true },
      { title: 'Shipping Requirements', description: 'Describe your shipping zones, rates, and fulfillment process', step_type: 'textarea', is_required: true }
    ]
  },
  {
    id: 'custom-software',
    name: 'Custom Software Development',
    description: 'Gather technical requirements for custom software projects',
    category: 'Development',
    icon: '⚙️',
    brandColor: '#6366f1',
    completionMessage: 'Excellent! We have all the details needed to create your custom solution. Our development team will review and send you a detailed project plan within 48 hours.',
    steps: [
      { title: 'Project Scope', description: 'Describe the software you need built. What problem does it solve?', step_type: 'textarea', is_required: true },
      { title: 'Requirements Documentation', description: 'Upload wireframes, mockups, technical specifications, or requirement documents', step_type: 'file_upload', options: '.pdf,.doc,.docx,.jpg,.png,.fig,.sketch,.xd,.zip', is_required: false },
      { title: 'Platform Requirements', description: 'Web Application, Mobile App (iOS), Mobile App (Android), Desktop Application, API/Backend Only', step_type: 'checkbox', is_required: true },
      { title: 'User Types & Features', description: 'Who will use this software? What are the main features for each user type?', step_type: 'textarea', is_required: true },
      { title: 'System Access', description: 'If we need access to existing systems or APIs for integration, provide credentials here', step_type: 'secure_text', options: '48', is_required: false }
    ]
  },
  {
    id: 'brand-identity',
    name: 'Brand Identity Design',
    description: 'Create brand identities that represent your business perfectly',
    category: 'Design',
    icon: '🎨',
    brandColor: '#ec4899',
    completionMessage: 'Amazing! We\'re excited to bring your brand vision to life. Expect initial concepts within 3-5 business days.',
    steps: [
      { title: 'Company Story', description: 'Tell us about your company - what you do, your mission, and what makes you unique', step_type: 'textarea', is_required: true },
      { title: 'Target Audience', description: 'Describe your ideal customer - demographics, preferences, and what matters to them', step_type: 'textarea', is_required: true },
      { title: 'Brand Personality', description: 'Professional, Playful, Luxurious, Trustworthy, Innovative, Traditional, Bold, Minimalist', step_type: 'checkbox', is_required: true },
      { title: 'Visual References', description: 'Upload images, colors, or design styles that inspire you', step_type: 'file_upload', options: '.jpg,.png,.pdf,.ai,.psd,.sketch', is_required: false },
      { title: 'Logo Requirements', description: 'Any specific requirements for the logo? Text to include, symbols to avoid?', step_type: 'textarea', is_required: true }
    ]
  },
  {
    id: 'seo-content-marketing',
    name: 'SEO & Content Marketing',
    description: 'Optimize online presence and create content that attracts customers',
    category: 'Marketing',
    icon: '📈',
    brandColor: '#10b981',
    completionMessage: 'Great! We\'re ready to boost your search rankings and online visibility. Your SEO strategy will be ready within 3 business days.',
    steps: [
      { title: 'Current Website', description: 'What\'s your current website URL?', step_type: 'url', is_required: true },
      { title: 'Google Analytics Access', description: 'Share Google Analytics login or add our email as an admin', step_type: 'secure_text', options: '168', is_required: true },
      { title: 'Business Goals', description: 'What are your main business objectives? What keywords do customers use to find you?', step_type: 'textarea', is_required: true },
      { title: 'Content Types', description: 'Blog Posts, Service Pages, Product Descriptions, Case Studies, FAQs, Local Pages', step_type: 'checkbox', is_required: true }
    ]
  },
  {
    id: 'social-media-management',
    name: 'Social Media Management',
    description: 'Create social media strategies that engage audiences and grow brands',
    category: 'Social Media',
    icon: '📱',
    brandColor: '#8b5cf6',
    completionMessage: 'Perfect! We\'re ready to elevate your social media presence. Your content calendar and strategy will be ready within 2 business days.',
    steps: [
      { title: 'Social Platforms', description: 'Facebook, Instagram, LinkedIn, Twitter, TikTok, YouTube, Pinterest', step_type: 'checkbox', is_required: true },
      { title: 'Account Access', description: 'Share login credentials for the social accounts we\'ll be managing', step_type: 'secure_text', options: '72', is_required: true },
      { title: 'Brand Voice', description: 'How should your brand sound on social media? Professional, casual, humorous, inspirational?', step_type: 'textarea', is_required: true },
      { title: 'Content Themes', description: 'Industry news, behind-the-scenes, products, tips, customer stories', step_type: 'textarea', is_required: true }
    ]
  }
];

const STEP_TYPE_OPTIONS = [
  { value: 'checkbox', label: 'Checkbox', description: 'Simple yes/no confirmation' },
  { value: 'text', label: 'Text Input', description: 'Short text response' },
  { value: 'textarea', label: 'Long Text', description: 'Detailed description' },
  { value: 'file_upload', label: 'File Upload', description: 'Document collection' },
  { value: 'url', label: 'Website URL', description: 'Link collection' },
  { value: 'email', label: 'Email Address', description: 'Email validation' },
  { value: 'secure_text', label: 'Secure Text', description: 'Sensitive information' }
];

export default function CreateChecklistPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { subscription, getAccessStatus } = useSubscription();
  const { createChecklist } = useChecklists();
  
  const [currentStep, setCurrentStep] = useState<'welcome' | 'choose' | 'customize' | 'launch'>('welcome');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<CreateChecklistData>({
    title: '',
    description: '',
    is_public: true,
    password: '',
    completion_page_content: 'Congratulations! You have successfully completed the onboarding process.',
  });

  const [steps, setSteps] = useState<StepData[]>([]);

  // Load from URL params if available
  useEffect(() => {
    const templateId = searchParams.get('template');
    if (templateId) {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        handleTemplateSelect(template);
        setCurrentStep('customize');
      }
    }
  }, [searchParams]);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setFormData({
      title: template.name,
      description: template.description,
      is_public: true,
      password: '',
      completion_page_content: template.completionMessage,
    });
    
    const templateSteps: StepData[] = template.steps.map((step, index) => ({
      ...step,
      order_index: index,
    }));
    
    setSteps(templateSteps);
  };

  const handleStartFromScratch = () => {
    setSelectedTemplate(null);
    setFormData({
      title: '',
      description: '',
      is_public: true,
      password: '',
      completion_page_content: 'Congratulations! You have successfully completed the onboarding process.',
    });
    setSteps([]);
    setCurrentStep('customize');
  };

  const handleAddStep = () => {
    const newStep: StepData = {
      title: '',
      description: '',
      step_type: 'text',
      is_required: true,
      order_index: steps.length,
    };
    setSteps(prev => [...prev, newStep]);
    setEditingStepIndex(steps.length);
  };

  const handleUpdateStep = (index: number, updates: Partial<StepData>) => {
    setSteps(prev => prev.map((step, i) => 
      i === index ? { ...step, ...updates } : step
    ));
  };

  const handleDeleteStep = (index: number) => {
    setSteps(prev => prev.filter((_, i) => i !== index).map((step, i) => ({ ...step, order_index: i })));
    setEditingStepIndex(null);
  };

  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= steps.length) return;

    const newSteps = [...steps];
    [newSteps[index], newSteps[newIndex]] = [newSteps[newIndex], newSteps[index]];
    
    // Update order indices
    newSteps.forEach((step, i) => {
      step.order_index = i;
    });
    
    setSteps(newSteps);
    
    // Update editing index if needed
    if (editingStepIndex === index) {
      setEditingStepIndex(newIndex);
    } else if (editingStepIndex === newIndex) {
      setEditingStepIndex(index);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a checklist title');
      return;
    }

    setLoading(true);
    try {
      const success = await createChecklist({ ...formData, steps });
      if (success) {
        navigate('/checklists');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderWelcome = () => (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 font-sans">Create Checklist</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto font-sans">
          You're about to create a customer onboarding checklist - a step-by-step guide that your customers will complete to get started with your service.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="bg-blue-50 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2 font-sans">How it works</h3>
          <p className="text-sm text-gray-600 font-sans">
            You build it once, then create unique sessions for each customer or project. They can collaborate and you track progress in real-time.
          </p>
        </div>

        <div className="bg-emerald-50 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2 font-sans">What you get</h3>
          <p className="text-sm text-gray-600 font-sans">
            Real-time progress tracking, organized customer data, and automated notifications. No more lost customers or forgotten follow-ups.
          </p>
        </div>

        <div className="bg-purple-50 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Globe className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2 font-sans">Customer experience</h3>
          <p className="text-sm text-gray-600 font-sans">
            They click a link (no signup required), can optionally be password protected, and complete steps at their own pace.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => setCurrentStep('choose')}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center mx-auto font-sans"
        >
          Get Started
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
        <p className="text-sm text-gray-500 font-sans">Takes about 5 minutes to set up</p>
      </div>
    </div>
  );

  const renderChoose = () => {
    const categories = Array.from(new Set(templates.map(t => t.category)));
    
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 font-sans">Choose Your Starting Point</h2>
          <p className="text-lg text-gray-600 font-sans">
            Start with a proven template or build from scratch
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Start from Scratch */}
          <div 
            onClick={handleStartFromScratch}
            className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-emerald-400 hover:bg-emerald-50 transition-all cursor-pointer group"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 group-hover:bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4 transition-colors">
                <Plus className="w-6 h-6 text-gray-400 group-hover:text-emerald-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 font-sans">Start from Scratch</h3>
              <p className="text-gray-600 text-sm font-sans">Create a custom checklist tailored to your exact needs</p>
            </div>
          </div>

          {/* Templates */}
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => {
                handleTemplateSelect(template);
                setCurrentStep('customize');
              }}
              className="bg-white border-2 border-gray-200 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-emerald-300 hover:-translate-y-1"
            >
              <div className="flex items-center mb-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mr-4"
                  style={{ backgroundColor: `${template.brandColor}20` }}
                >
                  {template.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 font-sans">{template.name}</h3>
                  <span 
                    className="inline-block px-2 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: template.brandColor }}
                  >
                    {template.category}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 font-sans">{template.description}</p>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 font-sans">{template.steps.length} steps</div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500 font-sans">
            All templates can be fully customized after selection
          </p>
        </div>
      </div>
    );
  };

  const renderStepEditor = (step: StepData, index: number) => {
    const isEditing = editingStepIndex === index;
    
    if (!isEditing) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start flex-1">
              <span className="text-lg mr-3 mt-1">
                {step.step_type === 'textarea' ? '📝' : 
                 step.step_type === 'file_upload' ? '📎' : 
                 step.step_type === 'secure_text' ? '🔒' :
                 step.step_type === 'url' ? '🔗' :
                 step.step_type === 'email' ? '📧' :
                 step.step_type === 'text' ? '✏️' : '☑️'}
              </span>
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h4 className="font-semibold text-gray-900 font-sans">{step.title || 'Untitled Step'}</h4>
                  {step.is_required && (
                    <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium font-sans">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 font-sans">{step.description || 'No description'}</p>
                <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium font-sans">
                  {STEP_TYPE_OPTIONS.find(opt => opt.value === step.step_type)?.label || step.step_type}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-1 ml-4">
              <button
                onClick={() => handleMoveStep(index, 'up')}
                disabled={index === 0}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleMoveStep(index, 'down')}
                disabled={index === steps.length - 1}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => setEditingStepIndex(index)}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteStep(index)}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Step Title</label>
              <input
                type="text"
                value={step.title}
                onChange={(e) => handleUpdateStep(index, { title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                placeholder="Enter step title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Step Type</label>
              <select
                value={step.step_type}
                onChange={(e) => handleUpdateStep(index, { step_type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
              >
                {STEP_TYPE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Description</label>
            <textarea
              value={step.description}
              onChange={(e) => handleUpdateStep(index, { description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
              placeholder="Describe what the customer should do"
              rows={2}
            />
          </div>

          {step.step_type === 'file_upload' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Accepted File Types</label>
              <input
                type="text"
                value={step.options || ''}
                onChange={(e) => handleUpdateStep(index, { options: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                placeholder=".pdf,.jpg,.png,.doc"
              />
              <p className="text-xs text-gray-500 mt-1 font-sans">Comma-separated file extensions</p>
            </div>
          )}

          {step.step_type === 'secure_text' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Expiry Hours</label>
              <input
                type="number"
                value={step.options || '24'}
                onChange={(e) => handleUpdateStep(index, { options: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                placeholder="24"
                min="1"
                max="168"
              />
              <p className="text-xs text-gray-500 mt-1 font-sans">Hours before secure data expires (1-168)</p>
            </div>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={step.is_required}
              onChange={(e) => handleUpdateStep(index, { is_required: e.target.checked })}
              className="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <label className="text-sm font-medium text-gray-700 font-sans">Required step</label>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-blue-200">
            <button
              onClick={() => setEditingStepIndex(null)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors font-sans"
            >
              Cancel
            </button>
            <button
              onClick={() => setEditingStepIndex(null)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center font-sans"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Step
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderCustomize = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 font-sans">Customize Your Checklist</h2>
        <p className="text-lg text-gray-600 font-sans">
          Configure your checklist settings and customize the steps
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Settings */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 font-sans">Basic Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                  Checklist Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                  placeholder="e.g., Website Design Project Onboarding"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                  placeholder="Brief description of this onboarding flow"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 font-sans">
                  Access Control
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="visibility"
                      checked={formData.is_public}
                      onChange={() => setFormData(prev => ({ ...prev, is_public: true, password: '' }))}
                      className="mr-3 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 text-emerald-500 mr-2" />
                      <span className="font-sans">Public - Anyone with the link can access</span>
                    </div>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="visibility"
                      checked={!formData.is_public}
                      onChange={() => setFormData(prev => ({ ...prev, is_public: false }))}
                      className="mr-3 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="flex items-center">
                      <Lock className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="font-sans">Password Protected</span>
                    </div>
                  </label>
                </div>
              </div>

              {!formData.is_public && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                    placeholder="Enter password for this checklist"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 font-sans">Completion Message</h3>
            <textarea
              value={formData.completion_page_content}
              onChange={(e) => setFormData(prev => ({ ...prev, completion_page_content: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
              placeholder="Message shown when customers complete the checklist"
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1 font-sans">
              This message will be displayed to customers when they complete all steps
            </p>
          </div>
        </div>

        {/* Steps Editor */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 font-sans">
              Steps ({steps.length})
            </h3>
            <button
              onClick={handleAddStep}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium flex items-center font-sans"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Step
            </button>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {steps.map((step, index) => (
              <div key={index}>
                {renderStepEditor(step, index)}
              </div>
            ))}
            
            {steps.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 font-sans">No steps added yet</p>
                <button
                  onClick={handleAddStep}
                  className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium font-sans"
                >
                  Add First Step
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentStep('choose')}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center font-sans"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Templates
        </button>
        <button
          onClick={() => setCurrentStep('launch')}
          disabled={!formData.title.trim() || steps.length === 0}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center disabled:opacity-50 font-sans"
        >
          Review & Create
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );

  const renderLaunch = () => (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 font-sans">Ready to Launch!</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto font-sans">
          Your checklist is configured and ready. Here's what happens next:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">1️⃣</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2 font-sans">Create Your Checklist</h3>
          <p className="text-sm text-gray-600 font-sans">
            We'll save your checklist and make it available in your dashboard
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">2️⃣</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2 font-sans">Generate Customer Sessions</h3>
          <p className="text-sm text-gray-600 font-sans">
            Create trackable links for each customer or project from your checklist page
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">3️⃣</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2 font-sans">Track Progress</h3>
          <p className="text-sm text-gray-600 font-sans">
            Monitor customer progress in real-time and see all submissions in your dashboard
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-6 max-w-2xl mx-auto">
        <h3 className="font-semibold text-gray-900 mb-3 font-sans">📋 Your Checklist Summary</h3>
        <div className="text-left space-y-2 text-sm text-gray-700">
          <div className="flex justify-between">
            <span className="font-sans">Title:</span>
            <span className="font-medium font-sans">{formData.title || 'Untitled Checklist'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-sans">Steps:</span>
            <span className="font-medium font-sans">{steps.length} steps</span>
          </div>
          <div className="flex justify-between">
            <span className="font-sans">Access:</span>
            <span className="font-medium font-sans">{formData.is_public ? 'Public' : 'Password Protected'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-sans">Required steps:</span>
            <span className="font-medium font-sans">{steps.filter(s => s.is_required).length} required</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={handleSave}
          disabled={loading || !formData.title.trim() || steps.length === 0}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center mx-auto disabled:opacity-50 font-sans"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Creating Checklist...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Create My Checklist
            </>
          )}
        </button>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setCurrentStep('customize')}
            className="text-gray-600 hover:text-gray-800 font-medium font-sans"
          >
            ← Back to Customize
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trial Banner */}
        <TrialBanner />
        
        {/* Payment Issue Banner */}
        <PaymentBanner />

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-sans">
              {currentStep === 'welcome' ? 'Create Checklist' :
               currentStep === 'choose' ? 'Choose Template' :
               currentStep === 'customize' ? 'Customize Checklist' :
               'Review & Launch'}
            </h1>
            <p className="text-gray-600 font-sans">
              {currentStep === 'welcome' ? 'Build a step-by-step onboarding experience' :
               currentStep === 'choose' ? 'Start with a template or build from scratch' :
               currentStep === 'customize' ? 'Configure your checklist settings and steps' :
               'Review your checklist before creating'}
            </p>
          </div>
          <button
            onClick={() => navigate('/checklists')}
            className="text-gray-600 hover:text-gray-800 font-medium font-sans"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 font-sans">Progress</span>
            <span className="text-sm font-medium text-gray-700 font-sans">
              Step {currentStep === 'welcome' ? '1' : currentStep === 'choose' ? '2' : currentStep === 'customize' ? '3' : '4'} of 4
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${
                  currentStep === 'welcome' ? '25%' :
                  currentStep === 'choose' ? '50%' :
                  currentStep === 'customize' ? '75%' :
                  '100%'
                }` 
              }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {currentStep === 'welcome' && renderWelcome()}
          {currentStep === 'choose' && renderChoose()}
          {currentStep === 'customize' && renderCustomize()}
          {currentStep === 'launch' && renderLaunch()}
        </div>
      </div>
    </div>
  );
}