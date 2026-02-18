'use client';

import React, { useState } from 'react';
import { OptimizedImage } from './OptimizedImage';

interface ImageGalleryProps {
  images: string[];
  alt: string;
  layout?: 'grid' | 'carousel' | 'masonry';
  columns?: 2 | 3 | 4;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
  showThumbnails?: boolean;
  className?: string;
}

/**
 * ImageGallery component with device-appropriate scaling
 * Implements requirement 3.5: Create image galleries with device-appropriate scaling
 * 
 * Features:
 * - Multiple layout options (grid, carousel, masonry)
 * - Responsive column layouts for different screen sizes
 * - Touch-friendly navigation for mobile devices
 * - Keyboard navigation support
 * - Optimized image loading with priority for visible images
 */
export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  alt,
  layout = 'grid',
  columns = 3,
  aspectRatio = 'video',
  showThumbnails = true,
  className = '',
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Keyboard navigation for carousel
  React.useEffect(() => {
    if (layout !== 'carousel') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape' && isLightboxOpen) {
        closeLightbox();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [layout, isLightboxOpen]);

  if (!images || images.length === 0) {
    return null;
  }

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square';
      case 'video':
        return 'aspect-video';
      case 'portrait':
        return 'aspect-[3/4]';
      default:
        return '';
    }
  };

  const getGridColumns = () => {
    switch (columns) {
      case 2:
        return 'grid-cols-1 sm:grid-cols-2';
      case 3:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      default:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
  };

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
  };

  const handleImageClick = () => {
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  // Grid Layout
  if (layout === 'grid') {
    return (
      <div className={`w-full ${className}`}>
        <div className={`grid ${getGridColumns()} gap-4`}>
          {images.map((image, index) => (
            <div
              key={index}
              className={`relative ${getAspectRatioClass()} overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity`}
              onClick={() => {
                setSelectedIndex(index);
                handleImageClick();
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedIndex(index);
                  handleImageClick();
                }
              }}
              aria-label={`View ${alt} - Image ${index + 1}`}
            >
              <OptimizedImage
                src={image}
                alt={`${alt} - Image ${index + 1}`}
                className="object-cover"
                priority={index === 0}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Carousel Layout
  if (layout === 'carousel') {
    return (
      <div className={`w-full ${className}`}>
        {/* Main Image */}
        <div className={`relative ${getAspectRatioClass()} overflow-hidden rounded-lg mb-4`}>
          <OptimizedImage
            src={images[selectedIndex]}
            alt={`${alt} - Image ${selectedIndex + 1}`}
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                aria-label="Previous image"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                aria-label="Next image"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnails */}
        {showThumbnails && images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  index === selectedIndex
                    ? 'border-blue-500 scale-105'
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                <OptimizedImage
                  src={image}
                  alt={`${alt} - Thumbnail ${index + 1}`}
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Masonry Layout
  if (layout === 'masonry') {
    return (
      <div className={`w-full ${className}`}>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative break-inside-avoid overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity mb-4"
              onClick={() => {
                setSelectedIndex(index);
                handleImageClick();
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedIndex(index);
                  handleImageClick();
                }
              }}
              aria-label={`View ${alt} - Image ${index + 1}`}
            >
              <OptimizedImage
                src={image}
                alt={`${alt} - Image ${index + 1}`}
                width={800}
                height={600}
                className="w-full h-auto"
                priority={index === 0}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default ImageGallery;
