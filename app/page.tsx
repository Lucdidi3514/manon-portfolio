import Link from 'next/link';
import { Suspense } from 'react';
import { Container } from '@/components/layout/container';
import { CreationCard } from '@/components/creations/creation-card';
import { CategoryCard } from '@/components/categories/category-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getCategories, getLatestCreations } from '@/lib/supabase/queries';
import { ArrowRight, Sparkles } from 'lucide-react';

export const revalidate = 60;

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Container className="py-16 md:py-24 lg:py-32">
        <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Mit Liebe handgefertigt
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Einzigartige Näh
            <span className="block text-primary">Kreationen</span>
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
            Entdecken Sie einzigartige handgefertigte Stücke mit Liebe zum Detail.
            Jede Kreation erzählt eine besondere Geschichte durch Stoff und Faden.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="group">
              <Link href="/creations">
                Kreationen entdecken
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

async function CategoriesSection() {
  const categories = await getCategories();

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="mb-12 text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Nach Kategorie entdecken
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Erkunden Sie unsere vielfältige Sammlung handgefertigter Stücke, sortiert nach Stil und Zweck.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
          {categories.slice(0, 8).map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        {categories.length > 8 && (
          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/creations">
                Alle Kategorien ansehen
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}

async function LatestCreationsSection() {
  const creations = await getLatestCreations(6);

  if (creations.length === 0) {
    return (
      <section className="py-16 md:py-24 bg-muted/30">
        <Container>
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Neueste Kreationen
            </h2>
            <p className="text-muted-foreground">
              Noch keine Kreationen verfügbar. Schauen Sie bald wieder vorbei!
            </p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <Container>
        <div className="mb-12 text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Neueste Kreationen
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Entdecken Sie unsere neuesten handgefertigten Stücke, frisch aus dem Atelier.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {creations.map((creation) => (
            <CreationCard key={creation.id} creation={creation} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild size="lg" variant="outline">
            <Link href="/creations">
              Alle Kreationen ansehen
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}

function LoadingSkeleton() {
  return (
    <Container className="py-16">
      <div className="space-y-8">
        <Skeleton className="h-96 w-full rounded-xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    </Container>
  );
}

export default async function HomePage() {
  return (
    <>
      <HeroSection />

      <Suspense fallback={<LoadingSkeleton />}>
        <CategoriesSection />
      </Suspense>

      <Suspense fallback={<LoadingSkeleton />}>
        <LatestCreationsSection />
      </Suspense>
    </>
  );
}
