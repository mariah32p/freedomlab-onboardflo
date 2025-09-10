// Get Stripe price IDs from environment variables with test mode fallbacks
const STANDARD_PRICE_ID = import.meta.env.VITE_STRIPE_STANDARD_PRICE_ID || 'price_test_standard_fallback';
const PRO_PRICE_ID = import.meta.env.VITE_STRIPE_PRO_PRICE_ID || 'price_test_pro_fallback';

// Validate that we have proper price IDs
const isTestMode = STANDARD_PRICE_ID.startsWith('price_test_');
const isLiveMode = STANDARD_PRICE_ID.startsWith('price_1') || PRO_PRICE_ID.startsWith('price_1');
const isFallbackMode = STANDARD_PRICE_ID.includes('fallback') || PRO_PRICE_ID.includes('fallback');

// Log current mode
if (isFallbackMode) {
  console.warn('⚠️  WARNING: Using fallback price IDs - Stripe not configured');
  console.warn('Please set your Stripe price IDs in environment variables');
} else if (isLiveMode) {
  console.info('✅ LIVE MODE: Using live Stripe price IDs');
  console.info('Make sure your Supabase Edge Functions have live mode Stripe keys:');
  console.info('- STRIPE_SECRET_KEY=sk_live_...');
  console.info('- STRIPE_WEBHOOK_SECRET=whsec_...');
} else if (isTestMode) {
  console.info('🧪 TEST MODE: Using test Stripe price IDs');
  console.info('Make sure your Supabase Edge Functions have test mode Stripe keys');
}

export const stripeProducts = [
  {
    priceId: STANDARD_PRICE_ID,
    name: "Standard",
    description: "Perfect for small teams getting started",
    price: 29,
    mode: "subscription",
    disabled: isFallbackMode,
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
