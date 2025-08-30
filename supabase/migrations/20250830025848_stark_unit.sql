/*
  # Add link_name field to customer_sessions

  1. Schema Changes
    - Add `link_name` column to `customer_sessions` table
    - This stores the descriptive name given by the business owner when creating the link
    - Separate from the customer's actual name for better tracking

  2. Purpose
    - Helps business owners identify different customer links in submissions dashboard
    - Examples: "Sarah from TechCorp", "Q1 Onboarding Batch", "Enterprise Demo"
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'customer_sessions' AND column_name = 'link_name'
  ) THEN
    ALTER TABLE customer_sessions ADD COLUMN link_name text DEFAULT '';
  END IF;
END $$;