'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <Container className="py-16 md:py-24">
      <div className="flex flex-col items-center justify-center text-center space-y-8 min-h-[60vh]">
        <div className="space-y-4">
          <div className="flex justify-center">
            <AlertTriangle className="h-24 w-24 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Etwas ist schiefgelaufen
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Es tut uns leid, aber es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es erneut.
          </p>
          {error.digest && (
            <p className="text-sm text-muted-foreground font-mono">
              Fehler-ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" variant="default" onClick={reset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Erneut versuchen
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Zur Startseite
            </Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}
