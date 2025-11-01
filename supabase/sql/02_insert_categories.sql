-- Insert clothing categories for the portfolio
-- Run this in Supabase SQL Editor

INSERT INTO categories (name, slug, display_order, description) VALUES
  ('Socken', 'socken', 1, 'Handgefertigte Socken und Strümpfe'),
  ('Hosen', 'hosen', 2, 'Verschiedene Hosenmodelle'),
  ('Shorts', 'shorts', 3, 'Kurze Hosen für warme Tage'),
  ('T-Shirts', 't-shirts', 4, 'Bequeme T-Shirts'),
  ('Pullover', 'pullover', 5, 'Warme Pullover und Strickwaren'),
  ('Hemden', 'hemden', 6, 'Elegante Hemden und Blusen'),
  ('Mützen', 'muetzen', 7, 'Kopfbedeckungen für jede Jahreszeit'),
  ('Jacken', 'jacken', 8, 'Jacken und Mäntel'),
  ('Kleider', 'kleider', 9, 'Schöne Kleider für jeden Anlass'),
  ('Röcke', 'roecke', 10, 'Verschiedene Rockmodelle'),
  ('Taschen', 'taschen', 11, 'Handgefertigte Taschen und Beutel'),
  ('Schals', 'schals', 12, 'Schals und Tücher'),
  ('Handschuhe', 'handschuhe', 13, 'Warme Handschuhe'),
  ('Unterwäsche', 'unterwaesche', 14, 'Bequeme Unterwäsche'),
  ('Accessoires', 'accessoires', 15, 'Verschiedene Accessoires und Kleinigkeiten'),
  ('Baby & Kinder', 'baby-kinder', 16, 'Kleidung für die Kleinen'),
  ('Schürzen', 'schuerzen', 17, 'Praktische Küchen- und Arbeitsschürzen'),
  ('Kissenbezüge', 'kissenbezuege', 18, 'Dekorative Kissenbezüge'),
  ('Decken', 'decken', 19, 'Warme Decken und Plaids'),
  ('Sonstiges', 'sonstiges', 20, 'Weitere handgefertigte Kreationen')
ON CONFLICT (slug) DO NOTHING;
