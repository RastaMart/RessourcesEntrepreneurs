-- Créer le bucket 'resources' pour stocker les images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resources',
  'resources',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Public read access for resources bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous upload to resources bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous update in resources bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous delete in resources bucket" ON storage.objects;

-- Politique pour permettre la lecture publique
CREATE POLICY "Public read access for resources bucket"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'resources');

-- Politique pour permettre l'upload anonyme (pour le scraping)
CREATE POLICY "Allow anonymous upload to resources bucket"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'resources');

-- Politique pour permettre la mise à jour anonyme (upsert)
CREATE POLICY "Allow anonymous update in resources bucket"
ON storage.objects
FOR UPDATE
TO anon
USING (bucket_id = 'resources')
WITH CHECK (bucket_id = 'resources');

-- Politique pour permettre la suppression anonyme
CREATE POLICY "Allow anonymous delete in resources bucket"
ON storage.objects
FOR DELETE
TO anon
USING (bucket_id = 'resources');

