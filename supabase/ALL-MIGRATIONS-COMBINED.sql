/*
  ============================================================================
  PORTFOLIO-MANON: COMPLETE DATABASE SETUP
  ============================================================================

  This file combines all 4 migrations into a single script for easy setup.

  USAGE:
  1. Go to Supabase Dashboard → SQL Editor
  2. Copy this ENTIRE file
  3. Paste into SQL Editor
  4. Click "Run"

  This will create:
  - All 4 tables (categories, creations, creation_images, contact_submissions)
  - All RLS policies for security
  - All performance indexes
  - All triggers and functions

  Time: ~30 seconds to run

  ============================================================================
*/

-- ============================================================================
-- MIGRATION 1: Create Initial Schema
-- ============================================================================

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  image_url text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create creations table
CREATE TABLE IF NOT EXISTS creations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  description text DEFAULT '',
  materials text[] DEFAULT '{}',
  sizes text[] DEFAULT '{}',
  colors text[] DEFAULT '{}',
  featured boolean DEFAULT false,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz
);

-- Create creation_images table
CREATE TABLE IF NOT EXISTS creation_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creation_id uuid REFERENCES creations(id) ON DELETE CASCADE NOT NULL,
  url text NOT NULL,
  alt_text text DEFAULT '',
  is_primary boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now(),
  read boolean DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE creations ENABLE ROW LEVEL SECURITY;
ALTER TABLE creation_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Categories policies
DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert categories" ON categories;
CREATE POLICY "Authenticated users can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update categories" ON categories;
CREATE POLICY "Authenticated users can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete categories" ON categories;
CREATE POLICY "Authenticated users can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (true);

-- Contact submissions policies
DROP POLICY IF EXISTS "Anyone can insert contact submissions" ON contact_submissions;
CREATE POLICY "Anyone can insert contact submissions"
  ON contact_submissions FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can view contact submissions" ON contact_submissions;
CREATE POLICY "Authenticated users can view contact submissions"
  ON contact_submissions FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can update contact submissions" ON contact_submissions;
CREATE POLICY "Authenticated users can update contact submissions"
  ON contact_submissions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete contact submissions" ON contact_submissions;
CREATE POLICY "Authenticated users can delete contact submissions"
  ON contact_submissions FOR DELETE
  TO authenticated
  USING (true);

-- Create basic indexes
CREATE INDEX IF NOT EXISTS idx_creations_status ON creations(status);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(display_order);

-- ============================================================================
-- MIGRATION 2 & 3: Security, Performance, and Optimized Policies
-- ============================================================================

-- Creations policies (INSERT, UPDATE, DELETE)
DROP POLICY IF EXISTS "Authenticated users can insert creations" ON creations;
CREATE POLICY "Authenticated users can insert creations"
  ON creations FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update creations" ON creations;
CREATE POLICY "Authenticated users can update creations"
  ON creations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete creations" ON creations;
CREATE POLICY "Authenticated users can delete creations"
  ON creations FOR DELETE
  TO authenticated
  USING (true);

-- Creations SELECT policy (optimized)
DROP POLICY IF EXISTS "Anyone can view published creations" ON creations;
DROP POLICY IF EXISTS "Authenticated users can view all creations" ON creations;
DROP POLICY IF EXISTS "Users can view appropriate creations" ON creations;

CREATE POLICY "Users can view appropriate creations"
  ON creations FOR SELECT
  USING (
    CASE
      WHEN (SELECT auth.role()) = 'authenticated' THEN true
      ELSE status = 'published'
    END
  );

-- Creation images policies (INSERT, UPDATE, DELETE)
DROP POLICY IF EXISTS "Authenticated users can insert images" ON creation_images;
CREATE POLICY "Authenticated users can insert images"
  ON creation_images FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update images" ON creation_images;
CREATE POLICY "Authenticated users can update images"
  ON creation_images FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete images" ON creation_images;
CREATE POLICY "Authenticated users can delete images"
  ON creation_images FOR DELETE
  TO authenticated
  USING (true);

-- Creation images SELECT policy (optimized)
DROP POLICY IF EXISTS "Anyone can view images of published creations" ON creation_images;
DROP POLICY IF EXISTS "Authenticated users can view all images" ON creation_images;
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

-- Add performance indexes for foreign keys
CREATE INDEX IF NOT EXISTS idx_creation_images_creation_id
  ON creation_images(creation_id);

CREATE INDEX IF NOT EXISTS idx_creations_category_id
  ON creations(category_id);

-- ============================================================================
-- MIGRATION 4: Functions and Triggers
-- ============================================================================

-- Create secure function for updated_at
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

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

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_creations_updated_at ON creations;
CREATE TRIGGER update_creations_updated_at
  BEFORE UPDATE ON creations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add index documentation
COMMENT ON INDEX idx_creations_category_id IS
  'Essential for filtering creations by category and JOIN performance. Shows as unused until data is added to tables.';

COMMENT ON INDEX idx_creation_images_creation_id IS
  'Essential for loading images per creation and foreign key constraint performance. Shows as unused until data is added to tables.';

-- Verify indexes exist
DO $$
BEGIN
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

-- ============================================================================
-- SETUP COMPLETE!
-- ============================================================================

/*
  ✅ Database setup complete!

  What was created:
  - ✅ 4 tables with proper schemas
  - ✅ Row Level Security (RLS) enabled on all tables
  - ✅ Optimized security policies
  - ✅ Performance indexes
  - ✅ Triggers for automatic timestamp updates

  Next steps:
  1. Create an admin user (Authentication → Users)
  2. Configure Auth URLs (Authentication → URL Configuration)
  3. Test: npm run build
  4. Add content via admin dashboard

  Need help? Check DATABASE-SETUP-GUIDE.md
*/
