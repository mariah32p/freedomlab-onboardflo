/*
  # Add support for multiple emails in customer sessions

  1. Schema Changes
    - Add `session_name` column for custom session naming
    - Add `session_description` column for session descriptions  
    - Add `session_emails` column for comma-separated email list
    - Keep existing `email` column for backward compatibility

  2. Security
    - No RLS changes needed - existing policies cover new columns
*/

-- Add new columns to customer_sessions table
DO $$
BEGIN
  -- Add session_name column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'customer_sessions' AND column_name = 'session_name'
  ) THEN
    ALTER TABLE customer_sessions ADD COLUMN session_name text DEFAULT '';
  END IF;

  -- Add session_description column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'customer_sessions' AND column_name = 'session_description'
  ) THEN
    ALTER TABLE customer_sessions ADD COLUMN session_description text DEFAULT '';
  END IF;

  -- Add session_emails column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'customer_sessions' AND column_name = 'session_emails'
  ) THEN
    ALTER TABLE customer_sessions ADD COLUMN session_emails text DEFAULT '';
  END IF;
END $$;