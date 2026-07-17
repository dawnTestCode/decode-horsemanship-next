-- Create foaling-photos storage bucket
-- Note: Storage bucket creation can also be done via Supabase dashboard

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'foaling-photos',
  'foaling-photos',
  true,
  10485760,  -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/heic', 'image/heif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to all files in the bucket
CREATE POLICY "Allow public read access to foaling photos"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'foaling-photos');

-- Allow public insert access (for uploading photos without auth)
CREATE POLICY "Allow public upload to foaling photos"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'foaling-photos');
