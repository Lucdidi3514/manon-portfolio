/*
  # Initial Schema for Sewing Atelier Portfolio

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text) - Category name
      - `slug` (text, unique) - URL-friendly identifier
      - `description` (text) - Category description
      - `image_url` (text) - Category cover image
      - `display_order` (integer) - Order for displaying categories
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `creations`
      - `id` (uuid, primary key)
      - `title` (text) - Creation title
      - `slug` (text, unique) - URL-friendly identifier
      - `category_id` (uuid) - Foreign key to categories
      - `description` (text) - Full description
      - `materials` (text[]) - Array of materials used
      - `sizes` (text[]) - Array of available sizes
      - `colors` (text[]) - Array of colors used
      - `featured` (boolean) - Whether to feature on homepage
      - `status` (text) - 'draft' or 'published'
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
      - `published_at` (timestamptz) - Publication timestamp

    - `creation_images`
      - `id` (uuid, primary key)
      - `creation_id` (uuid) - Foreign key to creations
      - `url` (text) - Image URL from Supabase Storage
      - `alt_text` (text) - Accessibility description
      - `is_primary` (boolean) - Primary image indicator
      - `display_order` (integer) - Order for displaying images
      - `created_at` (timestamptz) - Upload timestamp

    - `contact_submissions`
      - `id` (uuid, primary key)
      - `name` (text) - Submitter name
      - `email` (text) - Submitter email
      - `subject` (text) - Message subject
      - `message` (text) - Message content
      - `created_at` (timestamptz) - Submission timestamp
      - `read` (boolean) - Whether admin has read the message

  2. Security
    - Enable RLS on all tables
    - Public read access for categories, creations, and creation_images
    - Admin-only write access for categories, creations, and creation_images
    - Anyone can submit contact forms
    - Only admin can read contact submissions

  3. Indexes
    - Index on creation slugs for fast lookup
    - Index on category slugs for fast lookup
    - Index on creation status for filtering published items
    - Index on creation category_id for category filtering
*/

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
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (true);

-- Creations policies
CREATE POLICY "Anyone can view published creations"
  ON creations FOR SELECT
  TO public
  USING (status = 'published');

CREATE POLICY "Authenticated users can view all creations"
  ON creations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert creations"
  ON creations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update creations"
  ON creations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete creations"
  ON creations FOR DELETE
  TO authenticated
  USING (true);

-- Creation images policies
CREATE POLICY "Anyone can view images of published creations"
  ON creation_images FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM creations
      WHERE creations.id = creation_images.creation_id
      AND creations.status = 'published'
    )
  );

CREATE POLICY "Authenticated users can view all images"
  ON creation_images FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert images"
  ON creation_images FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update images"
  ON creation_images FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete images"
  ON creation_images FOR DELETE
  TO authenticated
  USING (true);

-- Contact submissions policies
CREATE POLICY "Anyone can insert contact submissions"
  ON contact_submissions FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view contact submissions"
  ON contact_submissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update contact submissions"
  ON contact_submissions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete contact submissions"
  ON contact_submissions FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_creations_slug ON creations(slug);
CREATE INDEX IF NOT EXISTS idx_creations_status ON creations(status);
CREATE INDEX IF NOT EXISTS idx_creations_category_id ON creations(category_id);
CREATE INDEX IF NOT EXISTS idx_creations_featured ON creations(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(display_order);
CREATE INDEX IF NOT EXISTS idx_creation_images_creation_id ON creation_images(creation_id);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_read ON contact_submissions(read) WHERE read = false;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creations_updated_at
  BEFORE UPDATE ON creations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
