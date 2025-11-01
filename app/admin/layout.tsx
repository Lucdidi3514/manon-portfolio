import { createClient } from '@/lib/supabase/server';
import { AdminSidebar } from '@/components/admin/admin-sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex h-screen bg-muted/30">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container max-w-7xl mx-auto px-6 py-10 lg:px-8 lg:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
