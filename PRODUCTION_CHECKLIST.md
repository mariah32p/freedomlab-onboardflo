Overview: Subscription + App MVP (Supabase + Stripe on Netlify)
1) Core flow (happy path) - DONE
Landing page: Every button is a single CTA ("Start Free Trial"). All of them open the sign-up flow (no plan-specific buttons on the landing page). - DONE
Sign-up: Create the user in Supabase Auth (email confirmation is turned off), then send them to /get-started. - DONE
Get Started: User chooses Basic or Pro. When they click "Start 7-day trial," the server creates a Stripe Checkout Session with a trial and redirects them to Stripe. - DONE
Return: After Checkout, Stripe sends the user back to /dashboard. Your webhook marks the subscription as "trialing" and stores the trial end date. - DONE
Dashboard: Shows the product's real sections (e.g., Dashboard, Checklists, Submissions, Settings) plus Settings. A small banner shows trial days left and charge date. All features work during the trial. - DONE
Auto-upgrade: At the end of the trial, Stripe automatically charges the card and the subscription becomes "active." - DONE

2) App structure - DONE
Routes - DONE
/landing - DONE
/signup: email/password sign-up - DONE
/get-started: plan selection + start trial (go to Checkout) - DONE
/dashboard: protected app with product sections + Settings - DONE
Sections are tailored to the product (no generic "Features" tab). Settings is always the last tab. - DONE

3) Plans, trials, and portal - DONE
Trial: 7 days; card is collected at start; everything is unlocked during the trial. - DONE

After trial: - DONE
If active and Pro → full access. - DONE
If active and Basic → same UI, but Basic-gated actions remain disabled. - DONE

If past_due or other payment issues → show a "Payment issue" banner and allow a 30-day grace window; after 30 days, treat as no active subscription. - DONE
If no active subscription (canceled, >30-day payment issue, or sign-up abandoned before payment) → route to /get-started. - DONE
Settings → Manage Subscription: Opens Stripe Customer Portal (https://billing.stripe.com/p/login/28E28r3f7fJDc9y7sG5os00) for cancel and payment method updates only. Do not use the portal for plan switching. - PARTIAL (button exists but doesn't open portal yet)
Upgrade/Downgrade (plan changes): Handled manually in-app. When the user changes plans, the server starts a new Checkout Session without a trial, and Stripe charges immediately based on your proration policy. (Plan changes do not create a new trial.) Basic Price ID: price_1RzrMYDn6VTzl81bogCwhX1U, Pro Price ID price_1RzrMYDn6VTzl81bTSgcl0ZA. Both monthly subscriptions. - NOT STARTED

4) Data model (Supabase) - DONE
profiles (one row per user, keyed by auth.users.id) stores: - DONE (using stripe_customers and stripe_subscriptions tables)
email - DONE
plan (basic | pro) - DONE (via price_id)
subscription_status (trialing, active, past_due, canceled, etc.) - DONE
trial_ends_at, current_period_end - DONE
customer_id, subscription_id - DONE
payment_issue_since (timestamp set on first payment failure; cleared on recovery) - DONE
RLS: Users can read and update only their own profile row. - DONE

Feature data: Create normal app tables for your product (e.g., events, projects, etc.). All reads/writes persist via Supabase with RLS so users only see their own data. - DONE (checklists, checklist_steps, customer_sessions, session_progress, user_branding)

5) Environment & deployment (Netlify) - DONE
Server-only env vars: Stripe Secret Key, Stripe Webhook Secret, Supabase Service Role Key, App URL. - DONE
Client env vars: Stripe Publishable Key, Supabase URL, Supabase Anon Key. - DONE
Redeploy after setting env. - DONE

6) Server endpoints (what each should do) - DONE
Create Checkout Session (POST /api/create-checkout-session) - DONE (via Supabase edge function)
For sign-up trials: Create a subscription Checkout Session with a 7-day trial for the selected price. Set success URL to /dashboard and cancel URL to /get-started. Return the Stripe URL to redirect the user. - DONE
For plan changes: Create a subscription Checkout Session without a trial that changes the plan immediately (use your proration policy). Return the Stripe URL. - NOT STARTED
Create Portal Session (POST /api/create-portal-session) - NOT STARTED
Look up the user's Stripe customer_id (and, if you support many products, the exact subscription_id to manage). - NOT STARTED
Create a Stripe Billing Portal session that does not allow plan switching. Return the portal URL. - NOT STARTED
Stripe Webhook (POST /api/stripe-webhook) - DONE
Verify the signature. - DONE
On checkout.session.completed: store customer_id and subscription_id on the user's profile. - DONE
On customer.subscription.created/updated: update plan, subscription_status, trial_ends_at, and current_period_end. If payment recovered, clear payment_issue_since. - DONE
On invoice.payment_failed: set status to past_due and, if not already set, record payment_issue_since. - DONE
On customer.subscription.deleted: set status to canceled. - DONE

Ensure idempotency so events are processed once. - DONE

7) Client logic (what the app should do) - DONE
Route guard (everywhere users enter the app): - DONE
If not signed in → send to /signup. - DONE
If status is trialing or active → send to /dashboard. - DONE
If past_due and the first failure was within 30 days → allow /dashboard but show a payment-issue banner. - DONE
Otherwise → send to /get-started. - DONE
Grace helper: Determine whether a user is in the 30-day grace window by comparing the current time to payment_issue_since. - DONE

Feature gating: - PARTIAL
If status is trialing, allow all features. - DONE
Otherwise, gate actions based on plan. Keep Pro actions visible but disabled on Basic with a small inline "Upgrade" prompt (copy can still say "Upgrade" even though the card is already on file). - NOT STARTED
Trial banner (on /dashboard during trial): Show "Trial ends in X days. Your card will be charged on [date]. Manage in Settings." - DONE

8) Analytics & notifications (nice to have) - NOT STARTED

Events to track: landing CTA click, sign-up completed, Get Started viewed, Checkout started, Checkout completed, trial started, trial ends soon, trial converted/charged, payment failed, grace started, grace resolved, subscription canceled, plan changed. - NOT STARTED
Attribution: carry ?src= and UTM params from landing to sign-up and store on profile or in an analytics system. - NOT STARTED
Emails (via Stripe or your tool): trial started, trial ending soon, payment failed, grace ending, cancellation confirmation. - NOT STARTED

9) QA checklist (condensed) - PARTIAL
Sign-up → Get Started → Checkout (trial) → Dashboard works. - DONE
Trial banner shows correct days left and charge date. - DONE
Webhooks set trialing, then flip to active automatically. - DONE
Basic vs Pro gates behave; trial overrides gating. - NOT STARTED
Payment failure shows banner and starts 30-day grace; after 30 days, the app routes to Get Started. - DONE
Settings → Portal handles cancel/payment only. - NOT STARTED
Plan change triggers a Checkout without a trial and charges immediately per proration rules. - NOT STARTED
Feature data persists via Supabase with correct RLS. - DONE

10) Final "don't forgets" - PARTIAL
Show dates in the user's timezone when displaying trial_ends_at. - DONE
If a user signs up but never finishes Checkout, the next visit should route them to /get-started. - DONE
Decide and document your proration policy for plan changes (and reflect it in Settings copy). - NOT STARTED

## PRODUCT FEATURES COMPLETED:
- Complete onboarding checklist system - DONE
- Template system with 6 professional templates - DONE
- Customer session tracking with real-time progress - DONE
- Shareable customer links with unique tokens - DONE
- Brand customization (colors, fonts, logos) - DONE
- Public checklist submission flow - DONE
- Progress tracking and analytics dashboard - DONE
- Customer information collection - DONE
- Multiple step types (checkbox, text, textarea, file upload, url, email) - DONE
- Concurrent editing notifications - DONE
- Session management and cleanup - DONE

## REMAINING WORK:
- Stripe Customer Portal integration for subscription management
- Plan upgrade/downgrade functionality
- Basic vs Pro feature gating
- Email notifications via Resend API
- Analytics tracking
- Proration policy documentation