import { Suspense } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Edit, Eye, Trash2 } from 'lucide-react';

interface Creation {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  featured: boolean;
  created_at: string;
  published_at: string | null;
  category: { name: string } | null;
}

async function getCreations(): Promise<Creation[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('creations')
    .select(`
      id,
      title,
      slug,
      status,
      featured,
      created_at,
      published_at,
      category:categories(name)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching creations:', error);
    return [];
  }

  return data as Creation[];
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-64" />
      <div className="grid gap-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    </div>
  );
}

async function CreationsContent() {
  const creations = await getCreations();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kreationen</h1>
          <p className="text-muted-foreground">Verwalten Sie Ihre handgefertigten Kreationen</p>
        </div>
        <Button asChild>
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
                    <CardDescription>
                      {creation.category?.name && (
                        <span className="mr-4">Kategorie: {creation.category.name}</span>
                      )}
                      <span>
                        Erstellt: {new Date(creation.created_at).toLocaleDateString('de-DE')}
                      </span>
                      {creation.published_at && (
                        <span className="ml-4">
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
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/creations/${creation.id}`}>
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CreationsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <CreationsContent />
    </Suspense>
  );
}
