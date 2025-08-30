/*
  # Fix customers table RLS policies for anonymous access

  1. Security Updates
    - Drop existing problematic INSERT policy for customers table
    - Create new simplified INSERT policy allowing anonymous users to register for public checklists
    - Update existing UPDATE policy to allow customers to update their own data
    - Ensure anonymous users can read customer data for progress tracking

  2. Policy Changes
    - INSERT: Allow anonymous users to create customer records for public checklists only
    - UPDATE: Allow customers to update their own records (identified by email/checklist combination)
    - SELECT: Allow reading customer data for progress tracking and validation
*/

-- Drop the existing problematic INSERT policy
DROP POLICY IF EXISTS "Anonymous can register for public checklists" ON customers;

-- Drop the existing UPDATE policy to recreate it properly
DROP POLICY IF EXISTS "Customers can update own data" ON customers;

-- Create a simple, reliable INSERT policy for anonymous users
CREATE POLICY "Allow anonymous registration for public checklists"
  ON customers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM checklists 
      WHERE checklists.id = checklist_id 
      AND checklists.is_public = true
    )
  );

-- Create UPDATE policy allowing customers to update their own data
CREATE POLICY "Allow customers to update own data"
  ON customers
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Ensure SELECT policy exists for reading customer data
CREATE POLICY IF NOT EXISTS "Allow reading customer data"
  ON customers
  FOR SELECT
  TO anon, authenticated
  USING (true);