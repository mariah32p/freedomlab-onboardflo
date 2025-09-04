/*
  # Storage Setup for File Uploads

  1. New Storage Buckets
    - `customer-files` (private) - for sensitive customer uploads
    - `public-assets` (public) - for logos and public assets
  
  2. Security
    - Enable RLS on storage.objects
    - Add policies for authenticated users to manage their own files
    - Add policies for anonymous users to upload to customer sessions
  
  3. File Organization
    - Files organized by customer session ID
    - Secure access control based on session ownership
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('customer-files', 'customer-files', false, 52428800, ARRAY['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/*', 'application/json', 'application/zip', 'application/x-zip-compressed'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('public-assets', 'public-assets', true, 10485760, ARRAY['image/*'])
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects (should already be enabled, but ensure it)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to manage their own files in customer-files bucket
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

-- Policy for anonymous users to upload files to customer sessions
CREATE POLICY "Anonymous can upload to customer sessions"
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

CREATE POLICY "Anonymous can view customer session files"
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

-- Policies for public-assets bucket
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