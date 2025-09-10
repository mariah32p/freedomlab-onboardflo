-- Reset user and all related data
-- Replace 'your-test-email@example.com' with the actual email you want to delete

DO $$
DECLARE
    user_uuid uuid;
BEGIN
    -- Get the user ID first
    SELECT id INTO user_uuid 
    FROM auth.users 
    WHERE email = 'your-test-email@example.com';
    
    IF user_uuid IS NULL THEN
        RAISE NOTICE 'User not found with email: your-test-email@example.com';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Found user ID: %', user_uuid;
    
    -- Delete in correct order to avoid foreign key violations
    
    -- 1. Delete session progress (references customer_sessions)
    DELETE FROM session_progress 
    WHERE session_id IN (
        SELECT cs.id FROM customer_sessions cs
        JOIN checklists c ON cs.checklist_id = c.id
        WHERE c.user_id = user_uuid
    );
    
    -- 2. Delete email send logs (references customer_sessions)
    DELETE FROM email_send_log 
    WHERE session_id IN (
        SELECT cs.id FROM customer_sessions cs
        JOIN checklists c ON cs.checklist_id = c.id
        WHERE c.user_id = user_uuid
    );
    
    -- 3. Delete secure text data (references customer_sessions)
    DELETE FROM secure_text_data 
    WHERE session_id IN (
        SELECT cs.id FROM customer_sessions cs
        JOIN checklists c ON cs.checklist_id = c.id
        WHERE c.user_id = user_uuid
    );
    
    -- 4. Delete customer sessions (references checklists and users)
    DELETE FROM customer_sessions 
    WHERE checklist_id IN (
        SELECT id FROM checklists WHERE user_id = user_uuid
    );
    
    -- 5. Delete customer progress (references customers and checklist_steps)
    DELETE FROM customer_progress 
    WHERE customer_id IN (
        SELECT c.id FROM customers c
        JOIN checklists cl ON c.checklist_id = cl.id
        WHERE cl.user_id = user_uuid
    );
    
    -- 6. Delete customers (references checklists)
    DELETE FROM customers 
    WHERE checklist_id IN (
        SELECT id FROM checklists WHERE user_id = user_uuid
    );
    
    -- 7. Delete checklist steps (references checklists)
    DELETE FROM checklist_steps 
    WHERE checklist_id IN (
        SELECT id FROM checklists WHERE user_id = user_uuid
    );
    
    -- 8. Delete checklists (references users)
    DELETE FROM checklists WHERE user_id = user_uuid;
    
    -- 9. Delete user branding (references users)
    DELETE FROM user_branding WHERE user_id = user_uuid;
    
    -- 10. Delete Stripe data (references users)
    DELETE FROM stripe_subscriptions 
    WHERE customer_id IN (
        SELECT customer_id FROM stripe_customers WHERE user_id = user_uuid
    );
    
    DELETE FROM stripe_orders 
    WHERE customer_id IN (
        SELECT customer_id FROM stripe_customers WHERE user_id = user_uuid
    );
    
    DELETE FROM stripe_customers WHERE user_id = user_uuid;
    
    -- 11. Finally delete the user
    DELETE FROM auth.users WHERE id = user_uuid;
    
    RAISE NOTICE 'Successfully deleted user and all related data';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error occurred: %', SQLERRM;
        RAISE;
END $$;