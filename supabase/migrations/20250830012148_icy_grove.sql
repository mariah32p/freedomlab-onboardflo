/*
  # Fix public checklist access

  1. Security Updates
    - Ensure anonymous users can read public checklists
    - Ensure anonymous users can read steps for public checklists
    - Ensure anonymous users can read branding for public checklist owners
    - Allow customer registration and progress tracking

  2. Notes
    - This fixes the issue where public checklists weren't accessible to anonymous users
    - Maintains security by only allowing access to public checklists
*/

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Public can read public checklists" ON checklists;
DROP POLICY IF EXISTS "Public read access for public checklists" ON checklists;

-- Create proper policy for public checklist access
CREATE POLICY "Anonymous can read public checklists"
  ON checklists
  FOR SELECT
  TO anon, authenticated
  USING (is_public = true);

-- Ensure the existing policies for steps and branding are working
-- These should already exist but let's make sure they're correct

-- For checklist steps
DROP POLICY IF EXISTS "Public can read steps for public checklists" ON checklist_steps;
DROP POLICY IF EXISTS "Public read access for public checklist steps" ON checklist_steps;

CREATE POLICY "Anonymous can read public checklist steps"
  ON checklist_steps
  FOR SELECT
  TO anon, authenticated
  USING (checklist_id IN (
    SELECT id FROM checklists 
    WHERE is_public = true
  ));

-- For user branding
DROP POLICY IF EXISTS "Public can read branding for public checklists" ON user_branding;

CREATE POLICY "Anonymous can read branding for public checklists"
  ON user_branding
  FOR SELECT
  TO anon, authenticated
  USING (user_id IN (
    SELECT user_id FROM checklists 
    WHERE is_public = true
  ));

-- Ensure customer registration works for public checklists
DROP POLICY IF EXISTS "Allow customer registration for public checklists" ON customers;

CREATE POLICY "Anonymous can register for public checklists"
  ON customers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (checklist_id IN (
    SELECT id FROM checklists 
    WHERE is_public = true
  ));

-- Ensure progress tracking works
DROP POLICY IF EXISTS "Customers can insert progress for public checklists" ON customer_progress;

CREATE POLICY "Anonymous can track progress for public checklists"
  ON customer_progress
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (customer_id IN (
    SELECT c.id FROM customers c
    JOIN checklists cl ON c.checklist_id = cl.id
    WHERE cl.is_public = true
  ));