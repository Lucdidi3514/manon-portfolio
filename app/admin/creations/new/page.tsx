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
import { createCreation, getCategories } from '@/lib/supabase/admin-actions';

interface Category {
  id: string;
  name: string;
}

export default function NewCreationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<ImageInput[]>([]);
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    // Load categories
    getCategories().then(setCategories);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      // Validate category
      if (!selectedCategory) {
        toast.error('Bitte wählen Sie eine Kategorie aus');
        setIsSubmitting(false);
        return;
      }

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

      const result = await createCreation({
        title: formData.get('title') as string,
        description: formData.get('description') as string || '',
        category_id: selectedCategory,
        materials: [],
        sizes: [],
        colors: [],
        featured,
        status: published ? 'published' : 'draft',
        images,
      });

      if (result.success) {
        toast.success(`Kreation "${formData.get('title')}" erfolgreich erstellt!`);
        router.push('/admin/creations');
        router.refresh();
      } else {
        toast.error(result.error || 'Fehler beim Erstellen der Kreation');
      }
    } catch (error) {
      console.error('Error creating creation:', error);
      toast.error('Fehler beim Erstellen der Kreation');
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
          <h1 className="text-3xl font-bold tracking-tight">Neue Kreation</h1>
          <p className="text-muted-foreground">Erstellen Sie eine neue handgefertigte Kreation</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Grundinformationen</CardTitle>
              <CardDescription>Geben Sie die wichtigsten Details Ihrer Kreation ein</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titel *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="z.B. Handgefertigte Tasche mit Blumenmuster"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category_id">Kategorie *</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Kategorie wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Beschreiben Sie Ihre Kreation im Detail..."
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bilder</CardTitle>
              <CardDescription>
                Ziehen Sie Ihre Bilder hierher oder klicken Sie, um sie auszuwählen
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
                  <Label htmlFor="published">Sofort veröffentlichen</Label>
                  <p className="text-sm text-muted-foreground">
                    Andernfalls als Entwurf speichern
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
                  Wird erstellt...
                </>
              ) : (
                'Kreation erstellen'
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
