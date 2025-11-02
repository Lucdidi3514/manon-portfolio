'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Scissors } from 'lucide-react';
import { Container } from './container';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Startseite', href: '/' },
  { name: 'Kreationen', href: '/creations' },
  { name: 'Admin', href: '/admin' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Note: Scroll blocking removed to allow page navigation while menu is open

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300',
        scrolled && 'shadow-sm'
      )}
    >
      <Container>
        <nav className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <Scissors className="h-6 w-6 text-primary transition-transform group-hover:rotate-12" />
            <span className="text-xl font-semibold tracking-tight">Atelier</span>
          </Link>

          <div className="hidden md:flex md:gap-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <button
            type="button"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </nav>
      </Container>

      {mobileMenuOpen && (
        <>
          {/* Overlay de fond blanc avec z-index maximum absolu */}
          <div
            className="md:hidden"
            style={{
              position: 'fixed',
              top: '64px',
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#ffffff',
              zIndex: 2147483647, // Z-index maximum possible en CSS
              width: '100vw',
              height: 'calc(100vh - 64px)',
              overflow: 'auto',
            }}
          >
            {/* Contenu du menu */}
            <div
              style={{
                backgroundColor: '#ffffff',
                paddingTop: '24px',
                paddingBottom: '24px',
                minHeight: '100%',
              }}
            >
              <Container>
                <div className="space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block rounded-lg px-4 py-3 text-base font-medium transition-colors"
                      style={{
                        color: '#0f172a',
                        fontSize: '16px',
                        fontWeight: '500',
                        position: 'relative',
                        zIndex: 2147483647,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f1f5f9';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </Container>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
