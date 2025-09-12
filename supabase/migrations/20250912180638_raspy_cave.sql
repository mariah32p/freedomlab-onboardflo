-- Delete test users and all related data
-- This script handles the foreign key constraints properly

-- Method 1: Delete specific test emails
-- Replace with your actual test email addresses
DELETE FROM stripe_customers WHERE user_id IN (
  SELECT id FROM auth.users WHERE email IN (
    'test@example.com',
    'demo@example.com',
    'your-test-email@example.com'
  )
);

DELETE FROM auth.users WHERE email IN (
  'test@example.com', 
  'demo@example.com',
  'your-test-email@example.com'
);

-- Method 2: Delete all users (BE CAREFUL!)
-- Uncomment these lines if you want to delete ALL users
-- DELETE FROM stripe_customers;
-- DELETE FROM auth.users;

-- Method 3: Delete users created in the last hour (safer for testing)
-- Uncomment these lines to delete only recent test users
-- DELETE FROM stripe_customers WHERE user_id IN (
--   SELECT id FROM auth.users WHERE created_at > NOW() - INTERVAL '1 hour'
-- );
-- DELETE FROM auth.users WHERE created_at > NOW() - INTERVAL '1 hour';