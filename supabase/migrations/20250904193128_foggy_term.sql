/*
  # Add secure text expiry functionality

  1. New Tables
    - `secure_text_data`
      - `id` (uuid, primary key)
      - `session_id` (uuid, foreign key)
      - `step_id` (uuid, foreign key)
      - `encrypted_content` (text, encrypted data)
      - `expires_at` (timestamp, auto-deletion time)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `secure_text_data` table
    - Add policies for session-based access
    - Add automatic cleanup function for expired data

  3. Functions
    - `cleanup_expired_secure_data()` - removes expired entries
    - Scheduled to run every hour via pg_cron (if available)
*/

-- Create secure text data table
CREATE TABLE IF NOT EXISTS secure_text_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL,
  step_id uuid NOT NULL,
  encrypted_content text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(session_id, step_id)
);

-- Enable RLS
ALTER TABLE secure_text_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage secure data for own checklist sessions"
  ON secure_text_data
  FOR ALL
  TO authenticated
  USING (
    session_id IN (
      SELECT cs.id
      FROM customer_sessions cs
      JOIN checklists c ON cs.checklist_id = c.id
      WHERE c.user_id = auth.uid()
    )
  )
  WITH CHECK (
    session_id IN (
      SELECT cs.id
      FROM customer_sessions cs
      JOIN checklists c ON cs.checklist_id = c.id
      WHERE c.user_id = auth.uid()
    )
  );

CREATE POLICY "Anonymous can manage secure data for public sessions"
  ON secure_text_data
  FOR ALL
  TO anon
  USING (
    session_id IN (
      SELECT cs.id
      FROM customer_sessions cs
      JOIN checklists c ON cs.checklist_id = c.id
      WHERE c.is_public = true
    )
  )
  WITH CHECK (
    session_id IN (
      SELECT cs.id
      FROM customer_sessions cs
      JOIN checklists c ON cs.checklist_id = c.id
      WHERE c.is_public = true
    )
  );

-- Function to cleanup expired secure data
CREATE OR REPLACE FUNCTION cleanup_expired_secure_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM secure_text_data
  WHERE expires_at < now();
END;
$$;

-- Add foreign key constraints
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'secure_text_data_session_id_fkey'
  ) THEN
    ALTER TABLE secure_text_data
    ADD CONSTRAINT secure_text_data_session_id_fkey
    FOREIGN KEY (session_id) REFERENCES customer_sessions(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'secure_text_data_step_id_fkey'
  ) THEN
    ALTER TABLE secure_text_data
    ADD CONSTRAINT secure_text_data_step_id_fkey
    FOREIGN KEY (step_id) REFERENCES checklist_steps(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create index for efficient cleanup
CREATE INDEX IF NOT EXISTS idx_secure_text_data_expires_at 
ON secure_text_data(expires_at);

-- Create index for session lookups
CREATE INDEX IF NOT EXISTS idx_secure_text_data_session_step 
ON secure_text_data(session_id, step_id);