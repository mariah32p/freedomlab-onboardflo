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
    description: 'Perfect for growing businesses',
    price: 29,
    priceId: 'price_1RzrMYDn6VTzl81bogCwhX1U',
    mode: 'subscription',
    features: [
      'Unlimited checklists',
      'Unlimited customer submissions',
      'Complete branding customization',
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
    description: 'Advanced features for enterprise teams',
    price: 79,
    priceId: 'price_1RzrMYDn6VTzl81bTSgcl0ZA',
    mode: 'subscription',
    features: [
      'Everything in Standard',
      'Advanced analytics & reporting',
      'Team collaboration tools',
      'API access & integrations',
      'Priority support',
      'Custom domain support',
      'Advanced security features',
      'Dedicated account manager'
    ],
    disabled: true,
    comingSoon: true
  }
];