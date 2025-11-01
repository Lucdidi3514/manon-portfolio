import { Suspense } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { createClient } from '@/lib/supabase/server';
import { Plus, Image, FolderOpen, Eye } from 'lucide-react';

async function getDashboardStats() {
  const supabase = createClient();

  const [
    { count: totalCreations },
    { count: publishedCreations },
    { count: draftCreations },
    { count: totalCategories },
  ] = await Promise.all([
    supabase.from('creations').select('*', { count: 'exact', head: true }),
    supabase.from('creations').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('creations').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
  ]);

  return {
    totalCreations: totalCreations || 0,
    publishedCreations: publishedCreations || 0,
    draftCreations: draftCreations || 0,
    totalCategories: totalCategories || 0,
  };
}

interface RecentCreation {
  id: string;
  title: string;
  status: string;
  created_at: string;
}

async function getRecentCreations(): Promise<RecentCreation[]> {
  const supabase = createClient();

  const { data } = await supabase
    .from('creations')
    .select('id, title, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  return (data || []) as RecentCreation[];
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-12 w-64" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    </div>
  );
}

async function DashboardContent() {
  const stats = await getDashboardStats();
  const recentCreations = await getRecentCreations();

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Übersicht</h1>
          <p className="text-muted-foreground">Willkommen zurück! Hier ist eine Übersicht Ihres Ateliers.</p>
        </div>
        <Button asChild size="lg">
          <Link href="/admin/creations/new">
            <Plus className="mr-2 h-4 w-4" />
            Neue Kreation
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kreationen gesamt</CardTitle>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCreations}</div>
            <p className="text-xs text-muted-foreground">
              {stats.publishedCreations} veröffentlicht, {stats.draftCreations} Entwürfe
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Veröffentlicht</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.publishedCreations}</div>
            <p className="text-xs text-muted-foreground">Sichtbar auf der Webseite</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kategorien</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCategories}</div>
            <p className="text-xs text-muted-foreground">Organisieren Sie Ihre Arbeit</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Neueste Kreationen</CardTitle>
            <CardDescription>Ihre neuesten Ergänzungen zur Sammlung</CardDescription>
          </CardHeader>
          <CardContent>
            {recentCreations.length === 0 ? (
              <p className="text-sm text-muted-foreground">Noch keine Kreationen. Erstellen Sie Ihre erste!</p>
            ) : (
              <div className="space-y-5">
                {recentCreations.map((creation) => (
                  <div key={creation.id} className="flex items-center justify-between">
                    <div>
                      <Link
                        href={`/admin/creations/${creation.id}/edit`}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {creation.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {new Date(creation.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        creation.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {creation.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schnellzugriff</CardTitle>
            <CardDescription>Häufige Aufgaben und Abkürzungen</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-start h-11">
              <Link href="/admin/creations/new">
                <Plus className="mr-2 h-4 w-4" />
                Neue Kreation erstellen
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start h-11">
              <Link href="/admin/categories">
                <FolderOpen className="mr-2 h-4 w-4" />
                Kategorien verwalten
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start h-11">
              <Link href="/" target="_blank">
                <Eye className="mr-2 h-4 w-4" />
                Webseite ansehen
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
