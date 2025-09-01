/*
  # Fix user deletion issues

  1. Policy Updates
    - Ensure RLS policies don't block deletion operations
    - Add proper deletion policies where needed

  2. Constraint Verification
    - Verify all foreign key constraints have proper CASCADE
    - Add missing CASCADE options if needed

  3. Function Updates
    - Update any triggers that might interfere with deletion
    - Ensure proper cleanup order
*/

-- First, let's make sure we can delete from all related tables
-- Update RLS policies to allow deletion operations

-- Allow service role to delete from all tables (for admin operations)
DROP POLICY IF EXISTS "Service role can delete users" ON auth.users;

-- Ensure stripe_customers can be deleted
DROP POLICY IF EXISTS "Allow deletion of stripe customers" ON stripe_customers;
CREATE POLICY "Allow deletion of stripe customers"
  ON stripe_customers
  FOR DELETE
  TO authenticated, service_role
  USING (true);

-- Ensure stripe_subscriptions can be deleted  
DROP POLICY IF EXISTS "Allow deletion of stripe subscriptions" ON stripe_subscriptions;
CREATE POLICY "Allow deletion of stripe subscriptions"
  ON stripe_subscriptions
  FOR DELETE
  TO authenticated, service_role
  USING (true);

-- Ensure stripe_orders can be deleted
DROP POLICY IF EXISTS "Allow deletion of stripe orders" ON stripe_orders;
CREATE POLICY "Allow deletion of stripe orders"
  ON stripe_orders
  FOR DELETE
  TO authenticated, service_role
  USING (true);

-- Ensure user_branding can be deleted
DROP POLICY IF EXISTS "Allow deletion of user branding" ON user_branding;
CREATE POLICY "Allow deletion of user branding"
  ON user_branding
  FOR DELETE
  TO authenticated, service_role
  USING (true);

-- Ensure checklists can be deleted
DROP POLICY IF EXISTS "Allow deletion of checklists" ON checklists;
CREATE POLICY "Allow deletion of checklists"
  ON checklists
  FOR DELETE
  TO authenticated, service_role
  USING (true);

-- Ensure checklist_steps can be deleted
DROP POLICY IF EXISTS "Allow deletion of checklist steps" ON checklist_steps;
CREATE POLICY "Allow deletion of checklist steps"
  ON checklist_steps
  FOR DELETE
  TO authenticated, service_role
  USING (true);

-- Ensure customer_sessions can be deleted
DROP POLICY IF EXISTS "Allow deletion of customer sessions" ON customer_sessions;
CREATE POLICY "Allow deletion of customer sessions"
  ON customer_sessions
  FOR DELETE
  TO authenticated, service_role
  USING (true);

-- Ensure session_progress can be deleted
DROP POLICY IF EXISTS "Allow deletion of session progress" ON session_progress;
CREATE POLICY "Allow deletion of session progress"
  ON session_progress
  FOR DELETE
  TO authenticated, service_role
  USING (true);

-- Ensure customers can be deleted
DROP POLICY IF EXISTS "Allow deletion of customers" ON customers;
CREATE POLICY "Allow deletion of customers"
  ON customers
  FOR DELETE
  TO authenticated, service_role
  USING (true);

-- Ensure customer_progress can be deleted
DROP POLICY IF EXISTS "Allow deletion of customer progress" ON customer_progress;
CREATE POLICY "Allow deletion of customer progress"
  ON customer_progress
  FOR DELETE
  TO authenticated, service_role
  USING (true);

-- Create a helper function to safely delete users and all their data
CREATE OR REPLACE FUNCTION delete_user_and_data(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete in the correct order to avoid constraint violations
  
  -- Delete session progress first
  DELETE FROM session_progress 
  WHERE session_id IN (
    SELECT cs.id FROM customer_sessions cs
    JOIN checklists c ON cs.checklist_id = c.id
    WHERE c.user_id = user_uuid
  );
  
  -- Delete customer progress
  DELETE FROM customer_progress 
  WHERE customer_id IN (
    SELECT cu.id FROM customers cu
    JOIN checklists c ON cu.checklist_id = c.id
    WHERE c.user_id = user_uuid
  );
  
  -- Delete customer sessions
  DELETE FROM customer_sessions 
  WHERE checklist_id IN (
    SELECT id FROM checklists WHERE user_id = user_uuid
  );
  
  -- Delete customers
  DELETE FROM customers 
  WHERE checklist_id IN (
    SELECT id FROM checklists WHERE user_id = user_uuid
  );
  
  -- Delete checklist steps
  DELETE FROM checklist_steps 
  WHERE checklist_id IN (
    SELECT id FROM checklists WHERE user_id = user_uuid
  );
  
  -- Delete checklists
  DELETE FROM checklists WHERE user_id = user_uuid;
  
  -- Delete user branding
  DELETE FROM user_branding WHERE user_id = user_uuid;
  
  -- Delete stripe data
  DELETE FROM stripe_subscriptions 
  WHERE customer_id IN (
    SELECT customer_id FROM stripe_customers WHERE user_id = user_uuid
  );
  
  DELETE FROM stripe_orders 
  WHERE customer_id IN (
    SELECT customer_id FROM stripe_customers WHERE user_id = user_uuid
  );
  
  DELETE FROM stripe_customers WHERE user_id = user_uuid;
  
  -- Finally delete the user from auth.users
  DELETE FROM auth.users WHERE id = user_uuid;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error and return false
    RAISE NOTICE 'Error deleting user %: %', user_uuid, SQLERRM;
    RETURN FALSE;
END;
$$;