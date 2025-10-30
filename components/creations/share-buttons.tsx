'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Facebook, Link as LinkIcon, Twitter } from 'lucide-react';
import { toast } from 'sonner';

interface ShareButtonsProps {
  title: string;
}

export function ShareButtons({ title }: ShareButtonsProps) {
  const [isSharing, setIsSharing] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Schauen Sie sich diese wunderschöne handgefertigte Kreation an: ${title}`;

  const handleShare = async (platform: 'facebook' | 'twitter' | 'native' | 'copy') => {
    setIsSharing(true);

    try {
      switch (platform) {
        case 'facebook':
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            '_blank',
            'width=600,height=400'
          );
          break;

        case 'twitter':
          window.open(
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
            '_blank',
            'width=600,height=400'
          );
          break;

        case 'native':
          if (navigator.share) {
            await navigator.share({
              title: title,
              text: shareText,
              url: shareUrl,
            });
            toast.success('Erfolgreich geteilt!');
          }
          break;

        case 'copy':
          await navigator.clipboard.writeText(shareUrl);
          toast.success('Link in Zwischenablage kopiert!');
          break;
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast.error('Teilen fehlgeschlagen. Bitte versuchen Sie es erneut.');
      }
    } finally {
      setIsSharing(false);
    }
  };

  const canUseNativeShare = typeof navigator !== 'undefined' && navigator.share;

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('facebook')}
        disabled={isSharing}
      >
        <Facebook className="h-4 w-4 mr-2" />
        Facebook
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('twitter')}
        disabled={isSharing}
      >
        <Twitter className="h-4 w-4 mr-2" />
        Twitter
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('copy')}
        disabled={isSharing}
      >
        <LinkIcon className="h-4 w-4 mr-2" />
        Link kopieren
      </Button>

      {canUseNativeShare && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('native')}
          disabled={isSharing}
        >
          Teilen
        </Button>
      )}
    </div>
  );
}
