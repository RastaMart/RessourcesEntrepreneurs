-- Add storage policies for authenticated users to allow admin image uploads
-- This allows authenticated admin users to upload/update/delete images in the resources bucket

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated upload to resources bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update in resources bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete in resources bucket" ON storage.objects;

-- Allow authenticated users to insert (upload) images
CREATE POLICY "Allow authenticated upload to resources bucket"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'resources');

-- Allow authenticated users to update (upsert) images
CREATE POLICY "Allow authenticated update in resources bucket"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'resources')
  WITH CHECK (bucket_id = 'resources');

-- Allow authenticated users to delete images
CREATE POLICY "Allow authenticated delete in resources bucket"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'resources');

