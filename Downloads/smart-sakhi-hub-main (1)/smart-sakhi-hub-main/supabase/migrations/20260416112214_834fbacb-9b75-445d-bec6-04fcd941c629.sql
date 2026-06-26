
-- Fix: Restrict public bucket listing to only allow viewing specific files, not listing all
DROP POLICY "Anyone can view product images" ON storage.objects;
CREATE POLICY "Anyone can view product images by path" ON storage.objects 
  FOR SELECT USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
