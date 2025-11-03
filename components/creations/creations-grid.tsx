'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CreationCard } from './creation-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Category, CreationWithDetails } from '@/lib/supabase/types';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';

interface CreationsGridProps {
  categories: Category[];
  creations: CreationWithDetails[];
  initialPage?: number;
  initialCategory?: string | null;
}

const ITEMS_PER_PAGE = 12;

export function CreationsGrid({ categories, creations, initialPage = 1, initialCategory = null }: CreationsGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const filteredCreations = useMemo(() => {
    if (!selectedCategory) return creations;
    return creations.filter((creation) => creation.category_id === selectedCategory);
  }, [creations, selectedCategory]);

  const totalPages = Math.ceil(filteredCreations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const visibleCreations = filteredCreations.slice(startIndex, endIndex);

  // Update URL when page or category changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set('page', currentPage.toString());
    if (selectedCategory) params.set('category', selectedCategory);

    const newUrl = params.toString() ? `/creations?${params.toString()}` : '/creations';
    router.replace(newUrl, { scroll: false });
  }, [currentPage, selectedCategory, router]);

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page when category changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push(-1); // Ellipsis
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push(-1);
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push(-1);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push(-1);
        pages.push(totalPages);
      }
    }

    return pages;
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
          Zeige {startIndex + 1}-{Math.min(endIndex, filteredCreations.length)} von {filteredCreations.length} Kreationen
        </p>
        {totalPages > 1 && (
          <p className="text-sm text-muted-foreground">
            Seite {currentPage} von {totalPages}
          </p>
        )}
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

          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-4 pt-8">
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Zurück
                </Button>

                <div className="flex gap-1">
                  {getPageNumbers().map((page, index) => (
                    page === -1 ? (
                      <span key={`ellipsis-${index}`} className="px-3 py-2 text-muted-foreground">
                        ...
                      </span>
                    ) : (
                      <Button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="sm"
                        className="min-w-[40px]"
                      >
                        {page}
                      </Button>
                    )
                  ))}
                </div>

                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                >
                  Weiter
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
