/*
  # Create checklists table

  1. New Tables
    - `checklists`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text, required)
      - `description` (text, optional)
      - `is_public` (boolean, default true)
      - `password_hash` (text, optional for password protection)
      - `brand_color` (text, hex color code)
      - `logo_url` (text, optional)
      - `completion_page_content` (text, custom completion message)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `checklists` table
    - Add policy for users to manage their own checklists
    - Add policy for public access to public checklists
*/

CREATE TABLE IF NOT EXISTS checklists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  is_public boolean DEFAULT true,
  password_hash text,
  brand_color text DEFAULT '#10b981',
  logo_url text,
  completion_page_content text DEFAULT 'Congratulations! You have successfully completed the onboarding process.',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE checklists ENABLE ROW LEVEL SECURITY;

-- Users can manage their own checklists
CREATE POLICY "Users can manage own checklists"
  ON checklists
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Public read access for public checklists (for customer-facing pages)
CREATE POLICY "Public read access for public checklists"
  ON checklists
  FOR SELECT
  TO anon
  USING (is_public = true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_checklists_updated_at
  BEFORE UPDATE ON checklists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();