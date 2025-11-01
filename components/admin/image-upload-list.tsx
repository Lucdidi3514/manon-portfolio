'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus, GripVertical } from 'lucide-react';
import { Card } from '@/components/ui/card';

export interface ImageInput {
  url: string;
  alt_text: string;
  is_primary: boolean;
  display_order: number;
}

interface ImageUploadListProps {
  images: ImageInput[];
  onChange: (images: ImageInput[]) => void;
}

export function ImageUploadList({ images, onChange }: ImageUploadListProps) {
  const addImage = () => {
    const newImage: ImageInput = {
      url: '',
      alt_text: '',
      is_primary: images.length === 0,
      display_order: images.length,
    };
    onChange([...images, newImage]);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    // If we removed the primary image and there are others, make the first one primary
    if (images[index].is_primary && newImages.length > 0) {
      newImages[0].is_primary = true;
    }
    // Update display orders
    newImages.forEach((img, i) => {
      img.display_order = i;
    });
    onChange(newImages);
  };

  const updateImage = (index: number, field: keyof ImageInput, value: string | boolean) => {
    const newImages = [...images];
    if (field === 'is_primary' && value === true) {
      // Unset all other primary flags
      newImages.forEach(img => {
        img.is_primary = false;
      });
    }
    (newImages[index] as any)[field] = value;
    onChange(newImages);
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === images.length - 1)
    ) {
      return;
    }

    const newImages = [...images];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];

    // Update display orders
    newImages.forEach((img, i) => {
      img.display_order = i;
    });

    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label>Bilder</Label>
          <p className="text-sm text-muted-foreground">
            Fügen Sie 2-3 Bilder hinzu. Das erste Bild wird als Hauptbild verwendet.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addImage}
          disabled={images.length >= 5}
        >
          <Plus className="h-4 w-4 mr-2" />
          Bild hinzufügen
        </Button>
      </div>

      {images.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">Noch keine Bilder hinzugefügt</p>
          <Button type="button" variant="outline" onClick={addImage}>
            <Plus className="h-4 w-4 mr-2" />
            Erstes Bild hinzufügen
          </Button>
        </Card>
      )}

      <div className="space-y-3">
        {images.map((image, index) => (
          <Card key={index} className="p-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex flex-col gap-1 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => moveImage(index, 'up')}
                    disabled={index === 0}
                  >
                    <GripVertical className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`image-url-${index}`}>
                        Bild URL * {image.is_primary && <span className="text-primary">(Hauptbild)</span>}
                      </Label>
                      <Input
                        id={`image-url-${index}`}
                        placeholder="https://beispiel.com/bild.jpg"
                        value={image.url}
                        onChange={(e) => updateImage(index, 'url', e.target.value)}
                        required
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="mt-7"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`image-alt-${index}`}>Alt-Text (für Barrierefreiheit)</Label>
                    <Input
                      id={`image-alt-${index}`}
                      placeholder="Beschreibung des Bildes"
                      value={image.alt_text}
                      onChange={(e) => updateImage(index, 'alt_text', e.target.value)}
                    />
                  </div>

                  {images.length > 1 && !image.is_primary && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateImage(index, 'is_primary', true)}
                    >
                      Als Hauptbild festlegen
                    </Button>
                  )}

                  {/* Preview */}
                  {image.url && (
                    <div className="relative aspect-video w-full max-w-xs rounded-lg overflow-hidden border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image.url}
                        alt={image.alt_text || 'Preview'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EBild nicht gefunden%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {images.length > 0 && images.length < 5 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addImage}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Weiteres Bild hinzufügen ({images.length}/5)
        </Button>
      )}
    </div>
  );
}
