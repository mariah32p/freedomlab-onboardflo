// Temporarily use test mode price IDs since Supabase has test mode keys
// TODO: Switch back to live mode once Supabase environment variables are updated
const STANDARD_PRICE_ID = 'price_1QdVGSDn6VTzl81bJVQzpQoL'; // Test mode price ID
const PRO_PRICE_ID = 'price_1QdVGtDn6VTzl81bwxQzpQoM'; // Test mode price ID (placeholder)

// Currently using test mode to match Supabase test keys
console.info('🧪 TEST MODE: Using test Stripe price IDs to match Supabase test keys');
console.info('To switch to live mode:');
console.info('1. Update Supabase Edge Function environment variables:');
console.info('   - STRIPE_SECRET_KEY=sk_live_...');
console.info('   - STRIPE_WEBHOOK_SECRET=whsec_...');
console.info('2. Update price IDs in stripe-config.ts to live mode IDs');

export const stripeProducts = [
  {
    priceId: STANDARD_PRICE_ID,
    name: "Standard",
    description: "Perfect for small teams getting started",
    price: 29,
    mode: "subscription",
    disabled: false,
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
