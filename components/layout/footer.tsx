import Link from 'next/link';
import { Instagram, Facebook, Mail, Scissors } from 'lucide-react';
import { Container } from './container';

const socialLinks = [
  { name: 'Instagram', href: '#', icon: Instagram },
  { name: 'Facebook', href: '#', icon: Facebook },
  { name: 'Email', href: 'mailto:contact@atelier.com', icon: Mail },
];

const footerLinks = [
  { name: 'Über mich', href: '/about' },
  { name: 'Kontakt', href: '/contact' },
  { name: 'Datenschutz', href: '/privacy' },
  { name: 'Impressum', href: '/legal' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <Container>
        <div className="py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="space-y-4">
              <Link href="/" className="flex items-center space-x-2 group">
                <Scissors className="h-5 w-5 text-primary transition-transform group-hover:rotate-12" />
                <span className="text-lg font-semibold">Atelier</span>
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs">
                Mit Liebe handgefertigt. Jede Kreation erzählt eine einzigartige Geschichte durch Stoff und Faden.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-4">Schnellzugriff</h3>
              <ul className="space-y-2">
                {footerLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-4">Verbinden</h3>
              <div className="flex space-x-4">
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label={link.name}
                      target={link.name !== 'Email' ? '_blank' : undefined}
                      rel={link.name !== 'Email' ? 'noopener noreferrer' : undefined}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>
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
