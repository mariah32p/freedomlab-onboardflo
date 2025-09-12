-- Delete test users from Supabase Auth
-- Replace the email addresses below with the ones you want to delete

-- Method 1: Delete specific users by email
DELETE FROM auth.users WHERE email IN (
  'test@example.com',
  'demo@example.com',
  'your-test-email@example.com'
);

-- Method 2: Delete all users (use with caution!)
-- Uncomment the line below if you want to delete ALL users
-- DELETE FROM auth.users;

-- Method 3: Delete users created in the last hour (for recent test accounts)
-- Uncomment the lines below to delete recent test accounts
-- DELETE FROM auth.users 
-- WHERE created_at > NOW() - INTERVAL '1 hour';

-- Method 4: Delete users with specific email patterns
-- Uncomment and modify as needed
-- DELETE FROM auth.users WHERE email LIKE '%test%';
-- DELETE FROM auth.users WHERE email LIKE '%demo%';

-- Note: Due to foreign key constraints, related data in your app tables
-- (stripe_customers, user_branding, etc.) should be automatically deleted
-- thanks to the CASCADE delete rules in your schema.