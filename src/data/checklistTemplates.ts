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

export const checklistTemplates: ChecklistTemplate[] = [
  {
    id: 'web-development',
    name: 'Website Development Project Onboarding',
    description: 'Help us understand your vision and requirements to create the perfect website for your business.',
    category: 'Development',
    icon: '💻',
    brandColor: '#3b82f6',
    completionMessage: 'Thank you! We have everything we need to start building your amazing website. We\'ll be in touch within 24 hours with next steps.',
    steps: [
      {
        title: 'Project Overview',
        description: 'Tell us about your business and what you want to achieve with this website. What are your main goals?',
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
        description: 'Check all that apply: WordPress, Custom CMS, E-commerce, Blog, Contact Forms, Newsletter Signup',
        step_type: 'checkbox',
        isRequired: true,
      },
      {
        title: 'Domain & Hosting',
        description: 'Do you have a domain name? Where would you like to host the site?',
        step_type: 'text',
        isRequired: false,
      },
      {
        title: 'Access Credentials',
        description: 'If you have existing hosting, CMS, or domain registrar accounts, share login details here',
        step_type: 'secure_text',
        options: '72',
        isRequired: false,
      }
    ]
  },
  {
    id: 'ecommerce-development',
    name: 'E-commerce Store Development',
    description: 'Let\'s build your online store that converts visitors into customers and grows your business.',
    category: 'E-commerce',
    icon: '🛒',
    brandColor: '#f59e0b',
    completionMessage: 'Perfect! Your e-commerce journey starts now. We\'ll send you a detailed development roadmap within 24 hours.',
    steps: [
      {
        title: 'Store Overview',
        description: 'What products will you sell? Describe your business and target market.',
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
        description: 'Select preferred payment options: PayPal, Stripe, Square, Apple Pay, Crypto, Bank Transfer',
        step_type: 'checkbox',
        isRequired: true,
      },
      {
        title: 'Shipping Requirements',
        description: 'Describe your shipping zones, rates, and fulfillment process',
        step_type: 'textarea',
        isRequired: true,
      },
      {
        title: 'E-commerce Features',
        description: 'Select needed features: Inventory Management, Customer Accounts, Reviews, Wishlist, Abandoned Cart Recovery',
        step_type: 'checkbox',
        isRequired: true,
      },
      {
        title: 'Tax Configuration',
        description: 'What tax requirements do you have? (state, country, VAT, etc.)',
        step_type: 'text',
        isRequired: true,
      },
      {
        title: 'Competitor Analysis',
        description: 'Share 2-3 competitor websites for reference',
        step_type: 'url',
        isRequired: false,
      }
    ]
  },
  {
    id: 'custom-software',
    name: 'Custom Software Development Onboarding',
    description: 'Let\'s gather the technical requirements and specifications for your custom software project.',
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
        description: 'Upload any wireframes, mockups, technical specifications, or requirement documents',
        step_type: 'file_upload',
        options: '.pdf,.doc,.docx,.jpg,.png,.fig,.sketch,.xd,.zip',
        isRequired: false,
      },
      {
        title: 'Platform Requirements',
        description: 'Select target platforms: Web Application, Mobile App (iOS), Mobile App (Android), Desktop Application, API/Backend Only',
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
        title: 'Technical Stack Preferences',
        description: 'Any preferred programming languages, frameworks, or technologies?',
        step_type: 'text',
        isRequired: false,
      },
      {
        title: 'Integration Requirements',
        description: 'Does this need to connect to existing systems, APIs, or databases?',
        step_type: 'textarea',
        isRequired: false,
      },
      {
        title: 'Compliance & Security',
        description: 'Check requirements: GDPR Compliance, HIPAA Compliance, SOC 2, PCI DSS, Custom Security Requirements',
        step_type: 'checkbox',
        isRequired: false,
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
    name: 'Brand Identity Design Project',
    description: 'Help us create a brand identity that perfectly represents your business and connects with your audience.',
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
        title: 'Industry & Competitors',
        description: 'What industry are you in? Who are your main competitors?',
        step_type: 'text',
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
        description: 'How should your brand feel? Professional, Playful, Luxurious, Trustworthy, Innovative, Traditional, Bold, Minimalist',
        step_type: 'checkbox',
        isRequired: true,
      },
      {
        title: 'Visual References',
        description: 'Upload any images, colors, or design styles that inspire you or represent your vision',
        step_type: 'file_upload',
        options: '.jpg,.png,.pdf,.ai,.psd,.sketch',
        isRequired: false,
      },
      {
        title: 'Logo Requirements',
        description: 'Any specific requirements for the logo? Text to include, symbols to avoid, where it will be used?',
        step_type: 'textarea',
        isRequired: true,
      },
      {
        title: 'Deliverables Needed',
        description: 'Select what you need: Logo Design, Color Palette, Typography, Business Cards, Letterhead, Brand Guidelines, Social Media Templates',
        step_type: 'checkbox',
        isRequired: true,
      },
      {
        title: 'Timeline',
        description: 'When do you need the brand identity completed?',
        step_type: 'text',
        isRequired: true,
      }
    ]
  },
  {
    id: 'seo-content-marketing',
    name: 'SEO & Content Marketing Setup',
    description: 'Let\'s optimize your online presence and create content that attracts your ideal customers.',
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
        description: 'What are your main business objectives? What keywords do customers use to find businesses like yours?',
        step_type: 'textarea',
        isRequired: true,
      },
      {
        title: 'Geographic Focus',
        description: 'Are you targeting local, national, or international customers? Specify locations.',
        step_type: 'text',
        isRequired: true,
      },
      {
        title: 'Competitor Analysis',
        description: 'Who are your main competitors? Which ones rank well in search results?',
        step_type: 'textarea',
        isRequired: true,
      },
      {
        title: 'Content Types',
        description: 'What content should we create? Blog Posts, Service Pages, Product Descriptions, Case Studies, FAQs, Local Pages',
        step_type: 'checkbox',
        isRequired: true,
      },
      {
        title: 'Existing Content',
        description: 'Upload any existing content, keyword lists, or previous SEO reports',
        step_type: 'file_upload',
        options: '.pdf,.doc,.docx,.xlsx,.csv,.txt',
        isRequired: false,
      },
      {
        title: 'Content Budget',
        description: 'How many pieces of content per month fit your budget?',
        step_type: 'text',
        isRequired: true,
      }
    ]
  },
  {
    id: 'social-media-management',
    name: 'Social Media Management Onboarding',
    description: 'Let\'s create a social media strategy that engages your audience and grows your brand.',
    category: 'Social Media',
    icon: '📱',
    brandColor: '#8b5cf6',
    completionMessage: 'Perfect! We\'re ready to elevate your social media presence. Your content calendar and strategy will be ready within 2 business days.',
    steps: [
      {
        title: 'Social Platforms',
        description: 'Which platforms should we manage? Facebook, Instagram, LinkedIn, Twitter, TikTok, YouTube, Pinterest',
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
        title: 'Brand Assets',
        description: 'Upload logos, brand colors, fonts, and any existing social media graphics',
        step_type: 'file_upload',
        options: '.jpg,.png,.pdf,.ai,.psd,.svg,.zip',
        isRequired: true,
      },
      {
        title: 'Content Themes',
        description: 'What topics should we post about? Industry news, behind-the-scenes, products, tips, customer stories?',
        step_type: 'textarea',
        isRequired: true,
      },
      {
        title: 'Posting Frequency',
        description: 'How often should we post on each platform? (e.g., 5x/week on Instagram, 3x/week on LinkedIn)',
        step_type: 'text',
        isRequired: true,
      },
      {
        title: 'Content Types',
        description: 'Select content formats: Photos, Videos, Stories, Reels, Carousels, User-generated content, Live videos',
        step_type: 'checkbox',
        isRequired: true,
      },
      {
        title: 'Competitors & Inspiration',
        description: 'Share social accounts you admire or competitors we should be aware of',
        step_type: 'textarea',
        isRequired: false,
      }
    ]
  },
  {
    id: 'mobile-app-development',
    name: 'Mobile App Development Project',
    description: 'Let\'s bring your mobile app idea to life with a user-friendly design and robust functionality.',
    category: 'Development',
    icon: '📱',
    brandColor: '#06b6d4',
    completionMessage: 'Fantastic! We have everything needed to start developing your mobile app. Expect a detailed project timeline within 48 hours.',
    steps: [
      {
        title: 'App Concept',
        description: 'Describe your app idea. What problem does it solve? What\'s the main purpose?',
        step_type: 'textarea',
        isRequired: true,
      },
      {
        title: 'Platform Priority',
        description: 'Which platforms are most important? iOS (iPhone/iPad), Android, Cross-platform (React Native/Flutter)',
        step_type: 'checkbox',
        isRequired: true,
      },
      {
        title: 'Design References',
        description: 'Upload wireframes, mockups, or screenshots of apps with designs you like',
        step_type: 'file_upload',
        options: '.jpg,.png,.pdf,.fig,.sketch,.xd,.zip',
        isRequired: false,
      },
      {
        title: 'Core Features',
        description: 'List the essential features your app must have for launch',
        step_type: 'textarea',
        isRequired: true,
      },
      {
        title: 'User Journey',
        description: 'Describe how users will interact with your app from download to main goal completion',
        step_type: 'textarea',
        isRequired: true,
      },
      {
        title: 'Technical Requirements',
        description: 'Select needed features: User Accounts, Push Notifications, In-App Purchases, Social Login, Camera, GPS, Offline Mode',
        step_type: 'checkbox',
        isRequired: true,
      },
      {
        title: 'Monetization Strategy',
        description: 'How will the app make money? Free, paid, freemium, ads, subscriptions?',
        step_type: 'text',
        isRequired: true,
      },
      {
        title: 'Integration Needs',
        description: 'Does the app need to connect to existing systems, APIs, or third-party services?',
        step_type: 'textarea',
        isRequired: false,
      }
    ]
  },
  {
    id: 'ui-ux-design',
    name: 'UI/UX Design Project Onboarding',
    description: 'Let\'s create an exceptional user experience that delights your customers and achieves your business goals.',
    category: 'Design',
    icon: '🎯',
    brandColor: '#ef4444',
    completionMessage: 'Wonderful! We\'re excited to design an amazing user experience for your project. Initial wireframes will be ready within 5 business days.',
    steps: [
      {
        title: 'Project Overview',
        description: 'What are we designing? Website, app, software interface? What are the main business goals?',
        step_type: 'textarea',
        isRequired: true,
      },
      {
        title: 'Current Design',
        description: 'Upload screenshots of existing designs or competitor references',
        step_type: 'file_upload',
        options: '.jpg,.png,.pdf,.fig,.sketch,.xd',
        isRequired: false,
      },
      {
        title: 'User Research',
        description: 'Who are your users? What are their main goals, pain points, and preferences?',
        step_type: 'textarea',
        isRequired: true,
      },
      {
        title: 'Design Scope',
        description: 'What do you need? User Research, Wireframes, UI Design, Prototyping, Usability Testing, Design System',
        step_type: 'checkbox',
        isRequired: true,
      },
      {
        title: 'Key User Flows',
        description: 'What are the most important user journeys we need to optimize?',
        step_type: 'textarea',
        isRequired: true,
      },
      {
        title: 'Device Requirements',
        description: 'What devices/screens should we design for? Desktop, Tablet, Mobile, Smartwatch, Other',
        step_type: 'checkbox',
        isRequired: true,
      },
      {
        title: 'Brand Guidelines',
        description: 'Upload existing brand guidelines, style guides, or design system documentation',
        step_type: 'file_upload',
        options: '.pdf,.ai,.sketch,.fig,.zip',
        isRequired: false,
      },
      {
        title: 'Accessibility Needs',
        description: 'Accessibility requirements: WCAG 2.1 AA, Screen Reader Support, Color Blind Friendly, Keyboard Navigation',
        step_type: 'checkbox',
        isRequired: false,
      }
    ]
  },
  {
    id: 'digital-marketing-campaign',
    name: 'Digital Marketing Campaign Launch',
    description: 'Let\'s create and launch marketing campaigns that drive results and grow your business.',
    category: 'Marketing',
    icon: '🚀',
    brandColor: '#f97316',
    completionMessage: 'Excellent! We\'re ready to launch campaigns that will boost your business growth. Your marketing strategy will be ready within 2 business days.',
    steps: [
      {
        title: 'Campaign Goals',
        description: 'What do you want to achieve? Increase sales, generate leads, boost brand awareness, drive website traffic?',
        step_type: 'textarea',
        isRequired: true,
      },
      {
        title: 'Monthly Budget',
        description: 'What\'s your total monthly marketing budget for ads and campaigns?',
        step_type: 'text',
        isRequired: true,
      },
      {
        title: 'Marketing Channels',
        description: 'Which channels should we use? Google Ads, Facebook Ads, Instagram Ads, LinkedIn Ads, Email Marketing, Content Marketing',
        step_type: 'checkbox',
        isRequired: true,
      },
      {
        title: 'Target Audience',
        description: 'Describe your ideal customer - demographics, interests, online behavior, pain points',
        step_type: 'textarea',
        isRequired: true,
      },
      {
        title: 'Landing Pages',
        description: 'What website or landing pages should we drive traffic to?',
        step_type: 'url',
        isRequired: true,
      },
      {
        title: 'Marketing Assets',
        description: 'Upload logos, product images, brand guidelines, existing ads, or marketing materials',
        step_type: 'file_upload',
        options: '.jpg,.png,.pdf,.ai,.psd,.mp4,.zip',
        isRequired: false,
      },
      {
        title: 'Analytics Access',
        description: 'Email address for Google Analytics, Facebook Business Manager access',
        step_type: 'email',
        isRequired: true,
      },
      {
        title: 'Account Credentials',
        description: 'Login details for existing ad accounts, social media, or analytics platforms',
        step_type: 'secure_text',
        options: '72',
        isRequired: false,
      }
    ]
  },
  {
    id: 'business-consulting',
    name: 'Business Consulting Engagement',
    description: 'Let\'s understand your business challenges and goals to create a strategic roadmap for growth and success.',
    category: 'Consulting',
    icon: '💼',
    brandColor: '#1f2937',
    completionMessage: 'Thank you! We have all the information needed to begin analyzing your business situation. Expect a comprehensive strategy proposal within 5 business days.',
    steps: [
      {
        title: 'Business Overview',
        description: 'Tell us about your business - what you do, how long you\'ve been operating, and your current position in the market',
        step_type: 'textarea',
        isRequired: true,
      },
      {
        title: 'Current Challenges',
        description: 'What are the main problems or obstacles your business is facing right now?',
        step_type: 'textarea',
        isRequired: true,
      },
      {
        title: 'Business Goals',
        description: 'What do you want to achieve in the next 6-12 months? What does success look like for your business?',
        step_type: 'textarea',
        isRequired: true,
      },
      {
        title: 'Consulting Areas',
        description: 'Which areas need attention? Business Strategy, Operations, Marketing, Sales, Financial Planning, Team Management, Technology, Market Expansion',
        step_type: 'checkbox',
        isRequired: true,
      },
      {
        title: 'Annual Revenue',
        description: 'What\'s your current annual revenue range? (This helps us understand your business scale)',
        step_type: 'text',
        isRequired: true,
      },
      {
        title: 'Team Size',
        description: 'How many employees/contractors do you currently have?',
        step_type: 'text',
        isRequired: true,
      },
      {
        title: 'Business Documents',
        description: 'Upload relevant documents: business plan, financial statements, org charts, marketing materials, or previous consulting reports',
        step_type: 'file_upload',
        options: '.pdf,.doc,.docx,.xlsx,.ppt,.pptx,.zip',
        isRequired: false,
      },
      {
        title: 'Preferred Deliverables',
        description: 'What outcomes do you expect? Strategic Plan, Process Improvements, Market Analysis, Financial Projections, Implementation Roadmap, Training Materials',
        step_type: 'checkbox',
        isRequired: true,
      }
    ]
  { value: 'secure_text', label: 'Secure Text', description: 'Encrypted, auto-expiring sensitive data' }
];

export function getTemplateById(id: string): ChecklistTemplate | undefined {
  return checklistTemplates.find(template => template.id === id);
}

export function getTemplatesByCategory(): Record<string, ChecklistTemplate[]> {
  return checklistTemplates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, ChecklistTemplate[]>);
}