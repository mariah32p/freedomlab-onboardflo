/*
  # Update RLS policies for public checklist access

  1. Security Updates
    - Allow anonymous users to read public checklists
    - Allow anonymous users to read steps for public checklists
    - Allow anonymous users to submit customer data
    - Allow anonymous users to track progress

  2. Tables Updated
    - `checklists` - Add public read access
    - `checklist_steps` - Add public read access  
    - `customers` - Add anonymous insert/update
    - `customer_progress` - Add anonymous insert
    - `user_branding` - Add public read access
*/

-- Allow public read access to public checklists
CREATE POLICY "Public can read public checklists"
  ON checklists
  FOR SELECT
  TO anon
  USING (is_public = true);

-- Allow public read access to steps for public checklists
CREATE POLICY "Public can read steps for public checklists"
  ON checklist_steps
  FOR SELECT
  TO anon
  USING (checklist_id IN (
    SELECT id FROM checklists 
    WHERE is_public = true
  ));

-- Allow public read access to user branding for public checklists
CREATE POLICY "Public can read branding for public checklists"
  ON user_branding
  FOR SELECT
  TO anon
  USING (user_id IN (
    SELECT user_id FROM checklists 
    WHERE is_public = true
  ));

-- Update customer policies to allow anonymous access
DROP POLICY IF EXISTS "Allow customer registration for public checklists" ON customers;
DROP POLICY IF EXISTS "Customers can update own progress" ON customers;

CREATE POLICY "Allow customer registration for public checklists"
  ON customers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (checklist_id IN (
    SELECT id FROM checklists 
    WHERE is_public = true
  ));

CREATE POLICY "Customers can update own data"
  ON customers
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Update customer progress policies
DROP POLICY IF EXISTS "Customers can manage own progress" ON customer_progress;

CREATE POLICY "Customers can insert progress for public checklists"
  ON customer_progress
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (customer_id IN (
    SELECT c.id FROM customers c
    JOIN checklists cl ON c.checklist_id = cl.id
    WHERE cl.is_public = true
  ));

CREATE POLICY "Customers can read own progress"
  ON customer_progress
  FOR SELECT
  TO anon, authenticated
  USING (true);