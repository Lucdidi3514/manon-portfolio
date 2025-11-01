'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { updateCategory } from '@/lib/supabase/category-actions';
import { SingleImageUpload } from '@/components/admin/single-image-upload';

interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  slug: string;
}

interface EditCategoryFormProps {
  category: Category;
}

export function EditCategoryForm({ category }: EditCategoryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(category.image_url);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const name = formData.get('name') as string;
      const description = formData.get('description') as string;
      const displayOrder = parseInt(formData.get('display_order') as string);

      const result = await updateCategory({
        id: category.id,
        name,
        description: description || undefined,
        image_url: imageUrl || undefined,
        display_order: displayOrder,
      });

      if (result.success) {
        toast.success(`Kategorie "${name}" erfolgreich aktualisiert!`);
        router.push('/admin/categories');
        router.refresh();
      } else {
        toast.error(result.error || 'Fehler beim Aktualisieren der Kategorie');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Fehler beim Aktualisieren der Kategorie');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin/categories">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Kategorie bearbeiten</h1>
          <p className="text-muted-foreground">Ändern Sie die Details dieser Kategorie</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Kategorie-Details</CardTitle>
              <CardDescription>Aktualisieren Sie die Informationen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="z.B. Socken, Pullover, Taschen"
                  defaultValue={category.name}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Optional: Beschreiben Sie diese Kategorie..."
                  defaultValue={category.description || ''}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="display_order">Anzeigereihenfolge</Label>
                <Input
                  id="display_order"
                  name="display_order"
                  type="number"
                  min="1"
                  defaultValue={category.display_order}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Niedrigere Zahlen werden zuerst angezeigt
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Slug</p>
                  <p className="text-sm text-muted-foreground font-mono">{category.slug}</p>
                  <p className="text-xs text-muted-foreground">
                    Der Slug wird automatisch aus dem Namen generiert
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kategorie-Bild</CardTitle>
              <CardDescription>Ein Bild, das diese Kategorie repräsentiert</CardDescription>
            </CardHeader>
            <CardContent>
              <SingleImageUpload
                imageUrl={imageUrl}
                onChange={(url) => setImageUrl(url)}
                label="Kategorie-Bild"
                description="Dieses Bild wird auf der Startseite und in Kategorielisten angezeigt"
              />
            </CardContent>
          </Card>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/categories">Abbrechen</Link>
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
