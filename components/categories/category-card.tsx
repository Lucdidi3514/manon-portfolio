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
            <div className="flex h-full items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <h3 className="text-xl font-semibold text-white drop-shadow-lg">
              {category.name}
            </h3>
            {creationCount !== undefined && (
              <p className="mt-2 text-sm text-white/90 drop-shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {creationCount} {creationCount === 1 ? 'creation' : 'creations'}
              </p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
