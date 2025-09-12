-- OnboardFlo Database Cleanup Script
-- This will remove all data and reset the database to a fresh state

-- WARNING: This will delete ALL data including users, checklists, sessions, and subscription data
-- Only run this in development/testing environments

-- Clean up application data (in dependency order)
DELETE FROM email_send_log;
DELETE FROM secure_text_data;
DELETE FROM session_progress;
DELETE FROM customer_sessions;
DELETE FROM checklist_steps;
DELETE FROM checklists;
DELETE FROM user_branding;

-- Clean up Stripe data
DELETE FROM stripe_orders;
DELETE FROM stripe_subscriptions;
DELETE FROM stripe_customers;

-- Clean up auth data (this removes all users)
-- Note: This requires service role permissions
DELETE FROM auth.users;

-- Reset any sequences if needed
-- (PostgreSQL will handle this automatically for most cases)

-- Verify cleanup
SELECT 'Cleanup completed. Remaining data:' as status;
SELECT 'auth.users' as table_name, count(*) as remaining_rows FROM auth.users
UNION ALL
SELECT 'checklists', count(*) FROM checklists
UNION ALL
SELECT 'checklist_steps', count(*) FROM checklist_steps
UNION ALL
SELECT 'customer_sessions', count(*) FROM customer_sessions
UNION ALL
SELECT 'session_progress', count(*) FROM session_progress
UNION ALL
SELECT 'user_branding', count(*) FROM user_branding
UNION ALL
SELECT 'stripe_customers', count(*) FROM stripe_customers
UNION ALL
SELECT 'stripe_subscriptions', count(*) FROM stripe_subscriptions
UNION ALL
SELECT 'stripe_orders', count(*) FROM stripe_orders
UNION ALL
SELECT 'email_send_log', count(*) FROM email_send_log
UNION ALL
SELECT 'secure_text_data', count(*) FROM secure_text_data;