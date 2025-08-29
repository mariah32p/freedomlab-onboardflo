# OnboardFlo Production Checklist

## Overview
This checklist will guide you through deploying OnboardFlo from demo mode to a fully functional production application with real authentication and payments.

## 🔧 Configuration Changes

### 1. Enable Real Authentication
- [ ] Change `ENABLE_REAL_AUTH: false` to `ENABLE_REAL_AUTH: true` in `src/config/app.ts`

### 2. Environment Variables Setup
- [ ] Create `.env` file with your actual Supabase credentials:
  ```
  VITE_SUPABASE_URL=your_actual_supabase_url
  VITE_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
  ```

## 🗄️ Database Setup

### 1. Supabase Project
- [ ] Create new Supabase project at https://supabase.com
- [ ] Note down your project URL and anon key
- [ ] Enable email authentication in Supabase Auth settings

### 2. Database Schema
- [ ] Run the existing migration in `supabase/migrations/` to create:
  - `stripe_customers` table
  - `stripe_subscriptions` table  
  - `stripe_orders` table
  - Required RLS policies

### 3. Authentication Settings
- [ ] Configure email templates in Supabase Auth
- [ ] Set up redirect URLs for your domain
- [ ] Disable email confirmation if desired (for faster signup)

## 💳 Stripe Integration

### 1. Stripe Account Setup
- [ ] Create Stripe account at https://stripe.com
- [ ] Get your publishable and secret keys
- [ ] Create your actual products and pricing in Stripe Dashboard

### 2. Update Stripe Configuration
- [ ] Replace placeholder price IDs in `src/stripe-config.ts` with real ones:
  ```typescript
  priceId: 'price_1234567890', // Replace with actual Basic plan price ID
  priceId: 'price_0987654321', // Replace with actual Pro plan price ID
  ```

### 3. Webhook Setup
- [ ] Deploy your Supabase Edge functions (they auto-deploy when connected)
- [ ] Add webhook endpoint in Stripe Dashboard: `your-supabase-url/functions/v1/stripe-webhook`
- [ ] Configure webhook to listen for these events:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`

### 4. Environment Variables for Edge Functions
Add these to your Supabase project settings:
- [ ] `STRIPE_SECRET_KEY` - Your Stripe secret key
- [ ] `STRIPE_WEBHOOK_SECRET` - Your webhook signing secret from Stripe

## 🚀 Deployment

### 1. Build and Deploy
- [ ] Test locally with real auth: `npm run dev`
- [ ] Build for production: `npm run build`
- [ ] Deploy to your hosting provider (Netlify, Vercel, etc.)

### 2. Domain and SSL
- [ ] Configure custom domain
- [ ] Ensure SSL certificate is active
- [ ] Update Stripe webhook URLs to use production domain

## ✅ Testing Checklist

### Authentication Flow
- [ ] User can sign up with email/password
- [ ] User receives confirmation email (if enabled)
- [ ] User can sign in successfully
- [ ] User can sign out
- [ ] Protected routes redirect to sign in

### Payment Flow
- [ ] Pricing page loads correctly
- [ ] Stripe checkout opens when clicking subscribe
- [ ] Test payment with Stripe test cards
- [ ] User redirects to dashboard after successful payment
- [ ] Subscription data appears in database
- [ ] Webhook processes payment events

### Dashboard
- [ ] User sees their actual data (not demo data)
- [ ] Real-time updates work
- [ ] All features function as expected

## 🔒 Security Review

### Database Security
- [ ] All tables have RLS enabled
- [ ] RLS policies are properly configured
- [ ] No sensitive data exposed to client
- [ ] Database backups configured

### API Security
- [ ] Supabase service role key is secure
- [ ] Stripe webhook secret is properly set
- [ ] No API keys exposed in client code
- [ ] CORS properly configured

## 📊 Monitoring Setup

### Analytics
- [ ] Set up error monitoring (Sentry, LogRocket, etc.)
- [ ] Configure performance monitoring
- [ ] Set up user analytics (PostHog, Mixpanel, etc.)

### Business Metrics
- [ ] Track signup conversion rates
- [ ] Monitor subscription metrics in Stripe
- [ ] Set up alerts for failed payments
- [ ] Track customer onboarding completion rates

## 🎯 Go-Live Steps

1. [ ] Complete all items above
2. [ ] Run final tests in staging environment
3. [ ] Switch `ENABLE_REAL_AUTH` to `true`
4. [ ] Deploy to production
5. [ ] Test complete user flow end-to-end
6. [ ] Monitor for any issues in first 24 hours

## 📝 Post-Launch

### Week 1
- [ ] Monitor error rates and user feedback
- [ ] Check payment processing is working smoothly
- [ ] Verify email deliverability
- [ ] Review performance metrics

### Month 1
- [ ] Analyze user onboarding data
- [ ] Optimize based on real usage patterns
- [ ] Plan feature improvements based on feedback

---

## 🆘 Troubleshooting

### Common Issues
- **Auth not working**: Check Supabase URL and keys in `.env`
- **Payments failing**: Verify Stripe keys and webhook configuration
- **Database errors**: Check RLS policies and table permissions
- **Email issues**: Verify Supabase email settings and templates

### Support Resources
- Supabase Documentation: https://supabase.com/docs
- Stripe Documentation: https://stripe.com/docs
- Your codebase includes comprehensive error handling and logging

---

*Last updated: [Date when you complete setup]*