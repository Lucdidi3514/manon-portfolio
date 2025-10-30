import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { CreationCard } from '@/components/creations/creation-card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Skeleton } from '@/components/ui/skeleton';
import { getCategoryBySlug, getPublishedCreations } from '@/lib/supabase/queries';
import { Metadata } from 'next';
import Image from 'next/image';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${category.name} | Atelier`,
    description: category.description || `Browse all ${category.name} creations in our collection.`,
  };
}

function LoadingSkeleton() {
  return (
    <Container className="py-12">
      <div className="space-y-8">
        <Skeleton className="h-48 w-full rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-xl" />
          ))}
        </div>
      </div>
    </Container>
  );
}

async function CategoryContent({ slug }: { slug: string }) {
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const creations = await getPublishedCreations(category.id);

  return (
    <>
      <Container className="py-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/creations">Creations</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{category.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Container>

      {category.image_url && (
        <div className="relative h-64 md:h-80 overflow-hidden">
          <Image
            src={category.image_url}
            alt={category.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Container className="relative h-full flex items-end pb-12">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{category.name}</h1>
              {category.description && (
                <p className="text-lg text-white/90 max-w-2xl">{category.description}</p>
              )}
            </div>
          </Container>
        </div>
      )}

      <Container className={category.image_url ? 'py-12' : 'py-8'}>
        {!category.image_url && (
          <div className="mb-12 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">{category.name}</h1>
            {category.description && (
              <p className="text-lg text-muted-foreground max-w-2xl">
                {category.description}
              </p>
            )}
          </div>
        )}

        <div className="mb-6">
          <p className="text-muted-foreground">
            {creations.length} {creations.length === 1 ? 'creation' : 'creations'}
          </p>
        </div>

        {creations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No creations in this category yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {creations.map((creation) => (
              <CreationCard key={creation.id} creation={creation} />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <CategoryContent slug={params.slug} />
    </Suspense>
  );
}
