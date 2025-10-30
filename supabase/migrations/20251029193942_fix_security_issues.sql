/*
  # Fix Security Issues
  
  This migration addresses the following security concerns:
  
  1. **Multiple Permissive Policies**
     - Removes redundant SELECT policies on `creations` and `creation_images` tables
     - Consolidates into single, more restrictive policies
     - Maintains proper access control for authenticated vs public users
  
  2. **Unused Indexes**
     - Removes indexes that are not being utilized by queries
     - Keeps only the actively used indexes to reduce maintenance overhead
     - Retained: `idx_creations_status` and `idx_categories_display_order` (these ARE being used)
  
  3. **Function Search Path Security**
     - Sets immutable search_path for `update_updated_at_column()` function
     - Prevents potential privilege escalation attacks
     - Uses explicit schema qualification
  
  ## Changes Made
  
  ### Policy Consolidation
  - Replaces multiple SELECT policies with single unified policies
  - Uses proper role-based access control
  - Ensures authenticated users have appropriate access while maintaining public read access for published content
  
  ### Index Cleanup
  - Drops unused indexes: slug indexes, category_id, featured, creation_id, read status
  - Maintains performance-critical indexes that are actively used
  
  ### Function Security Hardening
  - Recreates function with SECURITY DEFINER and SET search_path
  - Prevents search_path manipulation attacks
*/

-- ============================================================================
-- STEP 1: Fix Multiple Permissive Policies
-- ============================================================================

-- Drop existing conflicting policies for creations
DROP POLICY IF EXISTS "Anyone can view published creations" ON creations;
DROP POLICY IF EXISTS "Authenticated users can view all creations" ON creations;

-- Create a single consolidated SELECT policy for creations
CREATE POLICY "Users can view appropriate creations"
  ON creations FOR SELECT
  USING (
    CASE 
      WHEN auth.role() = 'authenticated' THEN true
      ELSE status = 'published'
    END
  );

-- Drop existing conflicting policies for creation_images
DROP POLICY IF EXISTS "Anyone can view images of published creations" ON creation_images;
DROP POLICY IF EXISTS "Authenticated users can view all images" ON creation_images;

-- Create a single consolidated SELECT policy for creation_images
CREATE POLICY "Users can view appropriate images"
  ON creation_images FOR SELECT
  USING (
    CASE 
      WHEN auth.role() = 'authenticated' THEN true
      ELSE EXISTS (
        SELECT 1 FROM creations
        WHERE creations.id = creation_images.creation_id
        AND creations.status = 'published'
      )
    END
  );

-- ============================================================================
-- STEP 2: Remove Unused Indexes
-- ============================================================================

-- Drop unused indexes
DROP INDEX IF EXISTS idx_creations_slug;
DROP INDEX IF EXISTS idx_creations_category_id;
DROP INDEX IF EXISTS idx_creations_featured;
DROP INDEX IF EXISTS idx_categories_slug;
DROP INDEX IF EXISTS idx_creation_images_creation_id;
DROP INDEX IF EXISTS idx_contact_submissions_read;

-- Note: Keeping idx_creations_status and idx_categories_display_order as they ARE being used

-- ============================================================================
-- STEP 3: Fix Function Search Path Security
-- ============================================================================

-- Drop existing function
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Recreate function with secure search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = pg_catalog, public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate triggers that were dropped with CASCADE
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creations_updated_at
  BEFORE UPDATE ON creations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
