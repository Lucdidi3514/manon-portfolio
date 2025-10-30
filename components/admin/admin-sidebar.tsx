'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Image, FolderOpen, MessageSquare, LogOut, Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/supabase/auth-actions';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Übersicht', href: '/admin', icon: Home },
  { name: 'Kreationen', href: '/admin/creations', icon: Image },
  { name: 'Kategorien', href: '/admin/categories', icon: FolderOpen },
  { name: 'Nachrichten', href: '/admin/messages', icon: MessageSquare },
];

export function AdminSidebar() {
  const pathname = usePathname();

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
    <div className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <Link href="/admin" className="flex items-center space-x-2 group">
          <Scissors className="h-6 w-6 text-primary transition-transform group-hover:rotate-12" />
          <span className="text-xl font-semibold">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-2">
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
  );
}
