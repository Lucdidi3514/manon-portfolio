/*
  # Document Indexes and Password Protection
  
  This migration addresses security scanner findings:
  
  1. **"Unused" Indexes Explanation**
     - The indexes `idx_creation_images_creation_id` and `idx_creations_category_id`
       show as "unused" because there is currently no data in the tables
     - These indexes are CRITICAL for performance and MUST be kept
     - They will be automatically used once data is added
     - They optimize:
       * Foreign key constraint checks
       * JOIN operations between tables
       * Filtering creations by category
       * Loading images for specific creations
  
  2. **Password Leak Protection**
     - Must be enabled manually in Supabase Dashboard
     - Cannot be configured via SQL
  
  ## Important Notes
  
  ### Why These Indexes Are Essential
  
  Without `idx_creations_category_id`:
  - Filtering creations by category would require full table scans
  - Loading a category page would be slow with many creations
  
  Without `idx_creation_images_creation_id`:
  - Loading images for a creation would require full table scans
  - Foreign key constraint checks would be slower
  - Deleting a creation would be slower (CASCADE operations)
  
  ### Index Usage Will Increase With Data
  
  These indexes will automatically be used by PostgreSQL query planner when:
  - Categories and creations are added to the database
  - Queries join or filter on these foreign key columns
  - The application loads creation details or category pages
*/

-- Add comments to document why these indexes are important
COMMENT ON INDEX idx_creations_category_id IS 
  'Essential for filtering creations by category and JOIN performance. Shows as unused until data is added to tables.';

COMMENT ON INDEX idx_creation_images_creation_id IS 
  'Essential for loading images per creation and foreign key constraint performance. Shows as unused until data is added to tables.';

-- Verify indexes exist
DO $$
BEGIN
  -- Check if indexes exist, raise notice if missing
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_creations_category_id'
  ) THEN
    RAISE EXCEPTION 'Index idx_creations_category_id is missing!';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_creation_images_creation_id'
  ) THEN
    RAISE EXCEPTION 'Index idx_creation_images_creation_id is missing!';
  END IF;
END $$;
