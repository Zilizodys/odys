'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageWithFallbackProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
}

export default function ImageWithFallback({
  src,
  alt = 'Image',
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  sizes
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div 
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        style={{ 
          width: fill ? '100%' : width,
          height: fill ? '100%' : height,
          position: fill ? 'absolute' : 'relative'
        }}
      >
        <span className="text-gray-400 text-sm text-center px-4">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      className={className}
      priority={priority}
      fill={fill}
      onError={() => setError(true)}
      sizes={fill ? "100vw" : sizes}
    />
  );
} 