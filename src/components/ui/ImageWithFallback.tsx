'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
}

const FALLBACK_IMAGE = '/images/fallback/activityfallback.png';

export default function ImageWithFallback({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  sizes = '100vw'
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(FALLBACK_IMAGE);
    }
  };

  // Fonction pour normaliser l'URL de l'image
  const normalizeImageUrl = (url: string) => {
    if (!url) return FALLBACK_IMAGE;
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return url;
    return `/images/activities/${url}`;
  };

  const imgProps = {
    src: normalizeImageUrl(imgSrc),
    alt,
    className: `${className} transition-opacity duration-300`,
    onError: handleError,
    priority,
    sizes,
    loading: priority ? ('eager' as const) : ('lazy' as const),
    quality: 75,
  };

  if (fill) {
    return (
      <div className="relative w-full h-full">
        <Image 
          {...imgProps} 
          fill 
          style={{ objectFit: 'cover' }}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <Image
        {...imgProps}
        width={width || 400}
        height={height || 400}
        style={{ width: '100%', height: 'auto' }}
      />
    </div>
  );
} 