import Link from 'next/link';
import Image from 'next/image';
import { CreationWithDetails } from '@/lib/supabase/types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface CreationCardProps {
  creation: CreationWithDetails;
}

export function CreationCard({ creation }: CreationCardProps) {
  const primaryImage = creation.images.find((img) => img.is_primary) || creation.images[0];

  return (
    <Link href={`/creations/${creation.slug}`}>
      <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300">
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt_text || creation.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
        </div>
        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {creation.title}
            </h3>
          </div>
          {creation.category && (
            <Badge variant="secondary" className="text-xs">
              {creation.category.name}
            </Badge>
          )}
        </div>
      </Card>
    </Link>
  );
}
