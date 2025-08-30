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
        isRequired: true,
      },
      {
        title: 'Design Preferences & Branding',
        description: 'Upload your logo, brand guidelines, and design inspiration',
        isRequired: true,
      },
      {
        title: 'Technical Requirements',
        description: 'Specify hosting preferences, integrations, and technical needs',
        isRequired: true,
      },
      {
        title: 'Content & Assets',
        description: 'Provide website copy, images, and other content materials',
        isRequired: false,
      },
      {
        title: 'Timeline & Budget Confirmation',
        description: 'Review and confirm project timeline and payment schedule',
        isRequired: true,
      },
      {
        title: 'Communication Setup',
        description: 'Join project Slack/Discord and schedule kickoff call',
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
        isRequired: true,
      },
      {
        title: 'Design Brief & Objectives',
        description: 'Define project scope, deliverables, and success metrics',
        isRequired: true,
      },
      {
        title: 'Visual References',
        description: 'Share inspiration, competitor examples, and style preferences',
        isRequired: true,
      },
      {
        title: 'Brand Assets & Guidelines',
        description: 'Upload existing logos, fonts, and brand materials',
        isRequired: false,
      },
      {
        title: 'Review Process Setup',
        description: 'Establish feedback workflow and approval process',
        isRequired: true,
      },
      {
        title: 'Project Timeline Confirmation',
        description: 'Confirm milestones, deadlines, and delivery schedule',
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
        isRequired: true,
      },
      {
        title: 'Current Marketing Audit',
        description: 'Provide access to existing marketing channels and analytics',
        isRequired: true,
      },
      {
        title: 'Goals & KPIs Definition',
        description: 'Define success metrics and marketing objectives',
        isRequired: true,
      },
      {
        title: 'Budget & Resource Planning',
        description: 'Discuss marketing budget and available team resources',
        isRequired: true,
      },
      {
        title: 'Competitor Research',
        description: 'Share competitor information and market positioning',
        isRequired: false,
      },
      {
        title: 'Strategy Kickoff Meeting',
        description: 'Schedule initial strategy session and tool access setup',
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
        isRequired: true,
      },
      {
        title: 'Target Audience Profile',
        description: 'Share detailed customer personas and pain points',
        isRequired: true,
      },
      {
        title: 'Project Scope & Deliverables',
        description: 'Confirm copy requirements, word counts, and formats',
        isRequired: true,
      },
      {
        title: 'Reference Materials',
        description: 'Provide existing copy, competitor examples, and guidelines',
        isRequired: false,
      },
      {
        title: 'Review & Approval Process',
        description: 'Establish revision workflow and feedback timeline',
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
        isRequired: true,
      },
      {
        title: 'Content Strategy Planning',
        description: 'Define content themes, posting frequency, and brand guidelines',
        isRequired: true,
      },
      {
        title: 'Visual Brand Assets',
        description: 'Upload logos, brand colors, fonts, and image templates',
        isRequired: true,
      },
      {
        title: 'Content Calendar Setup',
        description: 'Review and approve initial content calendar and posting schedule',
        isRequired: true,
      },
      {
        title: 'Engagement Guidelines',
        description: 'Establish community management and response protocols',
        isRequired: false,
      },
      {
        title: 'Reporting & Analytics',
        description: 'Set up tracking and monthly reporting preferences',
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
        isRequired: true,
      },
      {
        title: 'Financial Data Sharing',
        description: 'Provide relevant financial statements and key metrics',
        isRequired: true,
      },
      {
        title: 'Stakeholder Interviews',
        description: 'Schedule meetings with key team members and decision makers',
        isRequired: true,
      },
      {
        title: 'Market & Competitive Analysis',
        description: 'Share market research and competitive landscape information',
        isRequired: false,
      },
      {
        title: 'Goal Setting & Success Metrics',
        description: 'Define project objectives and measurable outcomes',
        isRequired: true,
      },
      {
        title: 'Engagement Framework',
        description: 'Establish communication cadence and project management approach',
        isRequired: true,
      }
    ]
  }
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