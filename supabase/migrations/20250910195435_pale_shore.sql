/*
  # Fix user deletion cascade constraints

  1. Database Changes
    - Drop existing foreign key constraint on customer_sessions.link_created_by
    - Recreate with CASCADE DELETE to allow user deletion
    - Update email_send_log constraint to CASCADE DELETE as well

  2. Security
    - Maintains existing RLS policies
    - No changes to data access patterns

  3. Notes
    - This allows proper cleanup when deleting users
    - Prevents foreign key constraint violations
    - Ensures all user data is properly removed
*/

-- Fix customer_sessions.link_created_by foreign key to cascade delete
ALTER TABLE customer_sessions 
DROP CONSTRAINT IF EXISTS customer_sessions_link_created_by_fkey;

ALTER TABLE customer_sessions 
ADD CONSTRAINT customer_sessions_link_created_by_fkey 
FOREIGN KEY (link_created_by) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Fix email_send_log.sent_by foreign key to cascade delete
ALTER TABLE email_send_log 
DROP CONSTRAINT IF EXISTS email_send_log_sent_by_fkey;

ALTER TABLE email_send_log 
ADD CONSTRAINT email_send_log_sent_by_fkey 
FOREIGN KEY (sent_by) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Also update the reset script to handle nullable link_created_by
UPDATE customer_sessions 
SET link_created_by = NULL 
WHERE link_created_by IS NOT NULL;

UPDATE email_send_log 
SET sent_by = NULL 
WHERE sent_by IS NOT NULL;