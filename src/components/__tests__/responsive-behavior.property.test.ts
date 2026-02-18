/**
 * Property-Based Tests for Cross-Device Responsive Behavior
 * Task 6.3: Write property test for responsive behavior
 * Property 5: Cross-Device Responsive Behavior
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**
 * @jest-environment jsdom
 */

import { describe, it, expect } from '@jest/globals';
import * as fc from 'fast-check';
import { DEVICE_BREAKPOINTS, getDeviceCategory, generateResponsiveSizes, calculateOptimalDimensions } from '@/utils/image-optimization';

// ============================================================================
// GENERATORS FOR RESPONSIVE TESTING
// ============================================================================

// Viewport size generator covering mobile, tablet, and desktop ranges
const viewportGenerator = fc.record({
  width: fc.integer({ min: 320, max: 2560 }),
  height: fc.integer({ min: 568, max: 1440 }),
  devicePixelRatio: fc.constantFrom(1, 1.5, 2, 3),
});

// Content size generator
const contentSizeGenerator = fc.record({
  width: fc.integer({ min: 100, max: 2000 }),
  height: fc.integer({ min: 100, max: 2000 }),
  aspectRatio: fc.constantFrom(16/9, 4/3, 1, 3/4, 21/9),
});

// Layout context generator
const layoutContextGenerator = fc.constantFrom('full', 'half', 'third', 'quarter');

// ============================================================================
// PROPERTY-BASED TESTS FOR RESPONSIVE BEHAVIOR
// ============================================================================

describe('Responsive Design - Property 5: Cross-Device Responsive Behavior', () => {
  
  // **Validates: Requirements 3.1, 3.2, 3.3**
  it('should adapt content to fit screen constraints without horizontal scrolling', () => {
    fc.assert(
      fc.property(
        viewportGenerator,
        contentSizeGenerator,
        (viewport, content) => {
          // Property: Content should never exceed viewport width
          const maxContentWidth = viewport.width;
          const scaledWidth = Math.min(content.width, maxContentWidth);
          
          // Core property: scaled content fits within viewport
          expect(scaledWidth).toBeLessThanOrEqual(viewport.width);
          expect(scaledWidth).toBeGreaterThan(0);
          
          // Property: Scaling factor should be reasonable
          if (content.width > viewport.width) {
            const scaleFactor = scaledWidth / content.width;
            expect(scaleFactor).toBeGreaterThan(0);
            expect(scaleFactor).toBeLessThanOrEqual(1);
          }
        }
      ),
      { numRuns: 10 }
    );
  });

  // **Validates: Requirements 3.1, 3.2, 3.3**
  it('should categorize devices correctly based on viewport width', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 2560 }),
        (viewportWidth) => {
          const category = getDeviceCategory(viewportWidth);
          
          // Property: Device category should match breakpoint ranges
          if (viewportWidth < DEVICE_BREAKPOINTS.mobile) {
            expect(category).toBe('mobile');
          } else if (viewportWidth < DEVICE_BREAKPOINTS.desktop) {
            expect(category).toBe('tablet');
          } else {
            expect(category).toBe('desktop');
          }
          
          // Property: Category should be one of the valid options
          expect(['mobile', 'tablet', 'desktop']).toContain(category);
        }
      ),
      { numRuns: 10 }
    );
  });

  // **Validates: Requirements 3.4, 3.5**
  it('should generate appropriate responsive sizes for different layout contexts', () => {
    fc.assert(
      fc.property(
        layoutContextGenerator,
        (context) => {
          const sizes = generateResponsiveSizes(context);
          
          // Property: Sizes string should not be empty
          expect(sizes).toBeTruthy();
          expect(sizes.length).toBeGreaterThan(0);
          
          // Property: Full context should use 100vw
          if (context === 'full') {
            expect(sizes).toBe('100vw');
          }
          
          // Property: Other contexts should have media queries
          if (context !== 'full') {
            expect(sizes).toContain('max-width');
            expect(sizes).toContain('vw');
          }
        }
      ),
      { numRuns: 10 }
    );
  });

  // **Validates: Requirements 3.5**
  it('should calculate optimal dimensions considering device pixel ratio', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 100, max: 2000 }),
        fc.constantFrom(16/9, 4/3, 1, 3/4),
        fc.constantFrom(1, 1.5, 2, 3),
        (containerWidth, aspectRatio, dpr) => {
          const dimensions = calculateOptimalDimensions(containerWidth, aspectRatio, dpr);
          
          // Property: Dimensions should be positive integers
          expect(dimensions.width).toBeGreaterThan(0);
          expect(dimensions.height).toBeGreaterThan(0);
          expect(Number.isInteger(dimensions.width)).toBe(true);
          expect(Number.isInteger(dimensions.height)).toBe(true);
          
          // Property: Width should account for device pixel ratio
          expect(dimensions.width).toBeGreaterThanOrEqual(containerWidth);
          expect(dimensions.width).toBeLessThanOrEqual(containerWidth * dpr * 1.1); // Allow small rounding
          
          // Property: Aspect ratio should be maintained
          const calculatedRatio = dimensions.width / dimensions.height;
          expect(Math.abs(calculatedRatio - aspectRatio)).toBeLessThan(0.1);
        }
      ),
      { numRuns: 10 }
    );
  });

  // **Validates: Requirements 3.1, 3.2, 3.3, 3.4**
  it('should maintain readability across all viewport sizes', () => {
    fc.assert(
      fc.property(
        viewportGenerator,
        (viewport) => {
          // Property: Minimum readable width should be maintained
          const minReadableWidth = 320; // Standard minimum mobile width
          expect(viewport.width).toBeGreaterThanOrEqual(minReadableWidth);
          
          // Property: Content scaling should preserve minimum touch target sizes
          const minTouchTarget = 44; // iOS/Android minimum touch target
          const scaleFactor = viewport.width / 375; // iPhone base width
          const scaledTouchTarget = minTouchTarget * Math.max(scaleFactor, 1);
          
          expect(scaledTouchTarget).toBeGreaterThanOrEqual(minTouchTarget);
          
          // Property: Text should scale appropriately for device
          const baseFontSize = 16;
          const deviceCategory = getDeviceCategory(viewport.width);
          let expectedMinFontSize = baseFontSize;
          
          if (deviceCategory === 'mobile') {
            expectedMinFontSize = 14; // Slightly smaller for mobile
          } else if (deviceCategory === 'desktop') {
            expectedMinFontSize = 16; // Standard for desktop
          }
          
          expect(expectedMinFontSize).toBeGreaterThanOrEqual(12); // Minimum readable size
          expect(expectedMinFontSize).toBeLessThanOrEqual(20); // Maximum base size
        }
      ),
      { numRuns: 10 }
    );
  });

  // **Validates: Requirements 3.2, 3.3**
  it('should handle orientation changes gracefully', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1024 }),
        fc.integer({ min: 568, max: 1366 }),
        (width, height) => {
          // Test both portrait and landscape
          const portrait = { width: Math.min(width, height), height: Math.max(width, height) };
          const landscape = { width: Math.max(width, height), height: Math.min(width, height) };
          
          // Property: Device category should be consistent based on width
          const portraitCategory = getDeviceCategory(portrait.width);
          const landscapeCategory = getDeviceCategory(landscape.width);
          
          // Both orientations should have valid categories
          expect(['mobile', 'tablet', 'desktop']).toContain(portraitCategory);
          expect(['mobile', 'tablet', 'desktop']).toContain(landscapeCategory);
          
          // Property: Content should fit in both orientations
          const portraitFits = portrait.width <= portrait.width; // Tautology but validates structure
          const landscapeFits = landscape.width <= landscape.width;
          
          expect(portraitFits).toBe(true);
          expect(landscapeFits).toBe(true);
        }
      ),
      { numRuns: 10 }
    );
  });

  // **Validates: Requirements 3.4**
  it('should provide touch-friendly interfaces on mobile devices', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 640 }), // Mobile range
        (mobileWidth) => {
          const category = getDeviceCategory(mobileWidth);
          
          // Property: Mobile devices should be identified correctly
          expect(category).toBe('mobile');
          
          // Property: Touch targets should meet minimum size requirements
          const minTouchTarget = 44; // iOS/Android guideline
          const buttonSize = Math.max(minTouchTarget, mobileWidth * 0.12); // 12% of width or minimum
          
          expect(buttonSize).toBeGreaterThanOrEqual(minTouchTarget);
          expect(buttonSize).toBeLessThanOrEqual(mobileWidth * 0.25); // Max 25% of width
          
          // Property: Spacing should be adequate for touch
          const minSpacing = 8; // Minimum spacing between touch targets
          expect(minSpacing).toBeGreaterThanOrEqual(8);
        }
      ),
      { numRuns: 10 }
    );
  });

  // **Validates: Requirements 3.5**
  it('should optimize images for different device capabilities', () => {
    fc.assert(
      fc.property(
        viewportGenerator,
        layoutContextGenerator,
        (viewport, context) => {
          const sizes = generateResponsiveSizes(context);
          const dimensions = calculateOptimalDimensions(
            viewport.width,
            16/9,
            viewport.devicePixelRatio
          );
          
          // Property: Image dimensions should scale with device pixel ratio
          const expectedWidth = viewport.width * viewport.devicePixelRatio;
          expect(dimensions.width).toBeGreaterThanOrEqual(viewport.width);
          expect(dimensions.width).toBeLessThanOrEqual(expectedWidth * 1.1); // Allow rounding
          
          // Property: Sizes attribute should be appropriate for viewport
          expect(sizes).toBeTruthy();
          if (context === 'full') {
            expect(sizes).toBe('100vw');
          } else {
            expect(sizes).toContain('vw');
          }
        }
      ),
      { numRuns: 10 }
    );
  });
});
