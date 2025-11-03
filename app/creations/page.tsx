import { Suspense } from 'react';
import { Container } from '@/components/layout/container';
import { CreationsGrid } from '@/components/creations/creations-grid';
import { Skeleton } from '@/components/ui/skeleton';
import { getCategories, getPublishedCreations } from '@/lib/supabase/queries';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alle Kreationen | Atelier',
  description: 'Stöbern Sie in meiner kompletten Sammlung handgefertigter Nähkreationen. Filtern Sie nach Kategorie, um Ihr perfektes Stück zu finden.',
};

export const revalidate = 60;

function LoadingSkeleton() {
  return (
    <Container className="py-12">
      <div className="space-y-8">
        <Skeleton className="h-12 w-64 mx-auto" />
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-xl" />
          ))}
        </div>
      </div>
    </Container>
  );
}

interface CreationsContentProps {
  searchParams: { page?: string; category?: string };
}

async function CreationsContent({ searchParams }: CreationsContentProps) {
  const [categories, creations] = await Promise.all([
    getCategories(),
    getPublishedCreations(),
  ]);

  const currentPage = parseInt(searchParams.page || '1', 10);
  const selectedCategory = searchParams.category || null;

  return (
    <Container className="py-12">
      <div className="mb-12 text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Alle Kreationen
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Erkunden Sie meine komplette Sammlung handgefertigter Stücke. Jede Kreation ist einzigartig und mit Sorgfalt gefertigt.
        </p>
      </div>

      <CreationsGrid
        categories={categories}
        creations={creations}
        initialPage={currentPage}
        initialCategory={selectedCategory}
      />
    </Container>
  );
}

export default function CreationsPage({ searchParams }: { searchParams: { page?: string; category?: string } }) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <CreationsContent searchParams={searchParams} />
    </Suspense>
  );
}
