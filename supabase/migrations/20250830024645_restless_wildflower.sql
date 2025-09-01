/*
  # Add Customer Sessions for Unique Progress Tracking

  1. New Tables
    - `customer_sessions`
      - `id` (uuid, primary key)
      - `checklist_id` (uuid, foreign key to checklists)
      - `session_token` (text, unique 8-character token)
      - `email` (text, customer email)
      - `name` (text, customer name)
      - `company` (text, customer company)
      - `started_at` (timestamp)
      - `completed_at` (timestamp, nullable)
      - `last_activity` (timestamp)
      - `is_active` (boolean, for concurrent editing detection)
      - `created_at` (timestamp)

    - `session_progress`
      - `id` (uuid, primary key)
      - `session_id` (uuid, foreign key to customer_sessions)
      - `step_id` (uuid, foreign key to checklist_steps)
      - `completed_at` (timestamp)
      - `notes` (text, for storing step responses)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Allow anonymous access for public checklists
    - Allow authenticated users to manage their own checklist sessions

  3. Indexes
    - Unique index on session_token
    - Index on checklist_id for performance
    - Composite index on session_id + step_id for progress queries
*/

-- Create customer_sessions table
CREATE TABLE IF NOT EXISTS customer_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  checklist_id uuid NOT NULL REFERENCES checklists(id) ON DELETE CASCADE,
  session_token text UNIQUE NOT NULL,
  email text NOT NULL,
  name text DEFAULT '',
  company text DEFAULT '',
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  last_activity timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create session_progress table
CREATE TABLE IF NOT EXISTS session_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES customer_sessions(id) ON DELETE CASCADE,
  step_id uuid NOT NULL REFERENCES checklist_steps(id) ON DELETE CASCADE,
  completed_at timestamptz DEFAULT now(),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  UNIQUE(session_id, step_id)
);

-- Enable RLS
ALTER TABLE customer_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for customer_sessions
CREATE POLICY "Anonymous can access sessions for public checklists"
  ON customer_sessions
  FOR ALL
  TO anon, authenticated
  USING (
    checklist_id IN (
      SELECT id FROM checklists WHERE is_public = true
    )
  )
  WITH CHECK (
    checklist_id IN (
      SELECT id FROM checklists WHERE is_public = true
    )
  );

CREATE POLICY "Users can manage sessions for own checklists"
  ON customer_sessions
  FOR ALL
  TO authenticated
  USING (
    checklist_id IN (
      SELECT id FROM checklists WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    checklist_id IN (
      SELECT id FROM checklists WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for session_progress
CREATE POLICY "Anonymous can manage progress for public sessions"
  ON session_progress
  FOR ALL
  TO anon, authenticated
  USING (
    session_id IN (
      SELECT cs.id FROM customer_sessions cs
      JOIN checklists c ON cs.checklist_id = c.id
      WHERE c.is_public = true
    )
  )
  WITH CHECK (
    session_id IN (
      SELECT cs.id FROM customer_sessions cs
      JOIN checklists c ON cs.checklist_id = c.id
      WHERE c.is_public = true
    )
  );

CREATE POLICY "Users can view progress for own checklist sessions"
  ON session_progress
  FOR SELECT
  TO authenticated
  USING (
    session_id IN (
      SELECT cs.id FROM customer_sessions cs
      JOIN checklists c ON cs.checklist_id = c.id
      WHERE c.user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_customer_sessions_checklist_id ON customer_sessions(checklist_id);
CREATE INDEX IF NOT EXISTS idx_customer_sessions_token ON customer_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_customer_sessions_active ON customer_sessions(checklist_id, is_active, last_activity);
CREATE INDEX IF NOT EXISTS idx_session_progress_session_id ON session_progress(session_id);
CREATE INDEX IF NOT EXISTS idx_session_progress_step_id ON session_progress(step_id);

-- Function to generate session tokens
CREATE OR REPLACE FUNCTION generate_session_token()
RETURNS text AS $$
DECLARE
  chars text := 'abcdefghijklmnopqrstuvwxyz0123456789';
  result text := '';
  i integer;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to update last_activity automatically
CREATE OR REPLACE FUNCTION update_session_activity()
RETURNS trigger AS $$
BEGIN
  UPDATE customer_sessions 
  SET last_activity = now(), is_active = true
  WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update activity on progress changes
CREATE TRIGGER update_session_activity_trigger
  AFTER INSERT OR UPDATE ON session_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_session_activity();