'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Eye, ChevronUp, ChevronDown } from 'lucide-react';
import { DeleteCreationButton } from '@/components/admin/delete-creation-button';
import { reorderCreations, getAllCreations } from '@/lib/supabase/admin-actions';
import { toast } from 'sonner';

interface Creation {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  featured: boolean;
  created_at: string;
  published_at: string | null;
  display_order: number;
  category: { name: string } | null;
}

export default function CreationsPage() {
  const [creations, setCreations] = useState<Creation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReordering, setIsReordering] = useState(false);

  useEffect(() => {
    loadCreations();
  }, []);

  const loadCreations = async () => {
    setIsLoading(true);
    const data = await getAllCreations();
    setCreations(data as Creation[]);
    setIsLoading(false);
  };

  const moveCreation = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= creations.length) return;

    // Optimistic update
    const newCreations = [...creations];
    const [movedItem] = newCreations.splice(index, 1);
    newCreations.splice(newIndex, 0, movedItem);
    setCreations(newCreations);

    // Save to backend
    setIsReordering(true);
    const result = await reorderCreations(newCreations.map(c => c.id));
    setIsReordering(false);

    if (!result.success) {
      toast.error(result.error || 'Fehler beim Neuordnen');
      // Revert on error
      loadCreations();
    } else {
      toast.success('Reihenfolge aktualisiert');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Kreationen</h1>
        </div>
        <div className="text-center py-12">Lädt...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Kreationen</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Verwalten Sie Ihre handgefertigten Kreationen</p>
        </div>
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href="/admin/creations/new">
            <Plus className="mr-2 h-4 w-4" />
            Neue Kreation
          </Link>
        </Button>
      </div>

      {creations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">Noch keine Kreationen vorhanden</p>
            <Button asChild>
              <Link href="/admin/creations/new">
                <Plus className="mr-2 h-4 w-4" />
                Erste Kreation erstellen
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {creations.map((creation) => (
            <Card key={creation.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">{creation.title}</CardTitle>
                      {creation.featured && (
                        <Badge variant="secondary">Hervorgehoben</Badge>
                      )}
                    </div>
                    <CardDescription className="flex flex-col sm:flex-row sm:gap-4 gap-1">
                      {creation.category?.name && (
                        <span>Kategorie: {creation.category.name}</span>
                      )}
                      <span>
                        Erstellt: {new Date(creation.created_at).toLocaleDateString('de-DE')}
                      </span>
                      {creation.published_at && (
                        <span>
                          Veröffentlicht: {new Date(creation.published_at).toLocaleDateString('de-DE')}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <Badge variant={creation.status === 'published' ? 'default' : 'outline'}>
                    {creation.status === 'published' ? 'Veröffentlicht' : 'Entwurf'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/creations/${creation.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Bearbeiten
                      </Link>
                    </Button>
                    {creation.status === 'published' && (
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/creations/${creation.slug}`} target="_blank">
                          <Eye className="mr-2 h-4 w-4" />
                          Ansehen
                        </Link>
                      </Button>
                    )}
                    <DeleteCreationButton
                      creationId={creation.id}
                      creationTitle={creation.title}
                    />
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveCreation(creations.indexOf(creation), 'up')}
                      disabled={creations.indexOf(creation) === 0 || isReordering}
                      className="h-9 px-3"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveCreation(creations.indexOf(creation), 'down')}
                      disabled={creations.indexOf(creation) === creations.length - 1 || isReordering}
                      className="h-9 px-3"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
