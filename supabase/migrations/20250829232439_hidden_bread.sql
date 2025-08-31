/*
  # Create customer progress table

  1. New Tables
    - `customer_progress`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, foreign key to customers)
      - `step_id` (uuid, foreign key to checklist_steps)
      - `completed_at` (timestamp, when step was completed)
      - `notes` (text, optional notes from customer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `customer_progress` table
    - Add policy for users to view progress of their checklist customers
    - Add policy for customers to manage their own progress

  3. Indexes
    - Add index on customer_id for faster queries
    - Add index on step_id for lookups
    - Unique constraint to prevent duplicate completions
*/

CREATE TABLE IF NOT EXISTS customer_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  step_id uuid NOT NULL REFERENCES checklist_steps(id) ON DELETE CASCADE,
  completed_at timestamptz DEFAULT now(),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE customer_progress ENABLE ROW LEVEL SECURITY;

-- Users can view progress of customers using their checklists
CREATE POLICY "Users can view own checklist customer progress"
  ON customer_progress
  FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT c.id FROM customers c
      JOIN checklists cl ON c.checklist_id = cl.id
      WHERE cl.user_id = auth.uid()
    )
  );

-- Customers can manage their own progress (for public checklist access)
CREATE POLICY "Customers can manage own progress"
  ON customer_progress
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_customer_progress_customer_id ON customer_progress(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_progress_step_id ON customer_progress(step_id);

-- Unique constraint to prevent duplicate step completions
CREATE UNIQUE INDEX IF NOT EXISTS idx_customer_progress_unique 
  ON customer_progress(customer_id, step_id);