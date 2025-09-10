-- Reset user script with proper foreign key handling
-- Replace 'your-test-email@example.com' with the actual email address

DO $$
DECLARE
    user_uuid uuid;
    user_email text := 'your-test-email@example.com'; -- CHANGE THIS EMAIL
BEGIN
    -- Get the user ID
    SELECT id INTO user_uuid 
    FROM auth.users 
    WHERE email = user_email;
    
    IF user_uuid IS NULL THEN
        RAISE NOTICE 'User with email % not found', user_email;
        RETURN;
    END IF;
    
    RAISE NOTICE 'Found user % with ID %', user_email, user_uuid;
    
    -- Clear link_created_by references in customer_sessions
    RAISE NOTICE 'Clearing customer_sessions.link_created_by references...';
    UPDATE customer_sessions 
    SET link_created_by = NULL 
    WHERE link_created_by = user_uuid;
    
    -- Clear sent_by references in email_send_log
    RAISE NOTICE 'Clearing email_send_log.sent_by references...';
    UPDATE email_send_log 
    SET sent_by = NULL 
    WHERE sent_by = user_uuid;
    
    -- Delete session progress for user's sessions
    RAISE NOTICE 'Deleting session progress...';
    DELETE FROM session_progress 
    WHERE session_id IN (
        SELECT cs.id 
        FROM customer_sessions cs
        JOIN checklists c ON cs.checklist_id = c.id
        WHERE c.user_id = user_uuid
    );
    
    -- Delete secure text data for user's sessions
    RAISE NOTICE 'Deleting secure text data...';
    DELETE FROM secure_text_data 
    WHERE session_id IN (
        SELECT cs.id 
        FROM customer_sessions cs
        JOIN checklists c ON cs.checklist_id = c.id
        WHERE c.user_id = user_uuid
    );
    
    -- Delete email send logs for user's sessions
    RAISE NOTICE 'Deleting email send logs...';
    DELETE FROM email_send_log 
    WHERE session_id IN (
        SELECT cs.id 
        FROM customer_sessions cs
        JOIN checklists c ON cs.checklist_id = c.id
        WHERE c.user_id = user_uuid
    );
    
    -- Delete customer sessions for user's checklists
    RAISE NOTICE 'Deleting customer sessions...';
    DELETE FROM customer_sessions 
    WHERE checklist_id IN (
        SELECT id FROM checklists WHERE user_id = user_uuid
    );
    
    -- Delete customer progress for user's checklists
    RAISE NOTICE 'Deleting customer progress...';
    DELETE FROM customer_progress 
    WHERE customer_id IN (
        SELECT c.id 
        FROM customers c
        JOIN checklists cl ON c.checklist_id = cl.id
        WHERE cl.user_id = user_uuid
    );
    
    -- Delete customers for user's checklists
    RAISE NOTICE 'Deleting customers...';
    DELETE FROM customers 
    WHERE checklist_id IN (
        SELECT id FROM checklists WHERE user_id = user_uuid
    );
    
    -- Delete checklist steps
    RAISE NOTICE 'Deleting checklist steps...';
    DELETE FROM checklist_steps 
    WHERE checklist_id IN (
        SELECT id FROM checklists WHERE user_id = user_uuid
    );
    
    -- Delete checklists
    RAISE NOTICE 'Deleting checklists...';
    DELETE FROM checklists WHERE user_id = user_uuid;
    
    -- Delete user branding
    RAISE NOTICE 'Deleting user branding...';
    DELETE FROM user_branding WHERE user_id = user_uuid;
    
    -- Delete Stripe data
    RAISE NOTICE 'Deleting Stripe subscriptions...';
    DELETE FROM stripe_subscriptions 
    WHERE customer_id IN (
        SELECT customer_id FROM stripe_customers WHERE user_id = user_uuid
    );
    
    RAISE NOTICE 'Deleting Stripe customers...';
    DELETE FROM stripe_customers WHERE user_id = user_uuid;
    
    -- Finally delete the user
    RAISE NOTICE 'Deleting auth user...';
    DELETE FROM auth.users WHERE id = user_uuid;
    
    RAISE NOTICE 'Successfully deleted user % and all related data', user_email;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error occurred: %', SQLERRM;
        RAISE;
END $$;