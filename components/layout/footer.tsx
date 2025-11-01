import Link from 'next/link';
import { Scissors } from 'lucide-react';
import { Container } from './container';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <Container>
        <div className="py-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <Scissors className="h-5 w-5 text-primary transition-transform group-hover:rotate-12" />
              <span className="text-lg font-semibold">Atelier</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Mit Liebe handgefertigt. Jede Kreation erzählt eine einzigartige Geschichte durch Stoff und Faden.
            </p>
          </div>
        </div>

        <div className="border-t border-border/40 py-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Atelier. Alle Rechte vorbehalten.
            </p>
            <Link
              href="/admin/login"
              className="text-xs text-muted-foreground/50 hover:text-primary transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
