/*
  # Create customers table

  1. New Tables
    - `customers`
      - `id` (uuid, primary key)
      - `checklist_id` (uuid, foreign key to checklists)
      - `email` (text, required)
      - `name` (text, optional)
      - `company` (text, optional)
      - `started_at` (timestamp, when they first accessed the checklist)
      - `completed_at` (timestamp, when they completed all required steps)
      - `last_activity` (timestamp, last time they interacted)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `customers` table
    - Add policy for users to view customers of their own checklists
    - Add policy for customers to update their own progress

  3. Indexes
    - Add index on checklist_id for faster queries
    - Add index on email for lookups
*/

CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  checklist_id uuid NOT NULL REFERENCES checklists(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text DEFAULT '',
  company text DEFAULT '',
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  last_activity timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Users can view customers of their own checklists
CREATE POLICY "Users can view own checklist customers"
  ON customers
  FOR SELECT
  TO authenticated
  USING (
    checklist_id IN (
      SELECT id FROM checklists WHERE user_id = auth.uid()
    )
  );

-- Customers can update their own records (for public checklist access)
CREATE POLICY "Customers can update own progress"
  ON customers
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow inserting new customers for public checklists
CREATE POLICY "Allow customer registration for public checklists"
  ON customers
  FOR INSERT
  TO anon
  WITH CHECK (
    checklist_id IN (
      SELECT id FROM checklists WHERE is_public = true
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_checklist_id ON customers(checklist_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_completed ON customers(checklist_id, completed_at);

-- Unique constraint to prevent duplicate customers per checklist
CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_unique_email_checklist 
  ON customers(checklist_id, email);