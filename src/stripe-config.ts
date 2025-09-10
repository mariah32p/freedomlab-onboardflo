// Debug environment variables
console.log('=== STRIPE CONFIGURATION DEBUG ===');
console.log('VITE_STRIPE_STANDARD_PRICE_ID:', import.meta.env.VITE_STRIPE_STANDARD_PRICE_ID);
console.log('VITE_STRIPE_PRO_PRICE_ID:', import.meta.env.VITE_STRIPE_PRO_PRICE_ID);
console.log('VITE_STRIPE_CUSTOMER_PORTAL:', import.meta.env.VITE_STRIPE_CUSTOMER_PORTAL);
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '[SET]' : '[MISSING]');

export const stripeProducts = [
  {
    priceId: import.meta.env.VITE_STRIPE_STANDARD_PRICE_ID,
    name: "Standard",
    description: "Perfect for small teams getting started",
    price: 29,
    mode: "subscription",
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
    priceId: import.meta.env.VITE_STRIPE_PRO_PRICE_ID,
    name: "Pro",
    description: "For SaaS companies, larger agencies",
    price: 49,
    mode: "subscription",
    disabled: true,
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

// Debug the final products array
console.log('=== STRIPE PRODUCTS ARRAY ===');
console.log('stripeProducts:', stripeProducts);
stripeProducts.forEach((product, index) => {
  console.log(`Product ${index + 1}:`, {
    name: product.name,
    priceId: product.priceId,
    price: product.price,
    disabled: product.disabled,
    comingSoon: product.comingSoon
  });
});
console.log('=== END STRIPE DEBUG ===');