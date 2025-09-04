/*
  # Setup Supabase Storage Buckets and Policies

  1. Storage Buckets
    - `customer-files` (private, 50MB limit) - for sensitive customer uploads
    - `public-assets` (public, 10MB limit) - for logos and public files

  2. Security Policies
    - Authenticated users can manage their own files
    - Anonymous users can upload to public checklist sessions
    - File organization by session/user ID for proper access control

  3. File Type Restrictions
    - customer-files: documents, images, archives
    - public-assets: images and PDFs only
*/

-- Create customer-files bucket (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'customer-files',
  'customer-files', 
  false,
  52428800, -- 50MB
  ARRAY[
    'image/*',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/*',
    'application/json',
    'application/zip',
    'application/x-zip-compressed',
    'application/octet-stream'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Create public-assets bucket (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'public-assets',
  'public-assets',
  true,
  10485760, -- 10MB
  ARRAY[
    'image/*',
    'application/pdf'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for customer-files bucket

-- Policy: Authenticated users can upload files
CREATE POLICY "Authenticated users can upload customer files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'customer-files'
);

-- Policy: Users can view files in their own sessions
CREATE POLICY "Users can view their own session files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'customer-files' AND
  (storage.foldername(name))[1] IN (
    SELECT cs.id::text
    FROM customer_sessions cs
    JOIN checklists c ON cs.checklist_id = c.id
    WHERE c.user_id = auth.uid()
  )
);

-- Policy: Users can delete files in their own sessions
CREATE POLICY "Users can delete their own session files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'customer-files' AND
  (storage.foldername(name))[1] IN (
    SELECT cs.id::text
    FROM customer_sessions cs
    JOIN checklists c ON cs.checklist_id = c.id
    WHERE c.user_id = auth.uid()
  )
);

-- Policy: Anonymous users can upload to public checklist sessions
CREATE POLICY "Anonymous users can upload to public sessions"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (
  bucket_id = 'customer-files' AND
  (storage.foldername(name))[1] IN (
    SELECT cs.id::text
    FROM customer_sessions cs
    JOIN checklists c ON cs.checklist_id = c.id
    WHERE c.is_public = true
  )
);

-- Policy: Anonymous users can view files in public sessions they have access to
CREATE POLICY "Anonymous users can view public session files"
ON storage.objects
FOR SELECT
TO anon
USING (
  bucket_id = 'customer-files' AND
  (storage.foldername(name))[1] IN (
    SELECT cs.id::text
    FROM customer_sessions cs
    JOIN checklists c ON cs.checklist_id = c.id
    WHERE c.is_public = true
  )
);

-- Storage policies for public-assets bucket

-- Policy: Anyone can view public assets
CREATE POLICY "Anyone can view public assets"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'public-assets');

-- Policy: Authenticated users can upload public assets
CREATE POLICY "Authenticated users can upload public assets"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'public-assets'
);

-- Policy: Users can delete their own public assets
CREATE POLICY "Users can delete their own public assets"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'public-assets' AND
  (metadata->>'uploader')::uuid = auth.uid()
);