'use server';

import { createClient } from '@/lib/supabase/server';

const BUCKET_NAME = 'photos-article';

// Allowed image formats
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

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

    // Validate file type - strict format check
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        success: false,
        error: `Format non autorisé: ${file.type}. Seuls JPG, PNG et WebP sont acceptés (max 5MB).`
      };
    }

    // Validate file extension as additional security
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
      return {
        success: false,
        error: `Extension non autorisée: .${extension}. Seuls .jpg, .jpeg, .png et .webp sont acceptés.`
      };
    }

    // Validate file size (5MB max)
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return {
        success: false,
        error: `Image trop grande: ${sizeMB}MB. Taille maximale autorisée: 5MB.`
      };
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const filename = `${timestamp}-${randomString}.${fileExtension}`;

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
