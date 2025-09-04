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
    step_type: 'checkbox' | 'text' | 'textarea' | 'file_upload' | 'url' | 'email';
    options?: string;
    isRequired: boolean;
  }[];
}

export const checklistTemplates: ChecklistTemplate[] = [
  {
    id: 'web-developer',
    name: 'Web Development Project',
    description: 'Complete onboarding checklist for new web development clients',
    category: 'Development',
    icon: '💻',
    brandColor: '#3b82f6',
    completionMessage: 'Welcome aboard! Your web development project is now set up and ready to begin. Our team will be in touch within 24 hours to discuss next steps.',
    steps: [
      {
        title: 'Project Requirements & Goals',
        description: 'Share your project vision, target audience, and key objectives',
        step_type: 'textarea' as const,
        options: 'Describe your project goals, target audience, and key requirements...',
        isRequired: true,
      },
      {
        title: 'Design Preferences & Branding',
        description: 'Upload your logo, brand guidelines, and design inspiration',
        step_type: 'file_upload' as const,
        options: '.pdf,.jpg,.png,.zip',
        isRequired: true,
      },
      {
        title: 'Technical Requirements',
        description: 'Specify hosting preferences, integrations, and technical needs',
        step_type: 'textarea' as const,
        options: 'List any specific technical requirements, integrations, or hosting preferences...',
        isRequired: true,
      },
      {
        title: 'Content & Assets',
        description: 'Provide website copy, images, and other content materials',
        step_type: 'file_upload' as const,
        options: '.pdf,.doc,.docx,.jpg,.png,.zip',
        isRequired: false,
      },
      {
        title: 'Timeline & Budget Confirmation',
        description: 'Review and confirm project timeline and payment schedule',
        step_type: 'checkbox' as const,
        isRequired: true,
      },
      {
        title: 'Communication Setup',
        description: 'Join project Slack/Discord and schedule kickoff call',
        step_type: 'checkbox' as const,
        isRequired: true,
      }
    ]
  },
  {
    id: 'graphic-designer',
    name: 'Graphic Design Project',
    description: 'Streamlined onboarding for graphic design and branding projects',
    category: 'Design',
    icon: '🎨',
    brandColor: '#ec4899',
    completionMessage: 'Fantastic! Your design project is all set up. We have everything we need to create something amazing for your brand.',
    steps: [
      {
        title: 'Brand Discovery Session',
        description: 'Complete our brand questionnaire and share your vision',
        step_type: 'textarea' as const,
        options: 'Tell us about your brand, values, and design vision...',
        isRequired: true,
      },
      {
        title: 'Design Brief & Objectives',
        description: 'Define project scope, deliverables, and success metrics',
        step_type: 'textarea' as const,
        options: 'Describe what you need designed and how success will be measured...',
        isRequired: true,
      },
      {
        title: 'Visual References',
        description: 'Share inspiration, competitor examples, and style preferences',
        step_type: 'file_upload' as const,
        options: '.jpg,.png,.pdf',
        isRequired: true,
      },
      {
        title: 'Brand Assets & Guidelines',
        description: 'Upload existing logos, fonts, and brand materials',
        step_type: 'file_upload' as const,
        options: '.pdf,.ai,.eps,.jpg,.png,.zip',
        isRequired: false,
      },
      {
        title: 'Review Process Setup',
        description: 'Establish feedback workflow and approval process',
        step_type: 'checkbox' as const,
        isRequired: true,
      },
      {
        title: 'Project Timeline Confirmation',
        description: 'Confirm milestones, deadlines, and delivery schedule',
        step_type: 'checkbox' as const,
        isRequired: true,
      }
    ]
  },
  {
    id: 'marketing-consultant',
    name: 'Marketing Strategy Project',
    description: 'Comprehensive onboarding for marketing consulting engagements',
    category: 'Marketing',
    icon: '📈',
    brandColor: '#10b981',
    completionMessage: 'Excellent! We now have all the information needed to develop a winning marketing strategy for your business.',
    steps: [
      {
        title: 'Business Analysis',
        description: 'Share your business model, target market, and current challenges',
        step_type: 'textarea' as const,
        options: 'Describe your business model, target customers, and main challenges...',
        isRequired: true,
      },
      {
        title: 'Current Marketing Audit',
        description: 'Provide access to existing marketing channels and analytics',
        step_type: 'url' as const,
        options: 'Google Analytics, social media profiles, website URL...',
        isRequired: true,
      },
      {
        title: 'Goals & KPIs Definition',
        description: 'Define success metrics and marketing objectives',
        step_type: 'textarea' as const,
        options: 'What are your marketing goals and how will you measure success?',
        isRequired: true,
      },
      {
        title: 'Budget & Resource Planning',
        description: 'Discuss marketing budget and available team resources',
        step_type: 'text' as const,
        options: 'Monthly marketing budget and team availability...',
        isRequired: true,
      },
      {
        title: 'Competitor Research',
        description: 'Share competitor information and market positioning',
        step_type: 'textarea' as const,
        options: 'List your main competitors and their marketing strategies...',
        isRequired: false,
      },
      {
        title: 'Strategy Kickoff Meeting',
        description: 'Schedule initial strategy session and tool access setup',
        step_type: 'checkbox' as const,
        isRequired: true,
      }
    ]
  },
  {
    id: 'copywriter',
    name: 'Copywriting Project',
    description: 'Essential onboarding for copywriting and content creation projects',
    category: 'Content',
    icon: '✍️',
    brandColor: '#8b5cf6',
    completionMessage: 'Perfect! We have everything needed to craft compelling copy that resonates with your audience and drives results.',
    steps: [
      {
        title: 'Brand Voice & Tone',
        description: 'Define your brand personality and communication style',
        step_type: 'textarea' as const,
        options: 'How should your brand sound? Professional, friendly, authoritative?',
        isRequired: true,
      },
      {
        title: 'Target Audience Profile',
        description: 'Share detailed customer personas and pain points',
        step_type: 'textarea' as const,
        options: 'Describe your ideal customers, their challenges, and motivations...',
        isRequired: true,
      },
      {
        title: 'Project Scope & Deliverables',
        description: 'Confirm copy requirements, word counts, and formats',
        step_type: 'textarea' as const,
        options: 'What copy do you need? Website pages, emails, ads, etc.',
        isRequired: true,
      },
      {
        title: 'Reference Materials',
        description: 'Provide existing copy, competitor examples, and guidelines',
        step_type: 'file_upload' as const,
        options: '.pdf,.doc,.docx,.txt',
        isRequired: false,
      },
      {
        title: 'Review & Approval Process',
        description: 'Establish revision workflow and feedback timeline',
        step_type: 'checkbox' as const,
        isRequired: true,
      }
    ]
  },
  {
    id: 'social-media-manager',
    name: 'Social Media Management',
    description: 'Complete setup for social media management services',
    category: 'Social Media',
    icon: '📱',
    brandColor: '#f59e0b',
    completionMessage: 'Amazing! Your social media strategy is ready to launch. We\'ll start creating engaging content that grows your audience.',
    steps: [
      {
        title: 'Social Media Audit',
        description: 'Provide access to current social media accounts and analytics',
        step_type: 'url' as const,
        options: 'Links to your social media profiles and analytics...',
        isRequired: true,
      },
      {
        title: 'Content Strategy Planning',
        description: 'Define content themes, posting frequency, and brand guidelines',
        step_type: 'textarea' as const,
        options: 'What topics should we cover? How often should we post?',
        isRequired: true,
      },
      {
        title: 'Visual Brand Assets',
        description: 'Upload logos, brand colors, fonts, and image templates',
        step_type: 'file_upload' as const,
        options: '.jpg,.png,.pdf,.ai,.psd,.zip',
        isRequired: true,
      },
      {
        title: 'Content Calendar Setup',
        description: 'Review and approve initial content calendar and posting schedule',
        step_type: 'checkbox' as const,
        isRequired: true,
      },
      {
        title: 'Engagement Guidelines',
        description: 'Establish community management and response protocols',
        step_type: 'textarea' as const,
        options: 'How should we respond to comments and messages?',
        isRequired: false,
      },
      {
        title: 'Reporting & Analytics',
        description: 'Set up tracking and monthly reporting preferences',
        step_type: 'checkbox' as const,
        isRequired: true,
      }
    ]
  },
  {
    id: 'business-consultant',
    name: 'Business Consulting Engagement',
    description: 'Structured onboarding for business consulting projects',
    category: 'Consulting',
    icon: '💼',
    brandColor: '#6366f1',
    completionMessage: 'Excellent! We have a clear understanding of your business needs and are ready to develop actionable strategies for growth.',
    steps: [
      {
        title: 'Business Assessment',
        description: 'Complete comprehensive business health questionnaire',
        step_type: 'textarea' as const,
        options: 'Tell us about your business structure, revenue, and key challenges...',
        isRequired: true,
      },
      {
        title: 'Financial Data Sharing',
        description: 'Provide relevant financial statements and key metrics',
        step_type: 'file_upload' as const,
        options: '.pdf,.xlsx,.csv',
        isRequired: true,
      },
      {
        title: 'Stakeholder Interviews',
        description: 'Schedule meetings with key team members and decision makers',
        step_type: 'text' as const,
        options: 'List key stakeholders and their availability...',
        isRequired: true,
      },
      {
        title: 'Market & Competitive Analysis',
        description: 'Share market research and competitive landscape information',
        step_type: 'file_upload' as const,
        options: '.pdf,.doc,.docx,.xlsx',
        isRequired: false,
      },
      {
        title: 'Goal Setting & Success Metrics',
        description: 'Define project objectives and measurable outcomes',
        step_type: 'textarea' as const,
        options: 'What are your business goals and how will you measure success?',
        isRequired: true,
      },
      {
        title: 'Engagement Framework',
        description: 'Establish communication cadence and project management approach',
        step_type: 'checkbox' as const,
        isRequired: true,
      }
    ]
  }
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
        step_type: 'file_upload' as const,
        options: '.csv,.json,.txt,.pem',
        isRequired: true,
      },
      {
        title: 'AWS Account ID & Region',
        description: 'Provide your AWS account details and preferred deployment region',
        step_type: 'textarea' as const,
        options: 'AWS Account ID, preferred region (e.g., us-east-1), and any specific availability zones...',
        isRequired: true,
      },
      {
        title: 'SSL Certificates',
        description: 'Upload SSL certificates and private keys for HTTPS setup',
        step_type: 'file_upload' as const,
        options: '.pem,.crt,.key,.p12,.pfx',
        isRequired: false,
      },
      {
        title: 'Environment Variables',
        description: 'Provide production environment variables and secrets',
        step_type: 'file_upload' as const,
        options: '.env,.json,.yaml,.yml',
        isRequired: true,
      },
      {
        title: 'Database Connection Details',
        description: 'Database credentials and connection strings for production',
        step_type: 'textarea' as const,
        options: 'Database host, username, password, database name, connection string...',
        isRequired: true,
      },
      {
        title: 'Deployment Configuration',
        description: 'Upload Docker files, deployment scripts, or configuration files',
        step_type: 'file_upload' as const,
        options: '.dockerfile,.yaml,.yml,.json,.sh,.ps1,.zip',
        isRequired: false,
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
        step_type: 'textarea' as const,
        options: 'API Key, Secret Key, Webhook URLs, Account IDs...',
        isRequired: true,
      },
      {
        title: 'Authentication Credentials',
        description: 'Upload OAuth credentials, service account files, or API certificates',
        step_type: 'file_upload' as const,
        options: '.json,.pem,.p12,.txt,.csv',
        isRequired: true,
      },
      {
        title: 'Webhook Configuration',
        description: 'Webhook endpoints, signing secrets, and event configurations',
        step_type: 'textarea' as const,
        options: 'Webhook URLs, signing secrets, event types to listen for...',
        isRequired: false,
      },
      {
        title: 'Integration Mapping',
        description: 'Upload field mapping files or data transformation rules',
        step_type: 'file_upload' as const,
        options: '.json,.csv,.xlsx,.yaml,.yml',
        isRequired: false,
      },
      {
        title: 'Testing Credentials',
        description: 'Sandbox/testing API keys for development and testing',
        step_type: 'textarea' as const,
        options: 'Test API keys, sandbox account details, staging environment URLs...',
        isRequired: false,
      },
      {
        title: 'Security & Compliance',
        description: 'Upload compliance certificates, security policies, or audit documents',
        step_type: 'file_upload' as const,
        options: '.pdf,.doc,.docx,.txt',
        isRequired: false,
      }
    ]
  },
  {
    id: 'enterprise-onboarding',
    name: 'Enterprise Client Onboarding',
    description: 'Comprehensive onboarding for enterprise clients with security requirements',
    category: 'Enterprise',
    icon: '🏢',
    brandColor: '#1f2937',
    completionMessage: 'Outstanding! Your enterprise onboarding is complete. Our security team will review all materials and contact you within 24 hours to finalize setup.',
    steps: [
      {
        title: 'Security & Compliance Documentation',
        description: 'Upload SOC2, ISO certifications, security policies, and compliance documents',
        step_type: 'file_upload' as const,
        options: '.pdf,.doc,.docx,.zip',
        isRequired: true,
      },
      {
        title: 'Network & Infrastructure Details',
        description: 'Provide network diagrams, IP ranges, firewall rules, and infrastructure requirements',
        step_type: 'file_upload' as const,
        options: '.pdf,.vsd,.png,.jpg,.txt,.json',
        isRequired: true,
      },
      {
        title: 'SSO Configuration',
        description: 'Upload SAML metadata, OIDC configuration, or Active Directory details',
        step_type: 'file_upload' as const,
        options: '.xml,.json,.txt,.csv',
        isRequired: true,
      },
      {
        title: 'Data Processing Agreement',
        description: 'Upload signed DPA, privacy policies, and data handling agreements',
        step_type: 'file_upload' as const,
        options: '.pdf,.doc,.docx',
        isRequired: true,
      },
      {
        title: 'Technical Contact Information',
        description: 'Provide technical team contacts, escalation procedures, and support channels',
        step_type: 'textarea' as const,
        options: 'Technical lead contact, IT security contact, escalation procedures...',
        isRequired: true,
      },
      {
        title: 'Integration Requirements',
        description: 'Upload API specifications, integration requirements, and technical documentation',
        step_type: 'file_upload' as const,
        options: '.pdf,.json,.yaml,.yml,.txt,.zip',
        isRequired: false,
      }
    ]
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