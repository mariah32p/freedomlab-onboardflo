/*
  # Add step_type column to checklist_steps

  1. Schema Changes
    - Add `step_type` column to `checklist_steps` table
    - Set default value to 'checkbox' for existing steps
    - Add `options` column for step-specific configuration

  2. Data Migration
    - Update existing steps to have default step_type of 'checkbox'
    - Ensure all steps have proper step_type values

  3. Security
    - No RLS changes needed (inherits from existing policies)
*/

-- Add step_type column with default value
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'checklist_steps' AND column_name = 'step_type'
  ) THEN
    ALTER TABLE checklist_steps ADD COLUMN step_type text DEFAULT 'checkbox' NOT NULL;
  END IF;
END $$;

-- Add options column for step configuration
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'checklist_steps' AND column_name = 'options'
  ) THEN
    ALTER TABLE checklist_steps ADD COLUMN options text;
  END IF;
END $$;

-- Update existing steps to have checkbox type
UPDATE checklist_steps 
SET step_type = 'checkbox' 
WHERE step_type IS NULL OR step_type = '';