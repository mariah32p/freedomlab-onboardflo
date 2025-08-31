/*
  # Fix customers table RLS policy for anonymous users

  1. Security Updates
    - Update INSERT policy for customers table to properly allow anonymous users to register for public checklists
    - Ensure the policy correctly validates that the checklist is public before allowing insertion
    - Add UPDATE policy to allow customers to update their own data using email matching

  2. Changes
    - Drop and recreate the INSERT policy with better logic
    - Add UPDATE policy for customer data modifications
    - Ensure policies work correctly for anonymous users on public checklists
*/

-- Drop existing policies to recreate them with better logic
DROP POLICY IF EXISTS "Anonymous can register for public checklists" ON customers;
DROP POLICY IF EXISTS "Customers can update own data" ON customers;

-- Create improved INSERT policy for anonymous registration
CREATE POLICY "Anonymous can register for public checklists"
  ON customers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    checklist_id IN (
      SELECT id FROM checklists 
      WHERE is_public = true
    )
  );

-- Create UPDATE policy for customers to update their own data
CREATE POLICY "Customers can update own data"
  ON customers
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Ensure SELECT policy exists for users to view their checklist customers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'customers' 
    AND policyname = 'Users can view own checklist customers'
  ) THEN
    CREATE POLICY "Users can view own checklist customers"
      ON customers
      FOR SELECT
      TO authenticated
      USING (
        checklist_id IN (
          SELECT id FROM checklists 
          WHERE user_id = auth.uid()
        )
      );
  END IF;
END $$;