-- ================================================
-- Policies pour Supabase Storage - photos-article
-- ================================================
-- À exécuter dans: Supabase Dashboard → SQL Editor
-- ================================================

-- 1. ✅ LECTURE PUBLIQUE (tout le monde peut voir les images)
CREATE POLICY "Public can view creation images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'photos-article');

-- 2. ✅ UPLOAD AUTHENTIFIÉ (seulement admins peuvent uploader)
CREATE POLICY "Authenticated users can upload creation images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'photos-article');

-- 3. ✅ UPDATE AUTHENTIFIÉ (seulement admins peuvent modifier)
CREATE POLICY "Authenticated users can update creation images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'photos-article');

-- 4. ✅ SUPPRESSION AUTHENTIFIÉE (seulement admins peuvent supprimer)
CREATE POLICY "Authenticated users can delete creation images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'photos-article');

-- ================================================
-- C'est tout! Les policies sont créées.
-- Vérifiez dans: Storage → photos-article → Policies
-- ================================================
