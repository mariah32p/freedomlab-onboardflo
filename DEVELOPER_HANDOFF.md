# OnboardFlo - Developer Handoff Documentation

## Overview
OnboardFlo is a SaaS platform that helps businesses create trackable customer onboarding checklists. Customers complete step-by-step processes without needing accounts, while business owners track progress in real-time.

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for development and building
- **React Router** for client-side routing
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Montserrat** font family

### Backend & Infrastructure
- **Supabase** (PostgreSQL + Auth + Real-time + Storage + Edge Functions)
- **Stripe** for payments and subscriptions
- **Resend** for transactional emails
- **Netlify** for hosting

## Authentication System

### User Registration & Login
- **Email/password authentication** (no social login)
- **Email confirmation disabled** for faster onboarding
- **Password requirements**: 8+ chars, uppercase, lowercase, number
- **Password reset** via email with secure token

### Route Protection
- **Public routes**: `/`, `/pricing`, `/signup`, `/signin`, `/forgot-password`, `/demo`
- **Protected routes**: All others require authentication
- **Subscription-based routing**: Users redirected based on subscription status

## Subscription & Payment System

### Plans
```typescript
Standard Plan ($29/month):
- Up to 3 active checklists
- Up to 50 customer submissions per month
- Basic branding (logo + colors)
- Shareable customer links

Pro Plan ($49/month):
- Unlimited checklists
- Unlimited customer submissions
- Advanced branding (logo, colors, fonts)
- Password-protected sessions
- Custom completion pages
```

### Trial System
- **7-day free trial** on all plans
- **Card required upfront** (collected via Stripe Checkout)
- **Full access during trial** (Pro-level features)
- **Auto-charge after trial** unless canceled

### Subscription States & User Experience

#### 1. No Subscription (`not_started`)
- **Route**: `/get-started`
- **Action**: Choose plan → Stripe Checkout → Start trial

#### 2. Trialing (`trialing`)
- **Route**: `/dashboard`
- **Features**: Full access to all features
- **UI**: Blue banner showing days remaining and charge date
- **Duration**: 7 days

#### 3. Active (`active`)
- **Route**: `/dashboard`
- **Features**: Based on plan (Standard vs Pro)
- **UI**: No banners, full access

#### 4. Past Due (`past_due`)
- **Grace Period**: 30 days from first payment failure
- **Within Grace**: Access to dashboard with orange payment banner
- **After Grace**: Redirect to `/get-started`
- **UI**: Orange banner with "Update Payment" button

#### 5. Canceled (`canceled`)
- **Route**: `/get-started`
- **Action**: Must choose new plan to regain access

### Payment Management
- **Stripe Customer Portal**: For payment method updates and cancellation
- **Plan Changes**: In-app upgrade/downgrade (creates new Checkout session)
- **Webhooks**: Handle all Stripe events for subscription state sync

## Core Features

### 1. Checklist Management

#### Checklist Structure
```typescript
interface Checklist {
  id: string;
  user_id: string;
  title: string;
  description: string;
  is_public: boolean; // Always true now (password moved to session level)
  brand_color: string;
  logo_url: string | null;
  completion_page_content: string;
  created_at: string;
  updated_at: string;
}
```

#### Step Types
1. **Checkbox**: Simple yes/no confirmation
2. **Text Input**: Short text responses
3. **Long Text (Textarea)**: Detailed descriptions
4. **File Upload**: Document collection with Supabase Storage
5. **Website URL**: Link collection with validation
6. **Email Address**: Email validation and collection
7. **Secure Text**: Encrypted data with expiration (1-168 hours)

#### Templates
6 professional templates included:
- Website Development Project
- E-commerce Store Development
- Custom Software Development
- Brand Identity Design
- SEO & Content Marketing
- Social Media Management
- Mobile App Development
- UI/UX Design
- Digital Marketing Campaign
- Business Consulting

### 2. Customer Session System

#### Session Structure
```typescript
interface CustomerSession {
  id: string;
  checklist_id: string;
  session_token: string; // 8-character unique identifier
  email: string;
  name: string;
  company: string;
  link_name: string; // Session name for organization
  session_description: string;
  session_emails: string; // Comma-separated recipient list
  submission_status: 'pending' | 'started' | 'completed' | 'abandoned';
  password_hash: string | null; // Session-level password protection
  is_password_protected: boolean;
  started_at: string;
  completed_at: string | null;
  last_activity: string;
  is_active: boolean;
  welcome_email_sent_at: string | null;
  reminder_email_sent_at: string | null;
  last_email_type: 'welcome' | 'reminder' | null;
  link_created_at: string;
  link_created_by: string;
  created_at: string;
}
```

#### Session Flow
1. **Create Session**: Business owner creates session with optional password
2. **Share Link**: `/c/{checklistId}/{sessionToken}`
3. **Customer Access**: 
   - If password-protected: Enter password
   - If public: Start immediately
4. **Complete Steps**: Progress auto-saved, real-time updates
5. **Completion**: Custom completion page with next steps

### 3. Real-time Features

#### Concurrent Editing
- **Live user indicators**: Show other active users on same checklist
- **Activity tracking**: 30-second heartbeat updates
- **Notifications**: Alert when others join the session
- **Auto-cleanup**: Mark sessions inactive when users leave

#### Progress Tracking
- **Real-time updates**: Progress synced across all viewers
- **Visual indicators**: Progress bars, completion percentages
- **Status tracking**: Pending → Started → Completed flow

### 4. Brand Customization

#### Branding Options
```typescript
interface UserBranding {
  logo_url: string | null;
  primary_color: string; // Default: #10b981
  secondary_color: string; // Default: #059669
  font_family: string; // Default: Montserrat
  business_name: string; // Used in emails and communications
}
```

#### Application
- **Customer-facing checklists**: Fully branded experience
- **Email communications**: Business name and branding
- **Completion pages**: Custom colors and messaging

### 5. Email System

#### Email Types
1. **Welcome Email**: Sent when session is created
2. **Reminder Email**: Sent to inactive customers

#### Email Features
- **Resend API integration** via Supabase Edge Function
- **Professional templates** with business branding
- **Multiple recipients** per session
- **Send tracking** with timeline display
- **Duplicate prevention** (buttons disable after sending)

#### Email Template Structure
```
Subject: [Business Name]: [Checklist Title] - [Action]
From: OnboardFlo by Freedom Lab <info@freedomlab.ai>
Content: Branded HTML with business name and session details
Footer: "Sent by [Business Name] via OnboardFlo"
```

## Feature Gating (To Be Implemented)

### Standard Plan Limits
- **Checklists**: Maximum 3 active
- **Submissions**: 50 per month
- **Branding**: Logo + colors only
- **Sessions**: Public only (no password protection)

### Pro Plan Features
- **Checklists**: Unlimited
- **Submissions**: Unlimited
- **Branding**: Full customization (fonts, business name)
- **Sessions**: Password protection available
- **Completion Pages**: Custom content

### Implementation Strategy
```typescript
// Check user's plan and limits
const { isPro, isTrialing } = getAccessStatus();

// During trial: Full access (Pro features)
if (isTrialing) {
  return { canCreate: true, canUseFeature: true };
}

// After trial: Enforce limits
if (isPro) {
  return { canCreate: true, canUseFeature: true };
} else {
  // Standard plan limits
  const checklistCount = await getActiveChecklistCount();
  const monthlySubmissions = await getMonthlySubmissionCount();
  
  return {
    canCreate: checklistCount < 3,
    canUsePasswordProtection: false,
    canCustomizeFonts: false,
    canSetBusinessName: false,
    canCustomizeCompletionPages: false,
    canCustomizeFonts: false,
    hasReachedSubmissionLimit: monthlySubmissions >= 50
  };
}
```

## Database Schema

### Core Tables
1. **checklists**: Checklist definitions
2. **checklist_steps**: Individual steps with types and options
3. **customer_sessions**: Customer session tracking (with passwords)
4. **session_progress**: Step completion tracking
5. **user_branding**: Brand customization settings
6. **email_send_log**: Email tracking and history

### Stripe Integration Tables
1. **stripe_customers**: User → Stripe customer mapping
2. **stripe_subscriptions**: Subscription state tracking
3. **stripe_orders**: One-time payment tracking

### Security
- **Row Level Security (RLS)** enabled on all tables
- **User isolation**: Users only see their own data
- **Public access**: Anonymous users can access public sessions
- **Session-based access**: Customers access via session tokens

## API Endpoints (Supabase Edge Functions)

### 1. Stripe Checkout (`/functions/v1/stripe-checkout`)
```typescript
POST /functions/v1/stripe-checkout
Headers: Authorization: Bearer {user_token}
Body: {
  price_id: string,
  mode: 'subscription' | 'payment',
  success_url: string,
  cancel_url: string
}
Response: { sessionId: string, url: string }
```

### 2. Stripe Webhook (`/functions/v1/stripe-webhook`)
```typescript
POST /functions/v1/stripe-webhook
Headers: stripe-signature: {webhook_signature}
Body: {Stripe webhook event}
Events Handled:
- checkout.session.completed
- customer.subscription.created/updated/deleted
- invoice.payment_failed
- invoice.payment_succeeded
```

### 3. Send Email (`/functions/v1/send-email`)
```typescript
POST /functions/v1/send-email
Headers: Authorization: Bearer {user_token}
Body: {
  type: 'welcome' | 'reminder',
  sessionId: string,
  recipientEmails: string[],
  sessionName?: string,
  businessName?: string,
  checklistTitle?: string,
  sessionUrl?: string
}
Response: { success: boolean, message: string }
```

## File Storage

### Supabase Storage
- **Bucket**: `customer-files`
- **Organization**: Files stored by session ID in folders
- **Security**: Public URLs for uploaded files
- **Fallback**: Filename tracking if storage fails
- **Validation**: File type and size limits

### File Upload Flow
1. **Validate**: Check file type and size
2. **Upload**: Store in Supabase Storage with unique filename
3. **Track**: Save file metadata in step progress
4. **Display**: Show uploaded files with download links

## Environment Variables

### Client-side (.env)
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Server-side (Supabase Edge Functions)
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
```

## Deployment

### Netlify Configuration
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Redirects**: SPA routing with `/*` → `/index.html`
- **Headers**: Security headers and CORS

### Supabase Edge Functions
- **Auto-deployment**: Functions deploy automatically when connected
- **CORS**: Properly configured for cross-origin requests
- **Error Handling**: Comprehensive error responses

## User Flows

### 1. Business Owner Onboarding
```
1. Visit landing page
2. Click "Start Free Trial"
3. Sign up with email/password
4. Choose plan (Standard/Pro)
5. Enter payment info (Stripe Checkout)
6. Redirected to dashboard (trial active)
7. Create first checklist
8. Generate customer sessions
9. Send welcome emails
```

### 2. Customer Onboarding
```
1. Receive email with session link
2. Click link → checklist page
3. Enter password (if session is protected)
4. Fill in basic info (name, email, company)
5. Complete checklist steps
6. See completion page with next steps
7. Business owner tracks progress in dashboard
```

### 3. Subscription Management
```
Trial → Active:
- Automatic charge after 7 days
- No user action required

Payment Issues:
- Stripe webhook updates status to past_due
- 30-day grace period with banner
- After 30 days: Redirect to /get-started

Cancellation:
- Via Stripe Customer Portal
- Immediate access loss
- Data retained for potential reactivation

Plan Changes:
- In-app upgrade/downgrade buttons
- New Stripe Checkout session (no trial)
- Immediate proration and access change
```

## Feature Implementation Status

### ✅ Complete Features
- User authentication and password reset
- Subscription management with trials
- Checklist CRUD operations
- 6 professional templates
- Multiple step types (7 types)
- Customer session management
- Real-time progress tracking
- Brand customization
- File upload system
- Email notifications (welcome/reminder)
- Session-level password protection
- Concurrent editing notifications
- Payment failure handling with grace period

### ⚠️ Partially Complete
- **Stripe Customer Portal**: Button exists but doesn't open portal
- **Feature Gating**: All features available regardless of plan
- **Plan Upgrade/Downgrade**: UI exists but functionality not implemented

### ❌ Not Implemented
- **Plan-specific feature restrictions**: All features currently available regardless of plan
- **Usage limit enforcement**: No limits on checklist count or submission limits
- **Feature gating implementation**: Standard vs Pro restrictions not enforced
- Analytics and reporting
- Advanced email automation
- Mobile app optimization
- SEO optimization

## Critical Business Logic

### Plan Feature Restrictions (To Be Implemented)
```typescript
// Standard Plan Restrictions
const STANDARD_LIMITS = {
  MAX_CHECKLISTS: 3,
  MAX_MONTHLY_SUBMISSIONS: 50,
  FEATURES: {
    PASSWORD_PROTECTION: false,
    FONT_CUSTOMIZATION: false,
    BUSINESS_NAME_BRANDING: false,
    CUSTOM_COMPLETION_PAGES: false
  }
};

// Pro Plan Features
const PRO_FEATURES = {
  UNLIMITED_CHECKLISTS: true,
  UNLIMITED_SUBMISSIONS: true,
  FULL_BRANDING: true,
  PASSWORD_PROTECTION: true,
  CUSTOM_COMPLETION_PAGES: true
};
```

### Subscription State Management
```typescript
// Route guard logic
if (!user) → '/signup'
if (status === 'trialing' || status === 'active') → '/dashboard'
if (status === 'past_due' && within 30 days) → '/dashboard' + payment banner
else → '/get-started'
```

### Feature Access Control
```typescript
// During trial: Full access
if (subscription.status === 'trialing') {
  return { hasFullAccess: true };
}

// After trial: Plan-based access
if (subscription.price_id === 'price_1RzrMYDn6VTzl81bTSgcl0ZA') {
  return { isPro: true, hasFullAccess: true };
} else {
  return { isPro: false, hasLimitedAccess: true };
}
```

### Session Security
```typescript
// Session access validation
if (session.is_password_protected) {
  // Require password for access
  if (providedPassword !== session.password_hash) {
    return 'Incorrect password';
  }
}

// Public sessions: No password required
// Private sessions: Password required
```

## Data Models

### User Journey Data
```sql
-- User creates account
INSERT INTO auth.users (email, password);

-- Stripe customer created
INSERT INTO stripe_customers (user_id, customer_id);

-- Subscription starts (trial)
INSERT INTO stripe_subscriptions (customer_id, status, price_id);

-- User creates checklist
INSERT INTO checklists (user_id, title, description);

-- User creates customer session
INSERT INTO customer_sessions (checklist_id, session_token, is_password_protected);

-- Customer completes steps
INSERT INTO session_progress (session_id, step_id, notes);
```

### Key Relationships
```sql
users (auth) → stripe_customers → stripe_subscriptions
users → checklists → checklist_steps
checklists → customer_sessions → session_progress
users → user_branding
customer_sessions → email_send_log
```

## Security Implementation

### Row Level Security (RLS)
```sql
-- Users can only access their own data
CREATE POLICY "Users can manage own checklists" ON checklists
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- Anonymous users can access public sessions
CREATE POLICY "Anonymous can access public sessions" ON customer_sessions
  FOR ALL TO anon, authenticated
  USING (checklist_id IN (
    SELECT id FROM checklists WHERE is_public = true
  ));
```

### Session Token Security
- **8-character alphanumeric tokens** (a-z, 0-9)
- **Unique per session**
- **No expiration** (sessions persist until deleted)
- **URL-safe** for sharing

### Password Protection
- **Session-level**: Each session can be individually protected
- **Simple hashing**: Direct storage (upgrade to bcrypt for production)
- **Optional**: Sessions can be public or protected

## Email System

### Email Templates
1. **Welcome Email**: Sent when session is created
2. **Reminder Email**: Sent to inactive customers

### Email Personalization
- **Business Name**: From user_branding.business_name
- **Checklist Title**: Specific checklist being completed
- **Session Details**: Custom session name and description
- **Branding**: Uses business colors and styling

### Email Tracking
```sql
-- Email send log
CREATE TABLE email_send_log (
  id uuid PRIMARY KEY,
  session_id uuid REFERENCES customer_sessions(id),
  email_type text CHECK (email_type IN ('welcome', 'reminder')),
  recipient_emails text[],
  sent_at timestamptz DEFAULT now(),
  sent_by uuid REFERENCES auth.users(id),
  success boolean DEFAULT true,
  error_message text
);
```

## File Management

### Upload System
- **Storage**: Supabase Storage (`customer-files` bucket)
- **Organization**: Files organized by session ID
- **Validation**: File type and size restrictions
- **Fallback**: Filename tracking if storage unavailable

### File Access
- **Public URLs**: For uploaded files
- **Signed URLs**: For private/temporary access
- **Download**: Direct download from storage

## Real-time Features

### Live Updates
```typescript
// Subscribe to session changes
supabase
  .channel(`checklist-${checklistId}`)
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'customer_sessions'
  }, handleSessionUpdate)
  .subscribe();
```

### Activity Tracking
- **Heartbeat**: 30-second activity updates
- **Presence**: Show active users on same checklist
- **Auto-cleanup**: Mark inactive after 5 minutes

## Error Handling

### Frontend Error Boundaries
- **Toast notifications**: For user-facing errors
- **Fallback UI**: When components fail
- **Retry mechanisms**: For failed API calls

### Backend Error Handling
- **Webhook idempotency**: Prevent duplicate processing
- **Database constraints**: Prevent invalid data
- **Graceful degradation**: Continue operation when services fail

## Performance Considerations

### Database Optimization
- **Indexes**: On frequently queried columns
- **Pagination**: For large datasets
- **Efficient queries**: Minimize N+1 problems

### Frontend Optimization
- **Code splitting**: Route-based chunks
- **Image optimization**: Proper sizing and formats
- **Caching**: Browser and CDN caching

## Monitoring & Analytics

### Key Metrics to Track
- **User Acquisition**: Signups, trial starts, conversions
- **Product Usage**: Checklists created, sessions completed
- **Revenue**: MRR, churn rate, upgrade/downgrade rates
- **Customer Success**: Completion rates, time to complete

### Error Monitoring
- **Frontend**: Browser errors and failed API calls
- **Backend**: Edge function errors and database issues
- **Payments**: Failed payments and webhook issues

## Development Workflow

### Local Development
```bash
# Start development server
npm run dev

# Environment setup
cp .env.example .env
# Add Supabase and Stripe credentials
```

### Database Migrations
```bash
# Migrations auto-apply when connected to Supabase
# Create new migration files in supabase/migrations/
# Use descriptive names without number prefixes
```

### Deployment
```bash
# Netlify deployment
npm run build
# Deploy to Netlify with environment variables
```

## Production Checklist

### Pre-Launch
- [ ] Set up production Supabase project
- [ ] Configure Stripe live keys
- [ ] Set up Resend API for emails
- [ ] Configure custom domain
- [ ] Set up error monitoring
- [ ] Test all user flows end-to-end

### Post-Launch Monitoring
- [ ] Monitor subscription webhooks
- [ ] Track email delivery rates
- [ ] Monitor database performance
- [ ] Watch for failed payments
- [ ] Track user engagement metrics

## Known Limitations & Technical Debt

### Current Limitations
1. **Password Hashing**: Simple storage (needs bcrypt)
2. **File Storage**: Basic implementation (needs CDN)
3. **Email Templates**: Static HTML (needs template engine)
4. **Analytics**: Basic tracking (needs comprehensive analytics)
5. **Mobile**: Responsive but not optimized for mobile apps

### Recommended Improvements
1. **Security**: Implement proper password hashing
2. **Performance**: Add Redis caching layer
3. **Monitoring**: Add comprehensive error tracking
4. **Testing**: Add unit and integration tests
5. **Documentation**: API documentation for integrations

## Integration Points

### Stripe Integration
- **Webhooks**: Handle all subscription lifecycle events
- **Customer Portal**: For self-service subscription management
- **Checkout**: For trial starts and plan changes

### Supabase Integration
- **Authentication**: User management and sessions
- **Database**: All application data with RLS
- **Storage**: File uploads and management
- **Edge Functions**: Serverless API endpoints
- **Real-time**: Live updates and presence

### Resend Integration
- **Transactional Emails**: Welcome and reminder emails
- **Templates**: HTML email templates with branding
- **Tracking**: Delivery and engagement metrics