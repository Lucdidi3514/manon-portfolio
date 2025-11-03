-- Add display_order column to creations table for manual ordering
-- This allows admins to manually set the order of creations on the frontend

-- Add display_order column (nullable initially)
ALTER TABLE creations
ADD COLUMN display_order integer;

-- Set initial display_order values based on created_at (oldest first = 0, 1, 2, etc.)
WITH numbered_creations AS (
  SELECT
    id,
    ROW_NUMBER() OVER (ORDER BY created_at ASC) - 1 AS new_order
  FROM creations
)
UPDATE creations
SET display_order = numbered_creations.new_order
FROM numbered_creations
WHERE creations.id = numbered_creations.id;

-- Make display_order NOT NULL after setting values
ALTER TABLE creations
ALTER COLUMN display_order SET NOT NULL;

-- Add default value for new creations (will be set to max + 1)
ALTER TABLE creations
ALTER COLUMN display_order SET DEFAULT 0;

-- Create index for efficient sorting
CREATE INDEX idx_creations_display_order ON creations(display_order);

-- Add comment for documentation
COMMENT ON COLUMN creations.display_order IS 'Manual ordering field for controlling display order on frontend. Lower numbers appear first.';
