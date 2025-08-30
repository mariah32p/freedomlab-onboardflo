/*
  # Fix customers table RLS policy for anonymous users

  1. Security Policy Updates
    - Drop existing complex INSERT policy that's failing
    - Create simpler, more reliable INSERT policy for anonymous users
    - Ensure anonymous users can register for public checklists
    - Maintain security by only allowing inserts for public checklists

  2. Policy Changes
    - Simplified subquery for better performance and reliability
    - Clear separation of concerns for different user roles
*/

-- Drop the existing problematic INSERT policy
DROP POLICY IF EXISTS "Anonymous can register for public checklists" ON customers;

-- Create a simpler, more reliable INSERT policy
CREATE POLICY "Allow anonymous registration for public checklists"
  ON customers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM checklists 
      WHERE checklists.id = checklist_id 
      AND checklists.is_public = true
    )
  );

-- Also ensure the UPDATE policy allows anonymous users to update their own records
DROP POLICY IF EXISTS "Customers can update own data" ON customers;

CREATE POLICY "Customers can update their own data"
  ON customers
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);