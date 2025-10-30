'use client';

import { useState, useMemo } from 'react';
import { CreationCard } from './creation-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Category, CreationWithDetails } from '@/lib/supabase/types';
import { Filter } from 'lucide-react';

interface CreationsGridProps {
  categories: Category[];
  creations: CreationWithDetails[];
}

const ITEMS_PER_PAGE = 12;

export function CreationsGrid({ categories, creations }: CreationsGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const filteredCreations = useMemo(() => {
    if (!selectedCategory) return creations;
    return creations.filter((creation) => creation.category_id === selectedCategory);
  }, [creations, selectedCategory]);

  const visibleCreations = filteredCreations.slice(0, visibleCount);
  const hasMore = visibleCount < filteredCreations.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  if (creations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          Noch keine Kreationen verfügbar. Schauen Sie bald wieder vorbei!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {categories.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>Nach Kategorie filtern:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === null ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-primary/90 transition-colors px-4 py-2 text-sm"
              onClick={() => handleCategoryChange(null)}
            >
              Alle ({creations.length})
            </Badge>
            {categories.map((category) => {
              const count = creations.filter(
                (c) => c.category_id === category.id
              ).length;
              return (
                <Badge
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-primary/90 transition-colors px-4 py-2 text-sm"
                  onClick={() => handleCategoryChange(category.id)}
                >
                  {category.name} ({count})
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Zeige {visibleCreations.length} von {filteredCreations.length} Kreationen
        </p>
      </div>

      {filteredCreations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            Keine Kreationen in dieser Kategorie gefunden.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleCreations.map((creation) => (
              <CreationCard key={creation.id} creation={creation} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center pt-8">
              <Button onClick={handleLoadMore} variant="outline" size="lg">
                Mehr laden
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
