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
import { createCategory } from '@/lib/supabase/category-actions';
import { SingleImageUpload } from '@/components/admin/single-image-upload';

export default function NewCategoryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const name = formData.get('name') as string;
      const description = formData.get('description') as string;

      const result = await createCategory({
        name,
        description: description || undefined,
        image_url: imageUrl || undefined,
      });

      if (result.success) {
        toast.success(`Kategorie "${name}" erfolgreich erstellt!`);
        router.push('/admin/categories');
        router.refresh();
      } else {
        toast.error(result.error || 'Fehler beim Erstellen der Kategorie');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Fehler beim Erstellen der Kategorie');
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
          <h1 className="text-3xl font-bold tracking-tight">Neue Kategorie</h1>
          <p className="text-muted-foreground">Erstellen Sie eine neue Kategorie für Ihre Kreationen</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Kategorie-Details</CardTitle>
              <CardDescription>Geben Sie die grundlegenden Informationen ein</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="z.B. Socken, Pullover, Taschen"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Der Name der Kategorie, wie er auf der Website angezeigt wird
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Optional: Beschreiben Sie diese Kategorie..."
                  rows={4}
                />
                <p className="text-sm text-muted-foreground">
                  Eine kurze Beschreibung der Kategorie (optional)
                </p>
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
                  Wird erstellt...
                </>
              ) : (
                'Kategorie erstellen'
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
