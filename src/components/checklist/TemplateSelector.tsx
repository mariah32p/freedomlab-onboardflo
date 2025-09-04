import React, { useState } from 'react';
import { X, Search, Star, ArrowRight, Plus, Sparkles, ChevronRight } from 'lucide-react';

export interface ChecklistTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  brandColor: string;
  completionMessage: string;
  steps: {
    title: string;
    description: string;
    step_type: 'checkbox' | 'text' | 'textarea' | 'file_upload' | 'url' | 'email' | 'secure_text';
    options?: string;
    isRequired: boolean;
  }[];
}

const templates: ChecklistTemplate[] = [
  {
    id: 'website-development',
    name: 'Website Development Project',
    description: 'Complete onboarding for website design and development clients',
    category: 'Development',
    icon: '💻',
    brandColor: '#3b82f6',
    completionMessage: 'Thank you! We have everything we need to start building your amazing website. We\'ll be in touch within 24 hours with next steps.',
    steps: [
      {
        title: 'Project Overview',
        description: 'Tell us about your business and what you want to achieve with this website',
        step_type: 'textarea',
        isRequired: true,
      },
      {
        title: 'Target Audience',
        description: 'Who is your ideal customer or website visitor?',
        step_type: 'text',
        isRequired: true,
      },
      {
        title: 'Brand Assets',
        description: 'Upload your logo, brand guidelines, or any existing marketing materials',
        step_type: 'file_upload',
        options: '.pdf,.jpg,.png,.ai,.eps,.zip',
        isRequired: false,
      },
      {
        title: 'Content Requirements',
        description: 'What pages do you need? Do you have existing content or need help creating it?',
        step_type: 'textarea',
        isRequired: true,
      },
      {
        title: 'Inspiration Websites',
        description: 'Share 2-3 websites you like the design or functionality of',
        step_type: 'url',
        isRequired: false,
      },
      {
        title: 'Technical Preferences',
        description: 'WordPress, Custom CMS, E-commerce, Blog, Contact Forms, Newsletter Signup',
        step_type: 'checkbox',
        isRequired: true,
      }
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
      {
        title: 'Store Overview',
        description: 'What products will you sell? Describe your business and target market',
        step_type: 'textarea',
        isRequired: true,
      },
      {
        title: 'Product Categories',
        description: 'List the main product categories you\'ll offer',
        step_type: 'text',
        isRequired: true,
      },
      {
        title: 'Product Information',
        description: 'Upload product catalogs, images, or inventory lists if available',
        step_type: 'file_upload',
        options: '.pdf,.xlsx,.csv,.jpg,.png,.zip',
        isRequired: false,
      },
      {
        title: 'Payment Methods',
        description: 'PayPal, Stripe, Square, Apple Pay, Crypto, Bank Transfer',
        step_type: 'checkbox',
        isRequired: true,
      },
      {
        title: 'Shipping Requirements',
        description: 'Describe your shipping zones, rates, and fulfillment process',
        step_type: 'textarea',
        isRequired: true,
      }
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
      {
        title: 'Project Scope',
        description: 'Describe the software you need built. What problem does it solve?',
        step_type: 'textarea',
        isRequired: true,
      },
      {
        title: 'Requirements Documentation',
        description: 'Upload wireframes, mockups, technical specifications, or requirement documents',
        step_type: 'file_upload',
        options: '.pdf,.doc,.docx,.jpg,.png,.fig,.sketch,.xd,.zip',
        isRequired: false,
      },
      {
        title: 'Platform Requirements',
        description: 'Web Application, Mobile App (iOS), Mobile App (Android), Desktop Application, API/Backend Only',
        step_type: 'checkbox',
        isRequired: true,
      },
      {
        title: 'User Types & Features',
        description: 'Who will use this software? What are the main features for each user type?',
        step_type: 'textarea',
        isRequired: true,
      },
      {
        title: 'System Access',
        description: 'If we need access to existing systems or APIs for integration, provide credentials here',
        step_type: 'secure_text',
        options: '48',
        isRequired: false,
      }
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
      {
        title: 'Company Story',
        description: 'Tell us about your company - what you do, your mission, and what makes you unique',
        step_type: 'textarea',
        isRequired: true,
      },
      {
        title: 'Target Audience',
        description: 'Describe your ideal customer - demographics, preferences, and what matters to them',
        step_type: 'textarea',
        isRequired: true,
      },
      {
        title: 'Brand Personality',
        description: 'Professional, Playful, Luxurious, Trustworthy, Innovative, Traditional, Bold, Minimalist',
        step_type: 'checkbox',
        isRequired: true,
      },
      {
        title: 'Visual References',
        description: 'Upload images, colors, or design styles that inspire you',
        step_type: 'file_upload',
        options: '.jpg,.png,.pdf,.ai,.psd,.sketch',
        isRequired: false,
      },
      {
        title: 'Logo Requirements',
        description: 'Any specific requirements for the logo? Text to include, symbols to avoid?',
        step_type: 'textarea',
        isRequired: true,
      }
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
      {
        title: 'Current Website',
        description: 'What\'s your current website URL?',
        step_type: 'url',
        isRequired: true,
      },
      {
        title: 'Google Analytics Access',
        description: 'Share Google Analytics login or add our email as an admin',
        step_type: 'secure_text',
        options: '168',
        isRequired: true,
      },
      {
        title: 'Business Goals',
        description: 'What are your main business objectives? What keywords do customers use to find you?',
        step_type: 'textarea',
        isRequired: true,
      },
      {
        title: 'Content Types',
        description: 'Blog Posts, Service Pages, Product Descriptions, Case Studies, FAQs, Local Pages',
        step_type: 'checkbox',
        isRequired: true,
      }
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
      {
        title: 'Social Platforms',
        description: 'Facebook, Instagram, LinkedIn, Twitter, TikTok, YouTube, Pinterest',
        step_type: 'checkbox',
        isRequired: true,
      },
      {
        title: 'Account Access',
        description: 'Share login credentials for the social accounts we\'ll be managing',
        step_type: 'secure_text',
        options: '72',
        isRequired: true,
      },
      {
        title: 'Brand Voice',
        description: 'How should your brand sound on social media? Professional, casual, humorous, inspirational?',
        step_type: 'textarea',
        isRequired: true,
      },
      {
        title: 'Content Themes',
        description: 'Industry news, behind-the-scenes, products, tips, customer stories',
        step_type: 'textarea',
        isRequired: true,
      }
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
      {
        title: 'App Concept',
        description: 'Describe your app idea. What problem does it solve?',
        step_type: 'textarea',
        isRequired: true,
      },
      {
        title: 'Platform Priority',
        description: 'iOS (iPhone/iPad), Android, Cross-platform (React Native/Flutter)',
        step_type: 'checkbox',
        isRequired: true,
      },
      {
        title: 'Core Features',
        description: 'List the essential features your app must have for launch',
        step_type: 'textarea',
        isRequired: true,
      },
      {
        title: 'Technical Requirements',
        description: 'User Accounts, Push Notifications, In-App Purchases, Social Login, Camera, GPS',
        step_type: 'checkbox',
        isRequired: true,
      }
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
      {
        title: 'Project Overview',
        description: 'What are we designing? Website, app, software interface?',
        step_type: 'textarea',
        isRequired: true,
      },
      {
        title: 'User Research',
        description: 'Who are your users? What are their main goals and pain points?',
        step_type: 'textarea',
        isRequired: true,
      },
      {
        title: 'Design Scope',
        description: 'User Research, Wireframes, UI Design, Prototyping, Usability Testing, Design System',
        step_type: 'checkbox',
        isRequired: true,
      },
      {
        title: 'Device Requirements',
        description: 'Desktop, Tablet, Mobile, Smartwatch, Other',
        step_type: 'checkbox',
        isRequired: true,
      }
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
      {
        title: 'AWS Access Credentials',
        description: 'Upload your AWS credentials file or provide access keys',
        step_type: 'file_upload',
        options: '.csv,.json,.txt,.pem',
        isRequired: true,
      },
      {
        title: 'AWS Account Details',
        description: 'AWS Account ID, preferred region, and availability zones',
        step_type: 'textarea',
        isRequired: true,
      },
      {
        title: 'Environment Variables',
        description: 'Provide production environment variables and secrets',
        step_type: 'secure_text',
        options: '72',
        isRequired: true,
      },
      {
        title: 'Database Credentials',
        description: 'Database credentials and connection strings for production',
        step_type: 'secure_text',
        options: '48',
        isRequired: true,
      }
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
      {
        title: 'Primary Platform API Keys',
        description: 'Provide API keys for your main platform (Stripe, Salesforce, HubSpot, etc.)',
        step_type: 'secure_text',
        options: '48',
        isRequired: true,
      },
      {
        title: 'Authentication Credentials',
        description: 'Upload OAuth credentials, service account files, or API certificates',
        step_type: 'file_upload',
        options: '.json,.pem,.p12,.txt,.csv',
        isRequired: true,
      },
      {
        title: 'Webhook Configuration',
        description: 'Webhook endpoints, signing secrets, and event configurations',
        step_type: 'secure_text',
        options: '72',
        isRequired: false,
      },
      {
        title: 'Integration Mapping',
        description: 'Upload field mapping files or data transformation rules',
        step_type: 'file_upload',
        options: '.json,.csv,.xlsx,.yaml,.yml',
        isRequired: false,
      }
    ]
  }
];

interface TemplateSelectorProps {
  onSelectTemplate: (template: ChecklistTemplate) => void;
  onClose: () => void;
  onCreateBlank: () => void;
}

export default function TemplateSelector({ onSelectTemplate, onClose, onCreateBlank }: TemplateSelectorProps) {
  const [currentStep, setCurrentStep] = useState<'category' | 'template' | 'preview'>('category');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<ChecklistTemplate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Get unique categories
  const categories = Array.from(new Set(templates.map(t => t.category)));
  
  // Filter templates by category and search
  const filteredTemplates = templates.filter(template => {
    const matchesCategory = !selectedCategory || template.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentStep('template');
  };

  const handleTemplateSelect = (template: ChecklistTemplate) => {
    setSelectedTemplate(template);
    setCurrentStep('preview');
  };

  const handleConfirmTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
    }
  };

  const handleBack = () => {
    if (currentStep === 'preview') {
      setCurrentStep('template');
      setSelectedTemplate(null);
    } else if (currentStep === 'template') {
      setCurrentStep('category');
      setSelectedCategory('');
    }
  };

  const renderCategorySelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2 font-sans">Choose Your Industry</h3>
        <p className="text-gray-600 font-sans">Select the category that best matches your business</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => {
          const categoryTemplates = templates.filter(t => t.category === category);
          const categoryIcon = categoryTemplates[0]?.icon || '📋';
          
          return (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className="group p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-emerald-300 hover:shadow-lg transition-all duration-200 text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{categoryIcon}</div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors font-sans">
                      {category}
                    </h4>
                    <p className="text-sm text-gray-600 font-sans">
                      {categoryTemplates.length} template{categoryTemplates.length !== 1 ? 's' : ''} available
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
              </div>
            </button>
          );
        })}
      </div>

      <div className="text-center pt-6 border-t border-gray-200">
        <button
          onClick={onCreateBlank}
          className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-sans"
        >
          <Plus className="w-4 h-4 mr-2" />
          Start from Scratch
        </button>
      </div>
    </div>
  );

  const renderTemplateSelection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 font-sans">{selectedCategory} Templates</h3>
          <p className="text-gray-600 font-sans">Choose a template to customize for your needs</p>
        </div>
        <button
          onClick={handleBack}
          className="text-gray-600 hover:text-gray-800 font-medium font-sans"
        >
          ← Back to Categories
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
          placeholder="Search templates..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-white border-2 border-gray-200 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-emerald-300"
            onClick={() => handleTemplateSelect(template)}
          >
            <div className="flex items-center mb-4">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mr-4"
                style={{ backgroundColor: `${template.brandColor}20` }}
              >
                {template.icon}
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 font-sans">{template.name}</h4>
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

            <button className="w-full mt-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors font-sans">
              Preview Template
            </button>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 font-sans">No templates found</h3>
          <p className="text-gray-600 font-sans">Try adjusting your search or browse all categories</p>
        </div>
      )}
    </div>
  );

  const renderTemplatePreview = () => {
    if (!selectedTemplate) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 font-sans">{selectedTemplate.name}</h3>
            <p className="text-gray-600 font-sans">Preview and customize this template</p>
          </div>
          <button
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-800 font-medium font-sans"
          >
            ← Back to Templates
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Template Info */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl mr-4"
                  style={{ backgroundColor: `${selectedTemplate.brandColor}20` }}
                >
                  {selectedTemplate.icon}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 font-sans">{selectedTemplate.name}</h4>
                  <span 
                    className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: selectedTemplate.brandColor }}
                  >
                    {selectedTemplate.category}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6 font-sans">{selectedTemplate.description}</p>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-2 font-sans">Completion Message</h5>
                <p className="text-sm text-gray-600 font-sans">{selectedTemplate.completionMessage}</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleConfirmTemplate}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center font-sans"
              >
                Use This Template
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>

          {/* Steps Preview */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h5 className="font-semibold text-gray-900 mb-4 font-sans">
              Template Steps ({selectedTemplate.steps.length})
            </h5>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {selectedTemplate.steps.map((step, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <span className="text-sm text-gray-500 mr-3 mt-1 font-sans">{index + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h6 className="font-medium text-gray-900 font-sans">{step.title}</h6>
                        {step.isRequired && (
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
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 font-sans">
              {currentStep === 'category' ? 'Choose Template Category' :
               currentStep === 'template' ? `${selectedCategory} Templates` :
               'Template Preview'}
            </h2>
            <p className="text-sm text-gray-600 mt-1 font-sans">
              {currentStep === 'category' ? `${templates.length} professional templates available` :
               currentStep === 'template' ? `${filteredTemplates.length} templates in ${selectedCategory}` :
               'Review template details before creating your checklist'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {currentStep === 'category' && renderCategorySelection()}
          {currentStep === 'template' && renderTemplateSelection()}
          {currentStep === 'preview' && renderTemplatePreview()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600 font-sans">
            Step {currentStep === 'category' ? '1' : currentStep === 'template' ? '2' : '3'} of 3
          </div>
          <div className="flex items-center space-x-3">
            {currentStep !== 'category' && (
              <button
                onClick={handleBack}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors font-sans"
              >
                Back
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors font-sans"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}