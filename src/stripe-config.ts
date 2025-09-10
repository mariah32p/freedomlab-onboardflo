// Get Stripe price IDs from environment variables with test mode fallbacks
const STANDARD_PRICE_ID = import.meta.env.VITE_STRIPE_STANDARD_PRICE_ID || 'price_test_standard_fallback';
const PRO_PRICE_ID = import.meta.env.VITE_STRIPE_PRO_PRICE_ID || 'price_test_pro_fallback';

// Validate that we have proper test mode price IDs (should start with price_test_ for test mode)
const isTestMode = STANDARD_PRICE_ID.startsWith('price_test_') || PRO_PRICE_ID.startsWith('price_test_');
const isLiveMode = STANDARD_PRICE_ID.startsWith('price_1') || PRO_PRICE_ID.startsWith('price_1');

if (isLiveMode && !isTestMode) {
  console.warn('⚠️  WARNING: Using live mode price IDs with test environment');
  console.warn('Please update your .env file with test mode price IDs:');
  console.warn('VITE_STRIPE_STANDARD_PRICE_ID=price_test_...');
  console.warn('VITE_STRIPE_PRO_PRICE_ID=price_test_...');
}

export const stripeProducts = [
  {
    priceId: STANDARD_PRICE_ID,
    name: "Standard",
    description: "Perfect for small teams getting started",
    price: 29,
    mode: "subscription",
    disabled: STANDARD_PRICE_ID === 'price_test_standard_fallback',
    features: [
      "Up to 3 active checklists",
      "Up to 100 customers tracked per month",
      "Shareable public links for each checklist",
      "Simple branding (logo + 1 color)",
      "Progress tracking dashboard",
      "Email completion notifications",
    ],
  },
  {
    priceId: PRO_PRICE_ID,
    name: "Pro",
    description: "For SaaS companies, larger agencies",
    price: 49,
    mode: "subscription",
    disabled: true, // Keep Pro disabled as it's coming soon
    comingSoon: true,
    features: [
      "Everything in Basic, plus:",
      "Unlimited checklists",
      "Unlimited customer tracking",
      "Password protection for checklists",
      "Custom completion pages",
    ],
  },
];
