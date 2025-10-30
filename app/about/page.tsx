import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Metadata } from 'next';
import Link from 'next/link';
import { Heart, Scissors, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Über mich | Atelier',
  description: 'Erfahren Sie mehr über meine Leidenschaft für handgefertigte Nähkreationen und die Geschichte hinter jedem einzigartigen Stück.',
};

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16 md:py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Heart className="h-4 w-4" />
              Meine Geschichte
            </div>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Gefertigt mit
              <span className="block text-primary">Liebe & Sorgfalt</span>
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Jeder Stich erzählt eine Geschichte, jeder Stoff bewahrt eine Erinnerung.
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="prose prose-lg max-w-none">
            <h2>Willkommen in meinem Atelier</h2>
            <p>
              Willkommen in meinem kreativen Raum, wo Leidenschaft auf Handwerkskunst trifft. Jedes Stück
              in meiner Kollektion wird liebevoll von Hand gefertigt und verbindet traditionelle Nähtechniken
              mit zeitgenössischem Design.
            </p>
            <p>
              Was als persönliches Hobby begann, hat sich zu einer vollwertigen kreativen Reise entwickelt.
              Jede Kreation entsteht aus Inspiration, die ich aus dem Alltag, der Natur und den
              wunderschönen Stoffen ziehe, die mir begegnen.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-3 text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Mit Liebe gefertigt</h3>
              <p className="text-sm text-muted-foreground">
                Jedes Stück wird mit Liebe zum Detail und echter Sorgfalt gefertigt.
              </p>
            </div>

            <div className="space-y-3 text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
                <Scissors className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Handgefertigt</h3>
              <p className="text-sm text-muted-foreground">
                Traditionelle Techniken kombiniert mit moderner Designästhetik.
              </p>
            </div>

            <div className="space-y-3 text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Einzigartige Stücke</h3>
              <p className="text-sm text-muted-foreground">
                Jede Kreation ist einzigartig und macht sie dadurch besonders.
              </p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2>Meine Philosophie</h2>
            <p>
              Ich glaube an Slow Fashion und bewusste Fertigung. Jedes Stück braucht Zeit, Geduld
              und Hingabe. Ich wähle sorgfältig hochwertige Stoffe und Materialien aus und stelle
              sicher, dass jede Kreation langlebig ist und jahrelang Freude bereitet.
            </p>
            <p>
              Nachhaltigkeit und Kreativität gehen in meinem Atelier Hand in Hand. Ich schätze die
              Unvollkommenheiten, die mit Handarbeit einhergehen, denn sie verleihen jedem Stück
              Charakter und Einzigartigkeit.
            </p>
          </div>

          <div className="pt-8 text-center">
            <Button asChild size="lg">
              <Link href="/creations">Meine Kreationen entdecken</Link>
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}
