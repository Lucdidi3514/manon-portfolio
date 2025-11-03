'use server';

import { createClient } from '@/lib/supabase/server';
import { generateSlug } from './queries';
import { revalidatePath } from 'next/cache';
import type { Database } from './types';

export interface CreateCreationInput {
  title: string;
  description: string;
  category_id?: string;
  materials: string[];
  sizes: string[];
  colors: string[];
  featured: boolean;
  status: 'draft' | 'published';
  images: {
    url: string;
    alt_text: string;
    is_primary: boolean;
    display_order: number;
  }[];
}

export async function createCreation(input: CreateCreationInput) {
  const supabase = createClient();

  try {
    console.log('Creating creation with input:', { title: input.title, images: input.images.length });

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error('User not authenticated');
      return { success: false, error: 'Nicht authentifiziert' };
    }

    console.log('User authenticated:', user.email);

    // Generate slug
    const slug = generateSlug(input.title);
    console.log('Generated slug:', slug);

    // Get the max display_order to add new creation at the end
    const { data: maxOrderData } = await supabase
      .from('creations')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextOrder = maxOrderData ? (maxOrderData.display_order ?? 0) + 1 : 0;

    // Create creation
    const creationData: Database['public']['Tables']['creations']['Insert'] = {
      title: input.title,
      slug,
      description: input.description,
      category_id: input.category_id || null,
      materials: input.materials,
      sizes: input.sizes,
      colors: input.colors,
      featured: input.featured,
      status: input.status,
      published_at: input.status === 'published' ? new Date().toISOString() : null,
      display_order: nextOrder,
    };

    const { data: creation, error: creationError } = await supabase
      .from('creations')
      .insert(creationData as any)
      .select()
      .single();

    if (creationError || !creation) {
      console.error('Error creating creation:', creationError);
      return {
        success: false,
        error: `Fehler beim Erstellen der Kreation: ${creationError?.message || 'Unbekannter Fehler'}`
      };
    }

    const createdCreation = creation as Database['public']['Tables']['creations']['Row'];
    console.log('Creation created successfully:', createdCreation.id);

    // Insert images
    if (input.images.length > 0) {
      const images: Database['public']['Tables']['creation_images']['Insert'][] = input.images.map((img) => ({
        creation_id: createdCreation.id,
        url: img.url,
        alt_text: img.alt_text,
        is_primary: img.is_primary,
        display_order: img.display_order,
      }));

      const { error: imagesError } = await supabase
        .from('creation_images')
        .insert(images as any);

      if (imagesError) {
        console.error('Error creating images:', imagesError);
        return {
          success: false,
          error: `Kreation erstellt, aber Fehler beim Hochladen der Bilder: ${imagesError.message}`
        };
      }

      console.log('Images inserted successfully:', images.length);
    }

    // Revalidate paths
    revalidatePath('/');
    revalidatePath('/creations');
    revalidatePath('/admin/creations');

    console.log('Creation process completed successfully');
    return { success: true, creation: createdCreation };
  } catch (error: any) {
    console.error('Unexpected error in createCreation:', error);
    return {
      success: false,
      error: `Unerwarteter Fehler: ${error?.message || 'Unbekannter Fehler'}`
    };
  }
}

export async function getCategories() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data;
}

export async function getAllCreations() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('creations')
    .select(`
      id,
      title,
      slug,
      status,
      featured,
      created_at,
      published_at,
      display_order,
      category:categories(name)
    `)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching creations:', error);
    return [];
  }

  return data;
}

export async function getCreationById(id: string) {
  const supabase = createClient();

  const { data: creation, error } = await supabase
    .from('creations')
    .select('*, creation_images(*)')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching creation:', error);
    return null;
  }

  return creation;
}

export interface UpdateCreationInput {
  id: string;
  title?: string;
  description?: string;
  category_id?: string | null;
  materials?: string[];
  sizes?: string[];
  colors?: string[];
  featured?: boolean;
  status?: 'draft' | 'published';
  images?: {
    id?: string; // If exists, it's an update; if not, it's a new image
    url: string;
    alt_text: string;
    is_primary: boolean;
    display_order: number;
    path?: string;
  }[];
  imagesToDelete?: string[]; // IDs of images to delete
}

export async function updateCreation(input: UpdateCreationInput) {
  const supabase = createClient();

  try {
    console.log('Updating creation:', input.id);

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error('User not authenticated');
      return { success: false, error: 'Nicht authentifiziert' };
    }

    // Build update data
    const updateData: Database['public']['Tables']['creations']['Update'] = {};

    if (input.title !== undefined) {
      updateData.title = input.title;
      updateData.slug = generateSlug(input.title);
    }
    if (input.description !== undefined) updateData.description = input.description;
    if (input.category_id !== undefined) updateData.category_id = input.category_id;
    if (input.materials !== undefined) updateData.materials = input.materials;
    if (input.sizes !== undefined) updateData.sizes = input.sizes;
    if (input.colors !== undefined) updateData.colors = input.colors;
    if (input.featured !== undefined) updateData.featured = input.featured;
    if (input.status !== undefined) {
      updateData.status = input.status;
      // Set published_at if changing to published for the first time
      if (input.status === 'published') {
        const { data: current } = await supabase
          .from('creations')
          .select('published_at')
          .eq('id', input.id)
          .single();

        if (current && !(current as any).published_at) {
          updateData.published_at = new Date().toISOString();
        }
      }
    }

    // Update creation
    const { data: creation, error: creationError } = await supabase
      .from('creations')
      // @ts-ignore - TypeScript has trouble with Supabase update type inference
      .update(updateData as any)
      .eq('id', input.id)
      .select()
      .single();

    if (creationError || !creation) {
      console.error('Error updating creation:', creationError);
      return {
        success: false,
        error: `Fehler beim Aktualisieren der Kreation: ${creationError?.message || 'Unbekannter Fehler'}`
      };
    }

    // Handle images if provided
    if (input.images !== undefined) {
      // Delete images marked for deletion
      if (input.imagesToDelete && input.imagesToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('creation_images')
          .delete()
          .in('id', input.imagesToDelete);

        if (deleteError) {
          console.error('Error deleting images:', deleteError);
        }
      }

      // Update or insert images
      for (const img of input.images) {
        if (img.id) {
          // Update existing image
          const { error: updateError } = await supabase
            .from('creation_images')
            // @ts-ignore - TypeScript has trouble with Supabase update type inference
            .update({
              alt_text: img.alt_text,
              is_primary: img.is_primary,
              display_order: img.display_order,
            } as any)
            .eq('id', img.id);

          if (updateError) {
            console.error('Error updating image:', updateError);
          }
        } else {
          // Insert new image
          const { error: insertError } = await supabase
            .from('creation_images')
            .insert({
              creation_id: input.id,
              url: img.url,
              alt_text: img.alt_text,
              is_primary: img.is_primary,
              display_order: img.display_order,
            } as any);

          if (insertError) {
            console.error('Error inserting image:', insertError);
          }
        }
      }
    }

    // Revalidate paths
    revalidatePath('/');
    revalidatePath('/creations');
    revalidatePath(`/creations/${(creation as any).slug}`);
    revalidatePath('/admin/creations');
    revalidatePath(`/admin/creations/${input.id}/edit`);

    console.log('Creation updated successfully');
    return { success: true, creation };
  } catch (error: any) {
    console.error('Unexpected error in updateCreation:', error);
    return {
      success: false,
      error: `Unerwarteter Fehler: ${error?.message || 'Unbekannter Fehler'}`
    };
  }
}

/**
 * Delete a creation and all its associated images
 */
export async function deleteCreation(creationId: string) {
  const supabase = createClient();

  try {
    console.log('Deleting creation:', creationId);

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error('User not authenticated');
      return { success: false, error: 'Nicht authentifiziert' };
    }

    // Get all images for this creation to delete from storage
    const { data: images, error: imagesError } = await supabase
      .from('creation_images')
      .select('url')
      .eq('creation_id', creationId);

    if (imagesError) {
      console.error('Error fetching images for deletion:', imagesError);
    }

    // Delete images from Supabase Storage
    if (images && images.length > 0) {
      const { deleteImage: deleteImageFn } = await import('./storage-actions');

      // Type assertion to help TypeScript understand the shape of images
      for (const image of images as { url: string }[]) {
        if (image.url) {
          // Extract filename from URL
          const urlParts = image.url.split('/');
          const filename = urlParts[urlParts.length - 1];

          if (filename && !filename.includes('?')) {
            const result = await deleteImageFn(filename);
            if (!result.success) {
              console.warn(`Failed to delete image ${filename} from storage:`, result.error);
            }
          }
        }
      }
    }

    // Delete creation_images (will cascade if DB is set up, but doing it explicitly)
    const { error: deleteImagesError } = await supabase
      .from('creation_images')
      .delete()
      .eq('creation_id', creationId);

    if (deleteImagesError) {
      console.error('Error deleting creation images:', deleteImagesError);
      return {
        success: false,
        error: `Fehler beim Löschen der Bilder: ${deleteImagesError.message}`
      };
    }

    // Delete the creation itself
    const { error: deleteCreationError } = await supabase
      .from('creations')
      .delete()
      .eq('id', creationId);

    if (deleteCreationError) {
      console.error('Error deleting creation:', deleteCreationError);
      return {
        success: false,
        error: `Fehler beim Löschen der Kreation: ${deleteCreationError.message}`
      };
    }

    // Revalidate paths
    revalidatePath('/');
    revalidatePath('/creations');
    revalidatePath('/admin/creations');

    console.log('Creation deleted successfully');
    return { success: true };
  } catch (error: any) {
    console.error('Unexpected error in deleteCreation:', error);
    return {
      success: false,
      error: `Unerwarteter Fehler: ${error?.message || 'Unbekannter Fehler'}`
    };
  }
}

/**
 * Reorder creations by updating their display_order
 */
export async function reorderCreations(creationIds: string[]) {
  const supabase = createClient();

  try {
    console.log('Reordering creations:', creationIds);

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error('User not authenticated');
      return { success: false, error: 'Nicht authentifiziert' };
    }

    // Update display_order for each creation
    for (let i = 0; i < creationIds.length; i++) {
      const { error } = await supabase
        .from('creations')
        .update({ display_order: i } as any)
        .eq('id', creationIds[i]);

      if (error) {
        console.error(`Error updating display_order for creation ${creationIds[i]}:`, error);
        return {
          success: false,
          error: `Fehler beim Neuordnen: ${error.message}`
        };
      }
    }

    // Revalidate paths
    revalidatePath('/');
    revalidatePath('/creations');
    revalidatePath('/admin/creations');

    console.log('Creations reordered successfully');
    return { success: true };
  } catch (error: any) {
    console.error('Unexpected error in reorderCreations:', error);
    return {
      success: false,
      error: `Unerwarteter Fehler: ${error?.message || 'Unbekannter Fehler'}`
    };
  }
}
