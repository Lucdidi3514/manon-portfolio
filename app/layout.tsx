import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Atelier - Handgefertigte Nähkreationen',
  description: 'Entdecken Sie einzigartige handgefertigte Nähkreationen mit Liebe zum Detail. Jedes Stück erzählt eine Geschichte durch Stoff und Faden.',
  keywords: ['handgefertigt', 'nähen', 'handwerk', 'kunsthandwerk', 'einzigartig', 'maßanfertigung'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
