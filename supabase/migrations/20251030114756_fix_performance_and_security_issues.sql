/*
  # Fix Performance and Security Issues
  
  This migration addresses the following concerns:
  
  1. **Unindexed Foreign Keys**
     - Adds indexes on foreign key columns for optimal query performance
     - `creation_images.creation_id` - used for joins and filtering
     - `creations.category_id` - used for category-based queries
  
  2. **Auth RLS Initialization Plan Optimization**
     - Optimizes RLS policies to avoid re-evaluating auth functions for each row
     - Uses subquery pattern `(select auth.role())` instead of `auth.role()`
     - Significantly improves query performance at scale
  
  3. **Password Leak Protection**
     - Note: Password leak protection (HaveIBeenPwned integration) must be enabled
       in the Supabase Dashboard under Authentication > Policies
     - This cannot be configured via SQL migrations
  
  ## Changes Made
  
  ### Index Creation
  - Creates covering indexes for foreign key columns
  - Improves JOIN and WHERE clause performance
  
  ### RLS Policy Optimization
  - Recreates policies with optimized auth function calls
  - Reduces function evaluation overhead
  - Maintains same security guarantees with better performance
*/

-- ============================================================================
-- STEP 1: Add Indexes for Foreign Keys
-- ============================================================================

-- Index for creation_images foreign key
CREATE INDEX IF NOT EXISTS idx_creation_images_creation_id 
  ON creation_images(creation_id);

-- Index for creations foreign key
CREATE INDEX IF NOT EXISTS idx_creations_category_id 
  ON creations(category_id);

-- ============================================================================
-- STEP 2: Optimize RLS Policies with Subquery Pattern
-- ============================================================================

-- Drop and recreate creations SELECT policy with optimized auth check
DROP POLICY IF EXISTS "Users can view appropriate creations" ON creations;

CREATE POLICY "Users can view appropriate creations"
  ON creations FOR SELECT
  USING (
    CASE 
      WHEN (SELECT auth.role()) = 'authenticated' THEN true
      ELSE status = 'published'
    END
  );

-- Drop and recreate creation_images SELECT policy with optimized auth check
DROP POLICY IF EXISTS "Users can view appropriate images" ON creation_images;

CREATE POLICY "Users can view appropriate images"
  ON creation_images FOR SELECT
  USING (
    CASE 
      WHEN (SELECT auth.role()) = 'authenticated' THEN true
      ELSE EXISTS (
        SELECT 1 FROM creations
        WHERE creations.id = creation_images.creation_id
        AND creations.status = 'published'
      )
    END
  );

-- ============================================================================
-- STEP 3: Password Leak Protection (Manual Configuration Required)
-- ============================================================================

/*
  IMPORTANT: Password leak protection cannot be enabled via SQL migration.
  
  To enable HaveIBeenPwned password leak protection:
  
  1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/riydumvqbgkfhlwawwvy
  2. Navigate to Authentication > Policies
  3. Find "Password Requirements" section
  4. Enable "Check for compromised passwords"
  5. Save changes
  
  This will automatically check new passwords against the HaveIBeenPwned database
  and prevent users from using compromised passwords.
*/
