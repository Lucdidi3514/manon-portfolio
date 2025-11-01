import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, GripVertical } from 'lucide-react';
import Link from 'next/link';
import { DeleteCategoryButton } from '@/components/admin/delete-category-button';

export const dynamic = 'force-dynamic';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  creations?: any[];
}

async function getCategories(): Promise<Category[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('categories')
    .select('*, creations(count)')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return (data || []) as Category[];
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Kategorien</h1>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre Produktkategorien
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/categories/new">
            <Plus className="h-4 w-4 mr-2" />
            Neue Kategorie
          </Link>
        </Button>
      </div>

      {categories.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Noch keine Kategorien</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Erstellen Sie Ihre erste Kategorie, um Ihre Kreationen zu organisieren.
                </p>
              </div>
              <Button asChild>
                <Link href="/admin/categories/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Erste Kategorie erstellen
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Alle Kategorien ({categories.length})</CardTitle>
            <CardDescription>
              Kategorien werden in dieser Reihenfolge auf der Website angezeigt
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {categories.map((category) => {
                const creationCount = Array.isArray(category.creations)
                  ? category.creations.length
                  : 0;

                return (
                  <div
                    key={category.id}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="cursor-move text-muted-foreground hover:text-foreground">
                      <GripVertical className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold truncate">{category.name}</h3>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full flex-shrink-0">
                          {creationCount} {creationCount === 1 ? 'Kreation' : 'Kreationen'}
                        </span>
                      </div>
                      {category.description && (
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {category.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/categories/${category.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteCategoryButton
                        categoryId={category.id}
                        categoryName={category.name}
                        hasCreations={creationCount > 0}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-muted/50">
        <CardContent className="py-6">
          <div className="flex items-start gap-4">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Hinweis zur Sortierung</p>
              <p className="text-sm text-muted-foreground">
                Die Reihenfolge der Kategorien können Sie in Zukunft per Drag & Drop ändern.
                Momentan werden sie nach der Display-Order sortiert, die Sie beim Bearbeiten ändern können.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
