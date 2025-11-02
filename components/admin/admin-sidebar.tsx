'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Image, FolderOpen, LogOut, Scissors, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/supabase/auth-actions';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

const navigation = [
  { name: 'Übersicht', href: '/admin', icon: Home },
  { name: 'Kreationen', href: '/admin/creations', icon: Image },
  { name: 'Kategorien', href: '/admin/categories', icon: FolderOpen },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  // Empêcher le scroll du body quand le menu mobile est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      const result = await signOut();

      if (result?.error) {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Abmeldung fehlgeschlagen');
    }
  };

  return (
    <>
      {/* Overlay pour mobile et tablette */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'w-72 bg-card border-r border-border flex flex-col',
          // Sur mobile/tablette: position fixe, cachée par défaut, slide depuis la gauche
          // Sur desktop (>= 1024px): toujours visible en position relative
          'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="px-6 py-8 border-b border-border flex items-center justify-between">
          <Link href="/admin" className="flex items-center space-x-3 group" onClick={onClose}>
            <Scissors className="h-7 w-7 text-primary transition-transform group-hover:rotate-12" />
            <span className="text-2xl font-semibold">Admin</span>
          </Link>

          {/* Bouton fermer sur mobile et tablette uniquement */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
            aria-label="Fermer le menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-6 border-t border-border space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start"
            asChild
          >
            <Link href="/" target="_blank">
              <Home className="mr-2 h-4 w-4" />
              Webseite ansehen
            </Link>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Abmelden
          </Button>
        </div>
      </div>
    </>
  );
}
