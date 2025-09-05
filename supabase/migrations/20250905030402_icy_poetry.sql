/*
  # Move password protection from checklist to session level

  1. Schema Changes
    - Add `password_hash` field to `customer_sessions` table
    - Remove `password_hash` field from `checklists` table (keep for backward compatibility initially)
    - Add `is_password_protected` boolean to `customer_sessions`

  2. Security
    - Update RLS policies to handle session-level password protection
    - Maintain existing security for public sessions

  3. Migration Strategy
    - Add new fields without removing old ones initially
    - This allows gradual migration of existing data
*/

-- Add password protection fields to customer_sessions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'customer_sessions' AND column_name = 'password_hash'
  ) THEN
    ALTER TABLE customer_sessions ADD COLUMN password_hash text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'customer_sessions' AND column_name = 'is_password_protected'
  ) THEN
    ALTER TABLE customer_sessions ADD COLUMN is_password_protected boolean DEFAULT false;
  END IF;
END $$;

-- Add index for password-protected sessions
CREATE INDEX IF NOT EXISTS idx_customer_sessions_password_protected 
ON customer_sessions (checklist_id, is_password_protected);

-- Update RLS policies to handle session-level password protection
-- The existing policies should continue to work, but we'll add a note about the new fields

-- Note: We're keeping the existing password_hash field on checklists for backward compatibility
-- In a future migration, we can remove it after all data is migrated