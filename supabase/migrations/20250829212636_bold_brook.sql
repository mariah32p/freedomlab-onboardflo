/*
  # Add payment issue tracking to subscriptions

  1. Schema Changes
    - Add `payment_issue_since` column to `stripe_subscriptions` table
    - This tracks when payment issues first started for grace period calculation

  2. Security
    - No RLS changes needed (existing policies cover new column)
*/

-- Add payment_issue_since column to track when payment issues started
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stripe_subscriptions' AND column_name = 'payment_issue_since'
  ) THEN
    ALTER TABLE stripe_subscriptions ADD COLUMN payment_issue_since timestamptz;
  END IF;
END $$;