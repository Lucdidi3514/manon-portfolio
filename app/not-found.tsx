'use client';

import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <Container className="py-16 md:py-24">
      <div className="flex flex-col items-center justify-center text-center space-y-8 min-h-[60vh]">
        <div className="space-y-4">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Seite nicht gefunden
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Die von Ihnen gesuchte Seite existiert leider nicht. Möglicherweise wurde sie verschoben oder gelöscht.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" variant="default">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Zur Startseite
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/creations">
              Kreationen ansehen
            </Link>
          </Button>
        </div>

        <div className="pt-8">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zur vorherigen Seite
          </Button>
        </div>
      </div>
    </Container>
  );
}
