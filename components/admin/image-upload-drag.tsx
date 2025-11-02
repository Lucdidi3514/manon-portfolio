'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Upload, Loader2, Image as ImageIcon, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { uploadImage, deleteImage } from '@/lib/supabase/storage-actions';
import Image from 'next/image';

export interface ImageInput {
  id?: string; // ID from database for existing images
  url: string;
  alt_text: string;
  is_primary: boolean;
  display_order: number;
  path?: string; // Path in Supabase Storage for deletion
}

interface ImageUploadDragProps {
  images: ImageInput[];
  onChange: (images: ImageInput[]) => void;
  onRemoveExisting?: (imageId: string) => void; // Callback when an existing image is removed
}

// Allowed image formats
const ALLOWED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function ImageUploadDrag({ images, onChange, onRemoveExisting }: ImageUploadDragProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file type
    if (!ALLOWED_FORMATS.includes(file.type)) {
      return {
        valid: false,
        error: `Ungültiges Format: ${file.name}. Nur JPG, PNG und WebP sind erlaubt (max. 5MB).`
      };
    }

    // Double-check extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
      return {
        valid: false,
        error: `Ungültige Dateierweiterung: ${file.name}. Nur .jpg, .jpeg, .png und .webp sind erlaubt.`
      };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return {
        valid: false,
        error: `Datei zu groß: ${file.name} (${sizeMB}MB). Maximale Größe ist 5MB.`
      };
    }

    return { valid: true };
  };

  const uploadFile = async (file: File) => {
    // Validate file before upload
    const validation = validateFile(file);
    if (!validation.valid) {
      toast.error(validation.error || 'Ungültige Datei');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    const result = await uploadImage(formData);

    if (result.success && result.url) {
      const newImage: ImageInput = {
        url: result.url,
        alt_text: '',
        is_primary: images.length === 0, // First image is primary
        display_order: images.length,
        path: result.path,
      };
      onChange([...images, newImage]);
      toast.success('Bild erfolgreich hochgeladen!');
    } else {
      toast.error(result.error || 'Fehler beim Hochladen');
    }
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const allFiles = Array.from(e.dataTransfer.files);
      const validFiles: File[] = [];
      const invalidFiles: string[] = [];

      // Validate each file
      for (const file of allFiles) {
        const validation = validateFile(file);
        if (validation.valid) {
          validFiles.push(file);
        } else {
          invalidFiles.push(validation.error || file.name);
        }
      }

      // Show errors for invalid files
      if (invalidFiles.length > 0) {
        invalidFiles.forEach(error => toast.error(error));
      }

      if (validFiles.length === 0) {
        toast.error('Keine gültigen Bilder gefunden. Nur JPG, PNG und WebP (max. 5MB) sind erlaubt.');
        return;
      }

      setUploadingCount(validFiles.length);

      for (const file of validFiles) {
        await uploadFile(file);
      }

      setUploadingCount(0);
    },
    [images, onChange]
  );

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const allFiles = Array.from(e.target.files || []);
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    // Validate each file
    for (const file of allFiles) {
      const validation = validateFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        invalidFiles.push(validation.error || file.name);
      }
    }

    // Show errors for invalid files
    if (invalidFiles.length > 0) {
      invalidFiles.forEach(error => toast.error(error));
    }

    if (validFiles.length === 0) {
      toast.error('Keine gültigen Bilder ausgewählt. Nur JPG, PNG und WebP (max. 5MB) sind erlaubt.');
      e.target.value = ''; // Reset input
      return;
    }

    setUploadingCount(validFiles.length);

    for (const file of validFiles) {
      await uploadFile(file);
    }

    setUploadingCount(0);
    e.target.value = ''; // Reset input
  };

  const removeImage = async (index: number) => {
    const image = images[index];

    // If it's an existing image (has DB id), notify parent for DB deletion
    if (image.id && onRemoveExisting) {
      onRemoveExisting(image.id);
    }
    // If it's a newly uploaded image (has path but no id), delete from storage
    else if (image.path && !image.id) {
      const result = await deleteImage(image.path);
      if (!result.success) {
        toast.error('Fehler beim Löschen aus dem Speicher');
        return;
      }
    }

    const newImages = images.filter((_, i) => i !== index);

    // If we removed the primary image and there are others, make the first one primary
    if (image.is_primary && newImages.length > 0) {
      newImages[0].is_primary = true;
    }

    // Reorder display_order
    newImages.forEach((img, i) => {
      img.display_order = i;
    });

    onChange(newImages);
    toast.success('Bild gelöscht');
  };

  const updateImage = (index: number, field: keyof ImageInput, value: string | boolean) => {
    const newImages = [...images];

    if (field === 'is_primary' && value === true) {
      // Unmark all other images as primary
      newImages.forEach((img) => {
        img.is_primary = false;
      });
    }

    (newImages[index] as any)[field] = value;
    onChange(newImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);

    // Update display_order
    newImages.forEach((img, i) => {
      img.display_order = i;
    });

    onChange(newImages);
  };

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-12 text-center transition-colors
          ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
        `}
      >
        <input
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploadingCount > 0}
        />

        <div className="space-y-4">
          {uploadingCount > 0 ? (
            <>
              <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
              <div className="space-y-2">
                <p className="text-lg font-medium">Wird hochgeladen...</p>
                <p className="text-sm text-muted-foreground">
                  {uploadingCount} Bild{uploadingCount > 1 ? 'er' : ''} wird hochgeladen
                </p>
              </div>
            </>
          ) : (
            <>
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  Ziehen Sie Ihre Bilder hierher
                </p>
                <p className="text-sm text-muted-foreground">
                  oder klicken Sie, um Dateien auszuwählen
                </p>
                <p className="text-xs text-muted-foreground font-medium">
                  Nur JPG, PNG oder WebP • Max 5MB pro Bild
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Uploaded Images List */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Hochgeladene Bilder ({images.length})
            </h3>
            <p className="text-sm text-muted-foreground">
              Zum Neuordnen ziehen
            </p>
          </div>

          <div className="space-y-4">
            {images.map((image, index) => (
              <Card key={index} className="p-4">
                <div className="flex gap-4">
                  {/* Image Preview */}
                  <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden border bg-muted">
                    <Image
                      src={image.url}
                      alt={image.alt_text || 'Preview'}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                    {image.is_primary && (
                      <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        Hauptbild
                      </div>
                    )}
                  </div>

                  {/* Image Details */}
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`alt-${index}`}>Alternativtext *</Label>
                      <Input
                        id={`alt-${index}`}
                        value={image.alt_text}
                        onChange={(e) => updateImage(index, 'alt_text', e.target.value)}
                        placeholder="Beschreiben Sie das Bild..."
                        required
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      {!image.is_primary && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => updateImage(index, 'is_primary', true)}
                        >
                          <Star className="h-4 w-4 mr-2" />
                          Als Hauptbild festlegen
                        </Button>
                      )}

                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => moveImage(index, Math.max(0, index - 1))}
                          disabled={index === 0}
                        >
                          ↑
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => moveImage(index, Math.min(images.length - 1, index + 1))}
                          disabled={index === images.length - 1}
                        >
                          ↓
                        </Button>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImage(index)}
                        className="ml-auto text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Löschen
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {images.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          Noch keine Bilder hochgeladen. Fügen Sie Bilder oben hinzu.
        </p>
      )}
    </div>
  );
}
