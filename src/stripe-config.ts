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
    features: [
      "Everything in Basic, plus:",
      "Unlimited checklists",
      "Unlimited customer tracking",
      "Password protection for checklists",
      "Custom completion pages",
    ],
  },
];
