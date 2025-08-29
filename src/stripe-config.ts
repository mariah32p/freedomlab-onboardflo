// Stripe product configuration
export const stripeProducts = [
  {
    priceId: 'price_1234567890', // Replace with your actual Stripe price ID for Basic plan
    name: 'Basic',
    description: 'Perfect for small teams getting started',
    price: 29,
    mode: 'subscription' as const,
    features: [
      'Up to 3 active checklists',
      'Up to 100 customers tracked per month',
      'Shareable public links for each checklist',
      'Simple branding (logo + 1 color)',
      'Progress tracking dashboard',
      'Email completion notifications',
    ]
  },
  {
    priceId: 'price_0987654321', // Replace with your actual Stripe price ID for Pro plan
    name: 'Pro',
    description: 'For SaaS companies, larger agencies',
    price: 49,
    mode: 'subscription' as const,
    features: [
      'Everything in Basic, plus:',
      'Unlimited checklists',
      'Unlimited customer tracking',
      'Password protection for checklists',
      'Custom completion pages'
    ]
  }
];

export function getProductByPriceId(priceId: string) {
  return stripeProducts.find(product => product.priceId === priceId);
}