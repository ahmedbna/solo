'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

type ImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
};

export const Image = ({
  src,
  alt,
  width,
  height,
  className,
  sizes,
}: ImageProps) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className={cn(`relative`, className)}>
      {loading && (
        <div
          className={cn(
            'absolute inset-0 w-full h-full bg-[radial-gradient(at_center,_#27272a,_#3f3f46)] animate-pulse blur-sm rounded-lg'
          )}
        />
      )}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading='lazy'
        onLoad={() => setLoading(false)}
        srcSet={`${src}?w=500 500w, ${src}?w=1000 1000w, ${src}?w=1500 1500w`}
        className={cn(
          `object-cover object-center w-full h-full transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`,
          className
        )}
      />
    </div>
  );
};
