'use server';

import { createClient } from '@/lib/supabase/server';

const BUCKET_NAME = 'photos-article';

/**
 * Upload an image file to Supabase Storage
 */
export async function uploadImage(formData: FormData) {
  const supabase = createClient();

  try {
    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Non authentifié' };
    }

    const file = formData.get('file') as File;
    if (!file) {
      return { success: false, error: 'Aucun fichier fourni' };
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'Le fichier doit être une image' };
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { success: false, error: 'L\'image est trop grande (max 5MB)' };
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}-${randomString}.${extension}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, file, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return { success: false, error: `Erreur d'upload: ${error.message}` };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

    return {
      success: true,
      url: publicUrl,
      path: data.path,
    };
  } catch (error: any) {
    console.error('Unexpected upload error:', error);
    return {
      success: false,
      error: `Erreur inattendue: ${error?.message || 'Inconnu'}`,
    };
  }
}

/**
 * Delete an image from Supabase Storage
 */
export async function deleteImage(path: string) {
  const supabase = createClient();

  try {
    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Non authentifié' };
    }

    const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);

    if (error) {
      console.error('Delete error:', error);
      return { success: false, error: `Erreur de suppression: ${error.message}` };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Unexpected delete error:', error);
    return {
      success: false,
      error: `Erreur inattendue: ${error?.message || 'Inconnu'}`,
    };
  }
}
