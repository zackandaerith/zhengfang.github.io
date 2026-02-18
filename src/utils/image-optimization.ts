/**
 * Image optimization utilities
 * Implements requirement 3.5: Image optimization and device-appropriate scaling
 */

/**
 * Device breakpoints for responsive images
 */
export const DEVICE_BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
  ultraWide: 1920,
} as const;

/**
 * Generate responsive sizes string based on layout context
 */
export function generateResponsiveSizes(context: 'full' | 'half' | 'third' | 'quarter'): string {
  switch (context) {
    case 'full':
      return '100vw';
    case 'half':
      return '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw';
    case 'third':
      return '(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw';
    case 'quarter':
      return '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw';
    default:
      return '100vw';
  }
}

/**
 * Calculate optimal image dimensions based on container and device
 */
export function calculateOptimalDimensions(
  containerWidth: number,
  aspectRatio: number = 16 / 9,
  devicePixelRatio: number = 1
): { width: number; height: number } {
  const width = Math.round(containerWidth * devicePixelRatio);
  const height = Math.round(width / aspectRatio);
  
  return { width, height };
}

/**
 * Get device category based on viewport width
 */
export function getDeviceCategory(viewportWidth: number): 'mobile' | 'tablet' | 'desktop' {
  if (viewportWidth < DEVICE_BREAKPOINTS.mobile) {
    return 'mobile';
  } else if (viewportWidth < DEVICE_BREAKPOINTS.desktop) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}

/**
 * Generate blur data URL for placeholder
 * This is a simple implementation - in production, you'd generate this server-side
 */
export function generateBlurDataURL(width: number = 10, height: number = 10): string {
  // Simple gray blur placeholder
  const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
  if (!canvas) {
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
  }
  
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    ctx.fillStyle = '#e5e7eb';
    ctx.fillRect(0, 0, width, height);
  }
  
  return canvas.toDataURL();
}

/**
 * Validate image URL
 */
export function isValidImageUrl(url: string): boolean {
  if (!url) return false;
  
  // Check if it's a valid URL or path
  try {
    // Relative paths are valid
    if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
      return true;
    }
    
    // Absolute URLs
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get image file extension
 */
export function getImageExtension(url: string): string | null {
  const match = url.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
  return match ? match[1].toLowerCase() : null;
}

/**
 * Check if image format is supported
 */
export function isSupportedImageFormat(url: string): boolean {
  const extension = getImageExtension(url);
  const supportedFormats = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'svg'];
  return extension ? supportedFormats.includes(extension) : false;
}

/**
 * Preload critical images
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }
    
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
    img.src = src;
  });
}

/**
 * Batch preload multiple images
 */
export async function preloadImages(sources: string[]): Promise<void> {
  await Promise.all(sources.map(src => preloadImage(src)));
}
