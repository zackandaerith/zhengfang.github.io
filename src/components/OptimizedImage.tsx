'use client';

import React from 'react';
import Image from 'next/image';
import { ImageData } from '@/types';

interface OptimizedImageProps extends ImageData {
  className?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  quality?: number;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
  sizes?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

/**
 * OptimizedImage component using Next.js Image with responsive sizing
 * Implements requirement 3.5: Image optimization and device-appropriate scaling
 * 
 * Features:
 * - Automatic format selection (WebP, AVIF)
 * - Device-appropriate scaling for mobile, tablet, and desktop
 * - Lazy loading with blur placeholder support
 * - Error handling with fallback images
 * - Responsive sizes based on viewport breakpoints
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  objectFit = 'cover',
  quality = 85,
  loading = 'lazy',
  onLoad,
  onError,
  sizes,
  placeholder = 'empty',
  blurDataURL,
}) => {
  const [imageError, setImageError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const handleError = () => {
    setImageError(true);
    setIsLoading(false);
    onError?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  // Fallback placeholder image
  const placeholderSrc = '/images/placeholder-case-study.jpg';

  // Determine if we should use fill or fixed dimensions
  const useFill = !width || !height;

  // Generate responsive sizes based on common breakpoints
  // Mobile: full width, Tablet: full width, Desktop: 50% width, Large: 33% width
  const defaultResponsiveSizes = useFill
    ? '(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
    : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
  
  const responsiveSizes = sizes || defaultResponsiveSizes;

  // Error fallback UI
  if (imageError) {
    return (
      <div
        className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}
        style={useFill ? undefined : { width, height }}
        role="img"
        aria-label={`${alt} (unavailable)`}
      >
        <span className="text-gray-400 dark:text-gray-500 text-sm">Image unavailable</span>
      </div>
    );
  }

  // Common image props
  const commonProps = {
    alt,
    quality,
    priority,
    loading: priority ? undefined : loading,
    onLoad: handleLoad,
    onError: handleError,
    ...(placeholder === 'blur' && blurDataURL ? { placeholder: 'blur' as const, blurDataURL } : {}),
  };

  // Loading state overlay
  const loadingOverlay = isLoading && !priority ? (
    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
  ) : null;

  // Fill mode for responsive containers
  if (useFill) {
    return (
      <div className="relative w-full h-full">
        {loadingOverlay}
        <Image
          src={src || placeholderSrc}
          fill
          className={className}
          style={{ objectFit }}
          sizes={responsiveSizes}
          {...commonProps}
        />
      </div>
    );
  }

  // Fixed dimensions mode
  return (
    <div className="relative" style={{ width, height }}>
      {loadingOverlay}
      <Image
        src={src || placeholderSrc}
        width={width}
        height={height}
        className={className}
        style={{ objectFit }}
        sizes={responsiveSizes}
        {...commonProps}
      />
    </div>
  );
};

export default OptimizedImage;
