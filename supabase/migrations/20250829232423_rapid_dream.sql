/*
  # Create checklist steps table

  1. New Tables
    - `checklist_steps`
      - `id` (uuid, primary key)
      - `checklist_id` (uuid, foreign key to checklists)
      - `title` (text, required)
      - `description` (text, optional)
      - `order_index` (integer, for step ordering)
      - `is_required` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `checklist_steps` table
    - Add policy for users to manage steps of their own checklists
    - Add policy for public read access to steps of public checklists

  3. Indexes
    - Add index on checklist_id for faster queries
    - Add index on order_index for sorting
*/

CREATE TABLE IF NOT EXISTS checklist_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  checklist_id uuid NOT NULL REFERENCES checklists(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  order_index integer NOT NULL DEFAULT 0,
  is_required boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE checklist_steps ENABLE ROW LEVEL SECURITY;

-- Users can manage steps of their own checklists
CREATE POLICY "Users can manage own checklist steps"
  ON checklist_steps
  FOR ALL
  TO authenticated
  USING (
    checklist_id IN (
      SELECT id FROM checklists WHERE user_id = auth.uid()
    )
  );

-- Public read access for steps of public checklists
CREATE POLICY "Public read access for public checklist steps"
  ON checklist_steps
  FOR SELECT
  TO anon
  USING (
    checklist_id IN (
      SELECT id FROM checklists WHERE is_public = true
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_checklist_steps_checklist_id ON checklist_steps(checklist_id);
CREATE INDEX IF NOT EXISTS idx_checklist_steps_order ON checklist_steps(checklist_id, order_index);

-- Create updated_at trigger
CREATE TRIGGER update_checklist_steps_updated_at
  BEFORE UPDATE ON checklist_steps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();