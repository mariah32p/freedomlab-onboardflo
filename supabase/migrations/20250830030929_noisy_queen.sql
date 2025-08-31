/*
  # Add submission status tracking

  1. Changes
    - Add `submission_status` field to track link lifecycle
    - Add `link_created_at` to track when business owner created the link
    - Add `link_created_by` to track who created the link

  2. Status Values
    - `pending`: Link created but customer hasn't started
    - `started`: Customer began the checklist
    - `completed`: Customer finished all steps
    - `abandoned`: Customer started but didn't finish (inactive for 7+ days)
*/

DO $$
BEGIN
  -- Add submission_status enum if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'submission_status') THEN
    CREATE TYPE submission_status AS ENUM ('pending', 'started', 'completed', 'abandoned');
  END IF;
END $$;

DO $$
BEGIN
  -- Add submission_status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'customer_sessions' AND column_name = 'submission_status'
  ) THEN
    ALTER TABLE customer_sessions ADD COLUMN submission_status submission_status DEFAULT 'pending';
  END IF;
END $$;

DO $$
BEGIN
  -- Add link_created_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'customer_sessions' AND column_name = 'link_created_at'
  ) THEN
    ALTER TABLE customer_sessions ADD COLUMN link_created_at timestamptz DEFAULT now();
  END IF;
END $$;

DO $$
BEGIN
  -- Add link_created_by column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'customer_sessions' AND column_name = 'link_created_by'
  ) THEN
    ALTER TABLE customer_sessions ADD COLUMN link_created_by uuid REFERENCES auth.users(id);
  END IF;
END $$;

-- Update existing sessions to have proper status
UPDATE customer_sessions 
SET submission_status = CASE 
  WHEN completed_at IS NOT NULL THEN 'completed'::submission_status
  WHEN started_at IS NOT NULL THEN 'started'::submission_status
  ELSE 'pending'::submission_status
END
WHERE submission_status IS NULL;