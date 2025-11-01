'use server';

import { createClient } from '@/lib/supabase/server';
import { generateSlug } from './queries';
import { revalidatePath } from 'next/cache';

export interface CreateCategoryInput {
  name: string;
  description?: string;
  image_url?: string;
  display_order?: number;
}

export interface UpdateCategoryInput {
  id: string;
  name?: string;
  description?: string;
  image_url?: string;
  display_order?: number;
}

export async function createCategory(input: CreateCategoryInput) {
  const supabase = createClient();

  try {
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Nicht authentifiziert' };
    }

    // Generate slug from name
    const slug = generateSlug(input.name);

    // Get max display_order if not provided
    let displayOrder = input.display_order;
    if (displayOrder === undefined) {
      const { data: categories } = await supabase
        .from('categories')
        .select('display_order')
        .order('display_order', { ascending: false })
        .limit(1);

      displayOrder = categories && categories.length > 0 ? (categories[0] as any).display_order + 1 : 1;
    }

    const { data, error } = await supabase
      .from('categories')
      // @ts-ignore - TypeScript has trouble with Supabase insert type inference
      .insert({
        name: input.name,
        slug,
        description: input.description || '',
        image_url: input.image_url || null,
        display_order: displayOrder,
      } as any)
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      return { success: false, error: `Fehler beim Erstellen: ${error.message}` };
    }

    revalidatePath('/admin/categories');
    revalidatePath('/admin/creations/new');
    return { success: true, data };
  } catch (error: any) {
    console.error('Unexpected error creating category:', error);
    return { success: false, error: `Unerwarteter Fehler: ${error?.message || 'Unbekannt'}` };
  }
}

export async function updateCategory(input: UpdateCategoryInput) {
  const supabase = createClient();

  try {
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Nicht authentifiziert' };
    }

    const updateData: any = {};

    if (input.name !== undefined) {
      updateData.name = input.name;
      updateData.slug = generateSlug(input.name);
    }
    if (input.description !== undefined) updateData.description = input.description;
    if (input.image_url !== undefined) updateData.image_url = input.image_url;
    if (input.display_order !== undefined) updateData.display_order = input.display_order;

    const { data, error } = await supabase
      .from('categories')
      // @ts-ignore - TypeScript has trouble with Supabase update type inference
      .update(updateData as any)
      .eq('id', input.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating category:', error);
      return { success: false, error: `Fehler beim Aktualisieren: ${error.message}` };
    }

    revalidatePath('/admin/categories');
    revalidatePath('/admin/creations/new');
    return { success: true, data };
  } catch (error: any) {
    console.error('Unexpected error updating category:', error);
    return { success: false, error: `Unerwarteter Fehler: ${error?.message || 'Unbekannt'}` };
  }
}

export async function deleteCategory(id: string) {
  const supabase = createClient();

  try {
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Nicht authentifiziert' };
    }

    // Check if category is used by any creations
    const { data: creations, error: checkError } = await supabase
      .from('creations')
      .select('id')
      .eq('category_id', id)
      .limit(1);

    if (checkError) {
      console.error('Error checking category usage:', checkError);
      return { success: false, error: 'Fehler beim Prüfen der Kategorie' };
    }

    if (creations && creations.length > 0) {
      return {
        success: false,
        error: 'Diese Kategorie wird noch verwendet und kann nicht gelöscht werden'
      };
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
      return { success: false, error: `Fehler beim Löschen: ${error.message}` };
    }

    revalidatePath('/admin/categories');
    revalidatePath('/admin/creations/new');
    return { success: true };
  } catch (error: any) {
    console.error('Unexpected error deleting category:', error);
    return { success: false, error: `Unerwarteter Fehler: ${error?.message || 'Unbekannt'}` };
  }
}

export async function getCategoryById(id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching category:', error);
    return null;
  }

  return data;
}
