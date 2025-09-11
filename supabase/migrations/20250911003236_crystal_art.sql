/*
  # Database Cleanup: Remove Duplicate Customer Tables

  This migration removes the old customer tracking system that's conflicting with the current system.

  ## What this migration does:
  1. **Removes Old Tables**
     - `customers` table (replaced by `customer_sessions`)
     - `customer_progress` table (replaced by `session_progress`)
  
  2. **Keeps Current System**
     - `customer_sessions` table (current customer tracking)
     - `session_progress` table (current progress tracking)
     - All related tables (`email_send_log`, `secure_text_data`)

  ## Why this is safe:
  - The old `customers` table is not used by the current application
  - All functionality has been moved to `customer_sessions`
  - This removes the conflicting foreign key relationships
*/

-- Drop the old customer progress table first (has foreign keys)
DROP TABLE IF EXISTS customer_progress CASCADE;

-- Drop the old customers table
DROP TABLE IF EXISTS customers CASCADE;

-- Verify our current system is intact
-- (These should all exist and work properly)
SELECT 'customer_sessions table exists' as status 
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'customer_sessions');

SELECT 'session_progress table exists' as status 
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'session_progress');

SELECT 'email_send_log table exists' as status 
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'email_send_log');

SELECT 'secure_text_data table exists' as status 
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'secure_text_data');