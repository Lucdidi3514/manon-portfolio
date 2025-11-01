'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageCarouselProps {
  images: {
    url: string;
    alt_text: string;
  }[];
  title: string;
}

export function ImageCarousel({ images, title }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-square bg-muted rounded-xl flex items-center justify-center">
        <p className="text-muted-foreground">Keine Bilder verfügbar</p>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-muted group">
        <Image
          src={images[currentIndex].url}
          alt={images[currentIndex].alt_text || title}
          fill
          className="object-cover"
          priority={currentIndex === 0}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Navigation Arrows - Only show if more than 1 image */}
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={goToNext}
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail Navigation - Only show if more than 1 image */}
      {images.length > 1 && (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'relative aspect-square rounded-lg overflow-hidden border-2 transition-all',
                currentIndex === index
                  ? 'border-primary ring-2 ring-primary ring-offset-2'
                  : 'border-transparent hover:border-muted-foreground/50'
              )}
              aria-label={`Go to image ${index + 1}`}
            >
              <Image
                src={image.url}
                alt={image.alt_text || `${title} - Image ${index + 1}`}
                fill
                className="object-cover"
                sizes="150px"
              />
              {currentIndex === index && (
                <div className="absolute inset-0 bg-primary/20" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Dot Indicators for mobile - Only show if 2-5 images */}
      {images.length > 1 && images.length <= 5 && (
        <div className="flex justify-center gap-2 md:hidden">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'h-2 rounded-full transition-all',
                currentIndex === index ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30'
              )}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
