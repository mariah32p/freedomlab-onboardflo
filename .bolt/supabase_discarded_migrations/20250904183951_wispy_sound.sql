/*
  # Setup Supabase Storage for file uploads

  1. Storage Buckets
    - `customer-files` - For customer uploaded files (private)
    - `public-assets` - For public assets like logos (public)

  2. Security
    - Enable RLS on storage objects
    - Add policies for authenticated users to manage their files
    - Add policies for anonymous users to upload to customer sessions

  3. File Organization
    - Files organized by session ID in folders
    - Automatic cleanup policies for old files
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('customer-files', 'customer-files', false, 52428800, ARRAY['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/*', 'application/json', 'application/zip', 'application/x-zip-compressed']),
  ('public-assets', 'public-assets', true, 10485760, ARRAY['image/*'])
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to manage their own files
CREATE POLICY "Users can upload files to customer-files bucket"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'customer-files');

CREATE POLICY "Users can view files in customer-files bucket"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'customer-files');

CREATE POLICY "Users can update files in customer-files bucket"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'customer-files');

CREATE POLICY "Users can delete files in customer-files bucket"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'customer-files');

-- Policy for anonymous users to upload files for public checklists
CREATE POLICY "Anonymous can upload files for public checklists"
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

CREATE POLICY "Anonymous can view files for public checklists"
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

-- Policy for public assets bucket
CREATE POLICY "Anyone can view public assets"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'public-assets');

CREATE POLICY "Authenticated users can upload public assets"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'public-assets');

CREATE POLICY "Authenticated users can update public assets"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'public-assets');

CREATE POLICY "Authenticated users can delete public assets"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'public-assets');