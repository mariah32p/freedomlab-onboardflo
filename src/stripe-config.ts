// Live mode price IDs
const STANDARD_PRICE_ID = 'price_1RzrMYDn6VTzl81bogCwhX1U'; // Live mode Standard plan
const PRO_PRICE_ID = 'price_1RzrMYDn6VTzl81bTSgcl0ZA'; // Live mode Pro plan

console.info('✅ LIVE MODE: Using live Stripe price IDs');
console.info('Make sure your Supabase Edge Functions have live mode Stripe keys:');
console.info('- STRIPE_SECRET_KEY=sk_live_...');
console.info('- STRIPE_WEBHOOK_SECRET=whsec_...');

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
