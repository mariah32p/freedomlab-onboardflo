/*
  # Email tracking and business information updates

  1. Database Schema Updates
    - Add email tracking fields to customer_sessions table
    - Add business_name field to users table for email personalization
    - Add company_name field to user_branding table as fallback

  2. Security
    - Update RLS policies for new fields
    - Maintain existing security model

  3. Data Integrity
    - Use safe column additions with IF NOT EXISTS checks
    - Set appropriate default values
*/

-- Add business_name to users table (via auth.users metadata or separate field)
-- Since we can't modify auth.users directly, we'll use user_branding table

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_branding' AND column_name = 'business_name'
  ) THEN
    ALTER TABLE user_branding ADD COLUMN business_name text DEFAULT ''::text;
  END IF;
END $$;

-- Add email tracking fields to customer_sessions table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'customer_sessions' AND column_name = 'welcome_email_sent_at'
  ) THEN
    ALTER TABLE customer_sessions ADD COLUMN welcome_email_sent_at timestamptz DEFAULT NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'customer_sessions' AND column_name = 'reminder_email_sent_at'
  ) THEN
    ALTER TABLE customer_sessions ADD COLUMN reminder_email_sent_at timestamptz DEFAULT NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'customer_sessions' AND column_name = 'last_email_type'
  ) THEN
    ALTER TABLE customer_sessions ADD COLUMN last_email_type text DEFAULT NULL;
  END IF;
END $$;

-- Create email_send_log table for detailed tracking
CREATE TABLE IF NOT EXISTS email_send_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES customer_sessions(id) ON DELETE CASCADE,
  email_type text NOT NULL CHECK (email_type IN ('welcome', 'reminder')),
  recipient_emails text[] NOT NULL,
  sent_at timestamptz DEFAULT now(),
  sent_by uuid REFERENCES auth.users(id),
  success boolean DEFAULT true,
  error_message text DEFAULT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on email_send_log
ALTER TABLE email_send_log ENABLE ROW LEVEL SECURITY;

-- RLS policies for email_send_log
CREATE POLICY "Users can view email logs for own checklist sessions"
  ON email_send_log
  FOR SELECT
  TO authenticated
  USING (
    session_id IN (
      SELECT cs.id
      FROM customer_sessions cs
      JOIN checklists c ON cs.checklist_id = c.id
      WHERE c.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert email logs for own checklist sessions"
  ON email_send_log
  FOR INSERT
  TO authenticated
  WITH CHECK (
    session_id IN (
      SELECT cs.id
      FROM customer_sessions cs
      JOIN checklists c ON cs.checklist_id = c.id
      WHERE c.user_id = auth.uid()
    )
  );

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_send_log_session_id ON email_send_log(session_id);
CREATE INDEX IF NOT EXISTS idx_email_send_log_sent_at ON email_send_log(sent_at);
CREATE INDEX IF NOT EXISTS idx_customer_sessions_email_tracking ON customer_sessions(welcome_email_sent_at, reminder_email_sent_at);