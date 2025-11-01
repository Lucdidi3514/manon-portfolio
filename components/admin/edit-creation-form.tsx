'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ImageUploadDrag, ImageInput } from '@/components/admin/image-upload-drag';
import { updateCreation, getCategories } from '@/lib/supabase/admin-actions';
import { deleteImage } from '@/lib/supabase/storage-actions';

interface Category {
  id: string;
  name: string;
}

interface Creation {
  id: string;
  title: string;
  description: string | null;
  category_id: string | null;
  materials: string[];
  sizes: string[];
  colors: string[];
  featured: boolean;
  status: 'draft' | 'published';
  creation_images: Array<{
    id: string;
    url: string;
    alt_text: string;
    is_primary: boolean;
    display_order: number;
  }>;
}

interface EditCreationFormProps {
  creation: Creation;
}

export function EditCreationForm({ creation }: EditCreationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<ImageInput[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [featured, setFeatured] = useState(creation.featured);
  const [published, setPublished] = useState(creation.status === 'published');
  const [selectedCategory, setSelectedCategory] = useState<string>(creation.category_id || '');

  useEffect(() => {
    // Load categories
    getCategories().then(setCategories);

    // Convert existing images to ImageInput format
    const existingImages: ImageInput[] = creation.creation_images
      .sort((a, b) => a.display_order - b.display_order)
      .map((img) => ({
        id: img.id,
        url: img.url,
        alt_text: img.alt_text,
        is_primary: img.is_primary,
        display_order: img.display_order,
      }));

    setImages(existingImages);
  }, [creation]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      // Validate images
      if (images.length === 0) {
        toast.error('Bitte fügen Sie mindestens ein Bild hinzu');
        setIsSubmitting(false);
        return;
      }

      // Validate that all images have URLs
      if (images.some(img => !img.url.trim())) {
        toast.error('Bitte füllen Sie alle Bild-URLs aus');
        setIsSubmitting(false);
        return;
      }

      // Parse comma-separated values
      const materials = (formData.get('materials') as string || '')
        .split(',')
        .map(m => m.trim())
        .filter(m => m);

      const sizes = (formData.get('sizes') as string || '')
        .split(',')
        .map(s => s.trim())
        .filter(s => s);

      const colors = (formData.get('colors') as string || '')
        .split(',')
        .map(c => c.trim())
        .filter(c => c);

      // Delete removed images from storage
      if (imagesToDelete.length > 0) {
        for (const imageId of imagesToDelete) {
          const imageToDelete = creation.creation_images.find(img => img.id === imageId);
          if (imageToDelete && imageToDelete.url) {
            // Extract path from URL
            const urlParts = imageToDelete.url.split('/');
            const filename = urlParts[urlParts.length - 1];
            await deleteImage(filename);
          }
        }
      }

      const result = await updateCreation({
        id: creation.id,
        title: formData.get('title') as string,
        description: formData.get('description') as string || '',
        category_id: selectedCategory || null,
        materials,
        sizes,
        colors,
        featured,
        status: published ? 'published' : 'draft',
        images: images.map((img) => ({
          id: img.id,
          url: img.url,
          alt_text: img.alt_text,
          is_primary: img.is_primary,
          display_order: img.display_order,
          path: img.path,
        })),
        imagesToDelete,
      });

      if (result.success) {
        toast.success(`Kreation "${formData.get('title')}" erfolgreich aktualisiert!`);
        router.push('/admin/creations');
        router.refresh();
      } else {
        toast.error(result.error || 'Fehler beim Aktualisieren der Kreation');
      }
    } catch (error) {
      console.error('Error updating creation:', error);
      toast.error('Fehler beim Aktualisieren der Kreation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin/creations">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Kreation bearbeiten</h1>
          <p className="text-muted-foreground">Ändern Sie die Details dieser Kreation</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Grundinformationen</CardTitle>
              <CardDescription>Aktualisieren Sie die wichtigsten Details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titel *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="z.B. Handgefertigte Tasche mit Blumenmuster"
                  defaultValue={creation.title}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category_id">Kategorie</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Kategorie wählen (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Optional - leer lassen für keine Kategorie
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Beschreiben Sie Ihre Kreation im Detail..."
                  rows={6}
                  defaultValue={creation.description || ''}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="materials">Materialien</Label>
                  <Input
                    id="materials"
                    name="materials"
                    placeholder="z.B. Baumwolle, Leinen"
                    defaultValue={creation.materials.join(', ')}
                  />
                  <p className="text-sm text-muted-foreground">Durch Kommas getrennt</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sizes">Größen</Label>
                  <Input
                    id="sizes"
                    name="sizes"
                    placeholder="z.B. Klein, Mittel, Groß"
                    defaultValue={creation.sizes.join(', ')}
                  />
                  <p className="text-sm text-muted-foreground">Durch Kommas getrennt</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="colors">Farben</Label>
                  <Input
                    id="colors"
                    name="colors"
                    placeholder="z.B. Blau, Weiß, Rot"
                    defaultValue={creation.colors.join(', ')}
                  />
                  <p className="text-sm text-muted-foreground">Durch Kommas getrennt</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bilder</CardTitle>
              <CardDescription>
                Verwalten Sie die Bilder dieser Kreation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUploadDrag images={images} onChange={setImages} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Veröffentlichung</CardTitle>
              <CardDescription>Steuern Sie die Sichtbarkeit Ihrer Kreation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="featured">Als hervorgehoben markieren</Label>
                  <p className="text-sm text-muted-foreground">
                    Hervorgehobene Kreationen erscheinen auf der Startseite
                  </p>
                </div>
                <Switch
                  id="featured"
                  checked={featured}
                  onCheckedChange={setFeatured}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="published">Veröffentlicht</Label>
                  <p className="text-sm text-muted-foreground">
                    Veröffentlichte Kreationen sind öffentlich sichtbar
                  </p>
                </div>
                <Switch
                  id="published"
                  checked={published}
                  onCheckedChange={setPublished}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/creations">Abbrechen</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wird aktualisiert...
                </>
              ) : (
                'Änderungen speichern'
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
