-- Get all tables in your database
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname IN ('public', 'auth')
ORDER BY schemaname, tablename;

-- Get detailed table information with row counts
SELECT 
    t.table_name,
    t.table_type,
    (
        SELECT COUNT(*) 
        FROM information_schema.columns c 
        WHERE c.table_name = t.table_name 
        AND c.table_schema = 'public'
    ) as column_count,
    CASE 
        WHEN t.table_name IN ('users', 'customers', 'customer_sessions', 'customer_progress', 'session_progress') THEN 'Customer Data'
        WHEN t.table_name LIKE 'stripe_%' THEN 'Stripe Integration'
        WHEN t.table_name LIKE 'checklist%' THEN 'Checklist System'
        WHEN t.table_name LIKE '%branding%' THEN 'Branding'
        WHEN t.table_name LIKE '%email%' THEN 'Email System'
        WHEN t.table_name LIKE '%secure%' THEN 'Security'
        ELSE 'Other'
    END as category
FROM information_schema.tables t
WHERE t.table_schema = 'public'
ORDER BY category, t.table_name;

-- Check for duplicate/conflicting customer tables
SELECT 
    'customers' as table_name,
    COUNT(*) as row_count
FROM customers
UNION ALL
SELECT 
    'customer_sessions' as table_name,
    COUNT(*) as row_count
FROM customer_sessions
UNION ALL
SELECT 
    'stripe_customers' as table_name,
    COUNT(*) as row_count
FROM stripe_customers;

-- Check for orphaned records (customers without user mappings)
SELECT 
    sc.customer_id,
    sc.user_id,
    ss.subscription_id,
    ss.status,
    ss.price_id,
    CASE 
        WHEN sc.user_id IS NULL THEN 'ORPHANED - No user mapping'
        ELSE 'OK'
    END as status_check
FROM stripe_customers sc
LEFT JOIN stripe_subscriptions ss ON sc.customer_id = ss.customer_id
ORDER BY sc.created_at DESC;

-- Check for duplicate customer mappings
SELECT 
    user_id,
    COUNT(*) as customer_count,
    array_agg(customer_id) as customer_ids
FROM stripe_customers 
WHERE deleted_at IS NULL
GROUP BY user_id
HAVING COUNT(*) > 1;

-- Get all columns for each table to see structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- Check for foreign key relationships
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;