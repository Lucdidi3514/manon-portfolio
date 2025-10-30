'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function NewCreationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      toast.info('Kreationserstellung wird in Kürze verfügbar sein');
      setTimeout(() => {
        router.push('/admin/creations');
      }, 1500);
    } catch (error) {
      console.error('Error creating creation:', error);
      toast.error('Fehler beim Erstellen der Kreation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin/creations">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Neue Kreation</h1>
          <p className="text-muted-foreground">Erstellen Sie eine neue handgefertigte Kreation</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
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
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Beschreiben Sie Ihre Kreation im Detail..."
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="materials">Materialien</Label>
                  <Input
                    id="materials"
                    name="materials"
                    placeholder="z.B. Baumwolle, Leinen"
                  />
                  <p className="text-sm text-muted-foreground">Durch Kommas getrennt</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="colors">Farben</Label>
                  <Input
                    id="colors"
                    name="colors"
                    placeholder="z.B. Blau, Weiß, Rot"
                  />
                  <p className="text-sm text-muted-foreground">Durch Kommas getrennt</p>
                </div>
              </div>
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
                <Switch id="featured" name="featured" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="published">Sofort veröffentlichen</Label>
                  <p className="text-sm text-muted-foreground">
                    Andernfalls als Entwurf speichern
                  </p>
                </div>
                <Switch id="published" name="published" />
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
