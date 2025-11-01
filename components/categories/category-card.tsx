import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/lib/supabase/types';
import { Card } from '@/components/ui/card';

interface CategoryCardProps {
  category: Category;
  creationCount?: number;
}

export function CategoryCard({ category, creationCount }: CategoryCardProps) {
  return (
    <Link href={`/category/${category.slug}`}>
      <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {category.image_url ? (
            <Image
              src={category.image_url}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <div className="text-6xl opacity-20">🎨</div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-4 text-center space-y-1">
          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
            {category.name}
          </h3>
          {creationCount !== undefined && (
            <p className="text-sm text-muted-foreground">
              {creationCount} {creationCount === 1 ? 'Kreation' : 'Kreationen'}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}
