export interface StripeProduct {
  name: string;
  description: string;
  price: number;
  priceId: string;
  mode: 'subscription' | 'payment';
  features: string[];
  disabled?: boolean;
  comingSoon?: boolean;
}

export const stripeProducts: StripeProduct[] = [
  {
    name: 'Standard',
    description: 'Everything you need to succeed',
    price: 29,
    priceId: 'price_1RzrMYDn6VTzl81bogCwhX1U',
    mode: 'subscription',
    features: [
      'Unlimited checklists',
      'Unlimited customer submissions',
      'Advanced branding (logo, colors, fonts)',
      'Password-protected checklists',
      'Shareable customer links',
      'Real-time progress tracking',
      'Email notifications',
      'File upload support',
      'Custom completion pages'
    ],
    disabled: false
  },
  {
    name: 'Pro',
    description: 'Enterprise-grade power and control',
    price: 79,
    priceId: 'price_1RzrMYDn6VTzl81bTSgcl0ZA',
    mode: 'subscription',
    features: [
      'Advanced analytics & insights dashboard',
      'Multi-team collaboration & permissions',
      'White-label branding & custom domains',
      'API access & webhook integrations'
    ],
    disabled: true,
    comingSoon: true
  }
];