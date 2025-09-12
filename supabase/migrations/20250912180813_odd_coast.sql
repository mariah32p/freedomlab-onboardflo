-- First, let's delete the Stripe customer records manually
DELETE FROM stripe_customers WHERE user_id IN (
  SELECT id FROM auth.users WHERE email IN (
    'your-test-email@example.com',
    'another-test@example.com'
    -- Add more test emails here
  )
);

-- Then delete the auth users
DELETE FROM auth.users WHERE email IN (
  'your-test-email@example.com',
  'another-test@example.com'
  -- Add more test emails here
);

-- Now let's fix the foreign key constraint to CASCADE properly for future deletions
-- First drop the existing constraint
ALTER TABLE stripe_customers DROP CONSTRAINT IF EXISTS stripe_customers_user_id_fkey;

-- Add it back with CASCADE
ALTER TABLE stripe_customers 
ADD CONSTRAINT stripe_customers_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Verify the constraint is now set to CASCADE
SELECT 
  tc.constraint_name, 
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  rc.delete_rule
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
JOIN information_schema.referential_constraints AS rc
  ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'stripe_customers'
  AND kcu.column_name = 'user_id';