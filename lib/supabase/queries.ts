import { supabase } from './client';
import { Category, Creation, CreationWithDetails } from './types';

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data as Category[];
}

export async function getCategoryBySlug(slug: string) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  return data as Category | null;
}

export async function getPublishedCreations(categoryId?: string) {
  let query = supabase
    .from('creations')
    .select(`
      *,
      category:categories(*),
      images:creation_images(*)
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as CreationWithDetails[];
}

export async function getFeaturedCreations(limit: number = 6) {
  const { data, error } = await supabase
    .from('creations')
    .select(`
      *,
      category:categories(*),
      images:creation_images(*)
    `)
    .eq('status', 'published')
    .eq('featured', true)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as CreationWithDetails[];
}

export async function getLatestCreations(limit: number = 6) {
  const { data, error } = await supabase
    .from('creations')
    .select(`
      *,
      category:categories(*),
      images:creation_images(*)
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as CreationWithDetails[];
}

export async function getCreationBySlug(slug: string) {
  const { data, error } = await supabase
    .from('creations')
    .select(`
      *,
      category:categories(*),
      images:creation_images(*)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) throw error;
  return data as CreationWithDetails | null;
}

export async function submitContactForm(formData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const { error } = await supabase
    .from('contact_submissions')
    .insert([formData] as any);

  if (error) throw error;
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function checkSlugUniqueness(
  table: 'categories' | 'creations',
  slug: string,
  excludeId?: string
): Promise<boolean> {
  let query = supabase
    .from(table)
    .select('id')
    .eq('slug', slug);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data.length === 0;
}
