-- Reset user script with proper constraint handling
-- Replace 'your-test-email@example.com' with the actual email you want to delete

DO $$
DECLARE
    user_uuid uuid;
    email_to_delete text := 'your-test-email@example.com';
BEGIN
    -- Get the user ID first
    SELECT id INTO user_uuid 
    FROM auth.users 
    WHERE email = email_to_delete;
    
    IF user_uuid IS NULL THEN
        RAISE NOTICE 'User with email % not found', email_to_delete;
        RETURN;
    END IF;
    
    RAISE NOTICE 'Found user with ID: %', user_uuid;
    
    -- Set link_created_by and sent_by to NULL to avoid constraint issues
    RAISE NOTICE 'Clearing foreign key references...';
    
    UPDATE customer_sessions 
    SET link_created_by = NULL 
    WHERE link_created_by = user_uuid;
    
    UPDATE email_send_log 
    SET sent_by = NULL 
    WHERE sent_by = user_uuid;
    
    RAISE NOTICE 'Cleared foreign key references';
    
    -- Now delete the user (this will cascade to other tables)
    DELETE FROM auth.users WHERE id = user_uuid;
    
    RAISE NOTICE 'Successfully deleted user: %', email_to_delete;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error occurred: %', SQLERRM;
        RAISE;
END $$;