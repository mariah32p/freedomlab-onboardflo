import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Eye, Users, BarChart3, CheckCircle, Plus, Sparkles, Lock, Globe, Star, Play } from 'lucide-react';
import { CreateChecklistData } from '../../types/checklist';

interface ChecklistWizardProps {
  onSave: (data: CreateChecklistData & { steps: StepData[] }) => Promise<void>;
  onClose: () => void;
}

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
  },
  {
    id: 'mobile-app-development',
    name: 'Mobile App Development',
    description: 'Bring mobile app ideas to life with user-friendly design and functionality',
    category: 'Development',
    icon: '📱',
    brandColor: '#06b6d4',
    completionMessage: 'Fantastic! We have everything needed to start developing your mobile app. Expect a detailed project timeline within 48 hours.',
    steps: [
      { title: 'App Concept', description: 'Describe your app idea. What problem does it solve?', step_type: 'textarea', is_required: true },
      { title: 'Platform Priority', description: 'iOS (iPhone/iPad), Android, Cross-platform (React Native/Flutter)', step_type: 'checkbox', is_required: true },
      { title: 'Core Features', description: 'List the essential features your app must have for launch', step_type: 'textarea', is_required: true },
      { title: 'Technical Requirements', description: 'User Accounts, Push Notifications, In-App Purchases, Social Login, Camera, GPS', step_type: 'checkbox', is_required: true }
    ]
  },
  {
    id: 'ui-ux-design',
    name: 'UI/UX Design Project',
    description: 'Create exceptional user experiences that delight customers',
    category: 'Design',
    icon: '🎯',
    brandColor: '#ef4444',
    completionMessage: 'Wonderful! We\'re excited to design an amazing user experience for your project. Initial wireframes will be ready within 5 business days.',
    steps: [
      { title: 'Project Overview', description: 'What are we designing? Website, app, software interface?', step_type: 'textarea', is_required: true },
      { title: 'User Research', description: 'Who are your users? What are their main goals and pain points?', step_type: 'textarea', is_required: true },
      { title: 'Design Scope', description: 'User Research, Wireframes, UI Design, Prototyping, Usability Testing, Design System', step_type: 'checkbox', is_required: true },
      { title: 'Device Requirements', description: 'Desktop, Tablet, Mobile, Smartwatch, Other', step_type: 'checkbox', is_required: true }
    ]
  },
  {
    id: 'aws-deployment',
    name: 'AWS Deployment Setup',
    description: 'Secure collection of AWS credentials and deployment configuration',
    category: 'DevOps',
    icon: '☁️',
    brandColor: '#ff9900',
    completionMessage: 'Perfect! We have all your AWS credentials and configuration. Your deployment pipeline will be set up within 24 hours.',
    steps: [
      { title: 'AWS Access Credentials', description: 'Upload your AWS credentials file or provide access keys', step_type: 'file_upload', options: '.csv,.json,.txt,.pem', is_required: true },
      { title: 'AWS Account Details', description: 'AWS Account ID, preferred region, and availability zones', step_type: 'textarea', is_required: true },
      { title: 'Environment Variables', description: 'Provide production environment variables and secrets', step_type: 'secure_text', options: '72', is_required: true },
      { title: 'Database Credentials', description: 'Database credentials and connection strings for production', step_type: 'secure_text', options: '48', is_required: true }
    ]
  },
  {
    id: 'saas-integration',
    name: 'SaaS Platform Integration',
    description: 'Collect API keys and credentials for third-party integrations',
    category: 'Integration',
    icon: '🔗',
    brandColor: '#6366f1',
    completionMessage: 'Excellent! We have all the API credentials needed to set up your integrations. Your connected workflow will be live within 48 hours.',
    steps: [
      { title: 'Primary Platform API Keys', description: 'Provide API keys for your main platform (Stripe, Salesforce, HubSpot, etc.)', step_type: 'secure_text', options: '48', is_required: true },
      { title: 'Authentication Credentials', description: 'Upload OAuth credentials, service account files, or API certificates', step_type: 'file_upload', options: '.json,.pem,.p12,.txt,.csv', is_required: true },
      { title: 'Webhook Configuration', description: 'Webhook endpoints, signing secrets, and event configurations', step_type: 'secure_text', options: '72', is_required: false },
      { title: 'Integration Mapping', description: 'Upload field mapping files or data transformation rules', step_type: 'file_upload', options: '.json,.csv,.xlsx,.yaml,.yml', is_required: false }
    ]
  }
];

export default function ChecklistWizard({ onSave, onClose }: ChecklistWizardProps) {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'choose' | 'preview' | 'customize' | 'launch'>('welcome');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<CreateChecklistData>({
    title: '',
    description: '',
    is_public: true,
    password: '',
    completion_page_content: 'Congratulations! You have successfully completed the onboarding process.',
  });

  const [steps, setSteps] = useState<StepData[]>([]);

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
    setCurrentStep('preview');
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

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave({ ...formData, steps });
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const renderWelcome = () => (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 font-sans">Create Your First Checklist</h2>
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

        {/* Quick Category Filters */}
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => {
            const categoryTemplates = templates.filter(t => t.category === category);
            const categoryIcon = categoryTemplates[0]?.icon || '📋';
            
            return (
              <button
                key={category}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors font-sans"
              >
                <span>{categoryIcon}</span>
                <span className="text-sm font-medium text-gray-700">{category}</span>
                <span className="text-xs text-gray-500">({categoryTemplates.length})</span>
              </button>
            );
          })}
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
              onClick={() => handleTemplateSelect(template)}
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
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-xs text-gray-500 ml-1 font-sans">(4.9)</span>
                </div>
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

  const renderPreview = () => {
    if (!selectedTemplate) return null;

    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 font-sans">Preview: {selectedTemplate.name}</h2>
          <p className="text-lg text-gray-600 font-sans">
            Here's what your customers will see when they click your link
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Customer View Preview */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 font-sans">Customer Experience</h3>
            
            {/* Mock Customer Interface */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg">
              <div 
                className="h-2"
                style={{ backgroundColor: selectedTemplate.brandColor }}
              ></div>
              
              <div 
                className="px-6 py-8 text-center"
                style={{ backgroundColor: `${selectedTemplate.brandColor}10` }}
              >
                <h1 className="text-2xl font-bold text-gray-900 mb-2 font-sans">{selectedTemplate.name}</h1>
                <p className="text-gray-600 font-sans">{selectedTemplate.description}</p>
                
                <div className="mt-6 max-w-md mx-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 font-sans">Progress</span>
                    <span className="text-sm font-medium text-gray-700 font-sans">2/{selectedTemplate.steps.length} completed</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full transition-all duration-300"
                      style={{ 
                        backgroundColor: selectedTemplate.brandColor,
                        width: `${(2 / selectedTemplate.steps.length) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {selectedTemplate.steps.slice(0, 3).map((step, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${index === 1 ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="flex items-start space-x-3">
                      <div 
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center mt-0.5 ${
                          index < 2 ? 'text-white' : 'border-gray-300'
                        }`}
                        style={{ 
                          borderColor: index < 2 ? selectedTemplate.brandColor : undefined,
                          backgroundColor: index < 2 ? selectedTemplate.brandColor : undefined 
                        }}
                      >
                        {index < 2 && (
                          <CheckCircle className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 font-sans">{step.title}</h4>
                        <p className="text-sm text-gray-600 mt-1 font-sans">{step.description}</p>
                        {step.is_required && (
                          <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium font-sans">
                            Required
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {selectedTemplate.steps.length > 3 && (
                  <div className="text-center py-4 text-gray-500 font-sans">
                    ... and {selectedTemplate.steps.length - 3} more steps
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 font-sans">What You're Building</h3>
            
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2 font-sans">📝 Step Types Explained</h4>
                <ul className="text-sm text-blue-800 space-y-1 font-sans">
                  <li>• <strong>Text boxes</strong> collect information from customers</li>
                  <li>• <strong>File uploads</strong> gather documents and assets</li>
                  <li>• <strong>Checkboxes</strong> confirm completion of tasks</li>
                  <li>• <strong>Secure text</strong> safely collects sensitive data</li>
                </ul>
              </div>

              <div className="bg-emerald-50 rounded-lg p-4">
                <h4 className="font-semibold text-emerald-900 mb-2 font-sans">🎯 The End Result</h4>
                <p className="text-sm text-emerald-800 font-sans">
                  When customers complete the checklist, you'll have all their information organized in your dashboard. No more scattered emails or lost requirements!
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-2 font-sans">🔗 How Customers Access It</h4>
                <p className="text-sm text-purple-800 font-sans">
                  You create a unique session link for each customer or project. They click the link and can start immediately - no account creation needed. You can optionally add password protection.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setCurrentStep('customize')}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center font-sans"
              >
                Customize This Template
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button
                onClick={() => setCurrentStep('choose')}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium transition-colors font-sans"
              >
                Choose Different Template
              </button>
            </div>
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
          Make it yours - add your branding and adjust the details
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
                  Checklist Title
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

        {/* Steps Preview */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 font-sans">
            Your Steps ({steps.length})
          </h3>
          
          <div className="bg-gray-50 rounded-xl p-6 max-h-96 overflow-y-auto">
            {steps.length > 0 ? (
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <span className="text-sm text-gray-500 mr-3 mt-1 font-sans">{index + 1}</span>
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h4 className="font-medium text-gray-900 font-sans">{step.title}</h4>
                          {step.is_required && (
                            <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium font-sans">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2 font-sans">{step.description}</p>
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium font-sans">
                          {step.step_type === 'textarea' ? 'Long Text' : 
                           step.step_type === 'file_upload' ? 'File Upload' : 
                           step.step_type === 'secure_text' ? 'Secure Text' :
                           step.step_type === 'url' ? 'Website URL' :
                           step.step_type === 'email' ? 'Email' :
                           step.step_type === 'text' ? 'Text Input' : 'Checkbox'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 font-sans">No steps added yet</p>
              </div>
            )}
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2 font-sans">💡 Pro Tip</h4>
            <p className="text-sm text-blue-800 font-sans">
              You can add, remove, or modify steps after creating the checklist. Start with this template and customize it as you learn what works best for your customers.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={() => setCurrentStep('choose')}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors font-sans"
        >
          <ArrowLeft className="w-4 h-4 mr-2 inline" />
          Back to Templates
        </button>
        <button
          onClick={() => setCurrentStep('launch')}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center font-sans"
        >
          Looks Good, Create It!
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
          disabled={loading || !formData.title.trim()}
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
            onClick={() => setCurrentStep(selectedTemplate ? 'preview' : 'choose')}
            className="text-gray-600 hover:text-gray-800 font-medium font-sans"
          >
            ← Back to {selectedTemplate ? 'Preview' : 'Templates'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
        {/* Header with Progress */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold font-sans">
                {currentStep === 'welcome' ? 'Welcome to OnboardFlo' :
                 currentStep === 'choose' ? 'Choose Your Template' :
                 currentStep === 'preview' ? 'Preview Template' :
                 currentStep === 'customize' ? 'Customize Checklist' :
                 'Launch Checklist'}
              </h1>
              <p className="text-blue-100 font-sans">
                {currentStep === 'welcome' ? 'Let\'s create your first customer onboarding checklist' :
                 currentStep === 'choose' ? '10 professional templates available' :
                 currentStep === 'preview' ? 'See what your customers will experience' :
                 currentStep === 'customize' ? 'Make it perfect for your business' :
                 'Ready to start tracking customer progress'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-100 font-sans">Progress</span>
              <span className="text-sm font-medium text-blue-100 font-sans">
                Step {currentStep === 'welcome' ? '1' : currentStep === 'choose' ? '2' : currentStep === 'preview' ? '3' : currentStep === 'customize' ? '4' : '5'} of 5
              </span>
            </div>
            <div className="w-full bg-blue-400/30 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${
                    currentStep === 'welcome' ? '20%' :
                    currentStep === 'choose' ? '40%' :
                    currentStep === 'preview' ? '60%' :
                    currentStep === 'customize' ? '80%' :
                    '100%'
                  }` 
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[calc(95vh-200px)] overflow-y-auto">
          {currentStep === 'welcome' && renderWelcome()}
          {currentStep === 'choose' && renderChoose()}
          {currentStep === 'preview' && renderPreview()}
          {currentStep === 'customize' && renderCustomize()}
          {currentStep === 'launch' && renderLaunch()}
        </div>
      </div>
    </div>
  );
}