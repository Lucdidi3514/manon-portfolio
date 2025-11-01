'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { uploadImage, deleteImage } from '@/lib/supabase/storage-actions';
import Image from 'next/image';

interface SingleImageUploadProps {
  imageUrl: string | null;
  onChange: (url: string | null, path?: string) => void;
  label?: string;
  description?: string;
}

export function SingleImageUpload({ 
  imageUrl, 
  onChange, 
  label = "Bild",
  description = "Laden Sie ein Bild für diese Kategorie hoch"
}: SingleImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [imagePath, setImagePath] = useState<string | null>(null);

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Bitte wählen Sie eine gültige Bilddatei');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Das Bild ist zu groß (max 5MB)');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const result = await uploadImage(formData);

      if (result.success && result.url) {
        onChange(result.url, result.path);
        setImagePath(result.path || null);
        toast.success('Bild erfolgreich hochgeladen!');
      } else {
        toast.error(result.error || 'Fehler beim Hochladen');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Fehler beim Hochladen des Bildes');
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  const handleRemove = async () => {
    if (imagePath) {
      const result = await deleteImage(imagePath);
      if (!result.success) {
        toast.error('Fehler beim Löschen aus dem Speicher');
        return;
      }
    }

    onChange(null);
    setImagePath(null);
    toast.success('Bild entfernt');
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>{label}</Label>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>

      {imageUrl ? (
        <Card className="p-4">
          <div className="flex gap-4">
            <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden border bg-muted">
              <Image
                src={imageUrl}
                alt="Category image"
                fill
                className="object-cover"
                sizes="128px"
              />
            </div>

            <div className="flex-1 flex items-center">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <X className="h-4 w-4 mr-2" />
                Bild entfernen
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="relative border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />

          <div className="space-y-4">
            {isUploading ? (
              <>
                <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
                <p className="text-sm font-medium">Wird hochgeladen...</p>
              </>
            ) : (
              <>
                <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Klicken Sie hier, um ein Bild auszuwählen
                  </p>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG, WebP • Max 5MB
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
