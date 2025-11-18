-- Add RLS policies for authenticated users to allow admin updates to resources table
-- This allows authenticated admin users to update resources
-- This migration is idempotent and can be safely re-run

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated read (resources)" ON public.resources;
DROP POLICY IF EXISTS "Allow authenticated update (resources)" ON public.resources;
DROP POLICY IF EXISTS "Allow authenticated insert (resources)" ON public.resources;
DROP POLICY IF EXISTS "Allow authenticated delete (resources)" ON public.resources;

-- Allow authenticated users to read resources
CREATE POLICY "Allow authenticated read (resources)"
  ON public.resources
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update resources
CREATE POLICY "Allow authenticated update (resources)"
  ON public.resources
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to insert resources
CREATE POLICY "Allow authenticated insert (resources)"
  ON public.resources
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to delete resources
CREATE POLICY "Allow authenticated delete (resources)"
  ON public.resources
  FOR DELETE
  TO authenticated
  USING (true);

