import {
  generateResponsiveSizes,
  calculateOptimalDimensions,
  getDeviceCategory,
  isValidImageUrl,
  getImageExtension,
  isSupportedImageFormat,
  DEVICE_BREAKPOINTS,
} from '../image-optimization';

describe('Image Optimization Utilities', () => {
  describe('generateResponsiveSizes', () => {
    it('generates correct sizes for full width', () => {
      expect(generateResponsiveSizes('full')).toBe('100vw');
    });

    it('generates correct sizes for half width', () => {
      const sizes = generateResponsiveSizes('half');
      expect(sizes).toContain('100vw');
      expect(sizes).toContain('50vw');
    });

    it('generates correct sizes for third width', () => {
      const sizes = generateResponsiveSizes('third');
      expect(sizes).toContain('100vw');
      expect(sizes).toContain('50vw');
      expect(sizes).toContain('33vw');
    });

    it('generates correct sizes for quarter width', () => {
      const sizes = generateResponsiveSizes('quarter');
      expect(sizes).toContain('100vw');
      expect(sizes).toContain('50vw');
      expect(sizes).toContain('33vw');
      expect(sizes).toContain('25vw');
    });
  });

  describe('calculateOptimalDimensions', () => {
    it('calculates dimensions with default aspect ratio', () => {
      const result = calculateOptimalDimensions(1920);
      expect(result.width).toBe(1920);
      expect(result.height).toBe(1080); // 16:9 aspect ratio
    });

    it('calculates dimensions with custom aspect ratio', () => {
      const result = calculateOptimalDimensions(1000, 4 / 3);
      expect(result.width).toBe(1000);
      expect(result.height).toBe(750); // 4:3 aspect ratio
    });

    it('accounts for device pixel ratio', () => {
      const result = calculateOptimalDimensions(1000, 16 / 9, 2);
      expect(result.width).toBe(2000);
      expect(result.height).toBe(1125);
    });

    it('rounds dimensions to integers', () => {
      const result = calculateOptimalDimensions(1000, 16 / 9);
      expect(Number.isInteger(result.width)).toBe(true);
      expect(Number.isInteger(result.height)).toBe(true);
    });
  });

  describe('getDeviceCategory', () => {
    it('identifies mobile devices', () => {
      expect(getDeviceCategory(320)).toBe('mobile');
      expect(getDeviceCategory(480)).toBe('mobile');
      expect(getDeviceCategory(639)).toBe('mobile');
    });

    it('identifies tablet devices', () => {
      expect(getDeviceCategory(640)).toBe('tablet');
      expect(getDeviceCategory(768)).toBe('tablet');
      expect(getDeviceCategory(1023)).toBe('tablet');
    });

    it('identifies desktop devices', () => {
      expect(getDeviceCategory(1024)).toBe('desktop');
      expect(getDeviceCategory(1920)).toBe('desktop');
      expect(getDeviceCategory(3840)).toBe('desktop');
    });
  });

  describe('isValidImageUrl', () => {
    it('validates relative paths', () => {
      expect(isValidImageUrl('/images/photo.jpg')).toBe(true);
      expect(isValidImageUrl('./photo.jpg')).toBe(true);
      expect(isValidImageUrl('../photo.jpg')).toBe(true);
    });

    it('validates absolute URLs', () => {
      expect(isValidImageUrl('https://example.com/photo.jpg')).toBe(true);
      expect(isValidImageUrl('http://example.com/photo.jpg')).toBe(true);
    });

    it('rejects invalid URLs', () => {
      expect(isValidImageUrl('')).toBe(false);
      expect(isValidImageUrl('not a url')).toBe(false);
    });
  });

  describe('getImageExtension', () => {
    it('extracts extension from simple paths', () => {
      expect(getImageExtension('/images/photo.jpg')).toBe('jpg');
      expect(getImageExtension('/images/photo.png')).toBe('png');
      expect(getImageExtension('/images/photo.webp')).toBe('webp');
    });

    it('extracts extension from URLs with query params', () => {
      expect(getImageExtension('/images/photo.jpg?v=123')).toBe('jpg');
      expect(getImageExtension('https://example.com/photo.png?size=large')).toBe('png');
    });

    it('returns null for paths without extension', () => {
      expect(getImageExtension('/images/photo')).toBeNull();
      expect(getImageExtension('https://example.com/photo')).toBeNull();
    });

    it('handles case insensitivity', () => {
      expect(getImageExtension('/images/photo.JPG')).toBe('jpg');
      expect(getImageExtension('/images/photo.PNG')).toBe('png');
    });
  });

  describe('isSupportedImageFormat', () => {
    it('identifies supported formats', () => {
      expect(isSupportedImageFormat('/photo.jpg')).toBe(true);
      expect(isSupportedImageFormat('/photo.jpeg')).toBe(true);
      expect(isSupportedImageFormat('/photo.png')).toBe(true);
      expect(isSupportedImageFormat('/photo.webp')).toBe(true);
      expect(isSupportedImageFormat('/photo.avif')).toBe(true);
      expect(isSupportedImageFormat('/photo.gif')).toBe(true);
      expect(isSupportedImageFormat('/photo.svg')).toBe(true);
    });

    it('rejects unsupported formats', () => {
      expect(isSupportedImageFormat('/photo.bmp')).toBe(false);
      expect(isSupportedImageFormat('/photo.tiff')).toBe(false);
      expect(isSupportedImageFormat('/photo.ico')).toBe(false);
    });

    it('handles URLs with query params', () => {
      expect(isSupportedImageFormat('/photo.jpg?v=123')).toBe(true);
      expect(isSupportedImageFormat('/photo.bmp?v=123')).toBe(false);
    });
  });

  describe('DEVICE_BREAKPOINTS', () => {
    it('has correct breakpoint values', () => {
      expect(DEVICE_BREAKPOINTS.mobile).toBe(640);
      expect(DEVICE_BREAKPOINTS.tablet).toBe(768);
      expect(DEVICE_BREAKPOINTS.desktop).toBe(1024);
      expect(DEVICE_BREAKPOINTS.wide).toBe(1280);
      expect(DEVICE_BREAKPOINTS.ultraWide).toBe(1920);
    });

    it('has breakpoints in ascending order', () => {
      const values = Object.values(DEVICE_BREAKPOINTS);
      for (let i = 1; i < values.length; i++) {
        expect(values[i]).toBeGreaterThan(values[i - 1]);
      }
    });
  });
});
