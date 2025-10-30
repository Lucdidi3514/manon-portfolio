import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { ImageGallery } from '@/components/creations/image-gallery';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ShareButtons } from '@/components/creations/share-buttons';
import { Skeleton } from '@/components/ui/skeleton';
import { getCreationBySlug, getPublishedCreations } from '@/lib/supabase/queries';
import { Metadata } from 'next';
import Link from 'next/link';
import { CreationCard } from '@/components/creations/creation-card';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const creation = await getCreationBySlug(params.slug);

  if (!creation) {
    return {
      title: 'Creation Not Found',
    };
  }

  const primaryImage = creation.images.find((img) => img.is_primary) || creation.images[0];

  return {
    title: `${creation.title} | Atelier`,
    description: creation.description.substring(0, 160),
    openGraph: {
      title: creation.title,
      description: creation.description,
      images: primaryImage ? [primaryImage.url] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: creation.title,
      description: creation.description,
      images: primaryImage ? [primaryImage.url] : [],
    },
  };
}

function LoadingSkeleton() {
  return (
    <Container className="py-12">
      <div className="grid lg:grid-cols-2 gap-12">
        <Skeleton className="h-[600px] rounded-xl" />
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </Container>
  );
}

async function CreationContent({ slug }: { slug: string }) {
  const creation = await getCreationBySlug(slug);

  if (!creation) {
    notFound();
  }

  const relatedCreations = creation.category_id
    ? (await getPublishedCreations(creation.category_id))
        .filter((c) => c.id !== creation.id)
        .slice(0, 3)
    : [];

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
            {creation.category && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/category/${creation.category.slug}`}>
                    {creation.category.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{creation.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Container>

      <Container className="py-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <ImageGallery images={creation.images} title={creation.title} />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-4">
                {creation.title}
              </h1>
              {creation.category && (
                <Link href={`/category/${creation.category.slug}`}>
                  <Badge variant="secondary" className="text-sm hover:bg-secondary/80 transition-colors cursor-pointer">
                    {creation.category.name}
                  </Badge>
                </Link>
              )}
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {creation.description}
              </p>
            </div>

            {creation.materials.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Materials</h3>
                <div className="flex flex-wrap gap-2">
                  {creation.materials.map((material, index) => (
                    <Badge key={index} variant="outline">
                      {material}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {creation.sizes.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Sizes</h3>
                <div className="flex flex-wrap gap-2">
                  {creation.sizes.map((size, index) => (
                    <Badge key={index} variant="outline">
                      {size}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {creation.colors.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Colors</h3>
                <div className="flex flex-wrap gap-2">
                  {creation.colors.map((color, index) => (
                    <Badge key={index} variant="outline">
                      {color}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-6 border-t">
              <h3 className="font-semibold mb-4">Share this creation</h3>
              <ShareButtons title={creation.title} />
            </div>

            <div className="pt-6">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>

      {relatedCreations.length > 0 && (
        <Container className="py-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Related Creations</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedCreations.map((related) => (
              <CreationCard key={related.id} creation={related} />
            ))}
          </div>
        </Container>
      )}
    </>
  );
}

export default function CreationPage({ params }: { params: { slug: string } }) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <CreationContent slug={params.slug} />
    </Suspense>
  );
}
