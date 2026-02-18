/**
 * Property-Based Tests for SEO Metadata Synchronization
 * Task 7.5: Write property test for SEO synchronization
 * Property 7: SEO Metadata Synchronization
 * **Validates: Requirements 4.5**
 * @jest-environment node
 */

import { describe, it, expect } from '@jest/globals';
import * as fc from 'fast-check';
import { generatePageMetadata, sanitizeCanonicalUrl } from '@/utils/seo';

// ============================================================================
// GENERATORS FOR SEO SYNCHRONIZATION TESTING
// ============================================================================

const contentUpdateGenerator = fc.record({
  title: fc.string({ minLength: 10, maxLength: 60 }),
  description: fc.string({ minLength: 50, maxLength: 200 }),
  keywords: fc.array(fc.string({ minLength: 3, maxLength: 20 }), { minLength: 1, maxLength: 10 }),
  url: fc.constantFrom('/', '/about', '/portfolio', '/contact'),
});

// ============================================================================
// PROPERTY-BASED TESTS FOR SEO SYNCHRONIZATION
// ============================================================================

describe('SEO Engine - Property 7: SEO Metadata Synchronization', () => {
  
  // **Validates: Requirements 4.5**
  it('should regenerate metadata when content is updated', () => {
    fc.assert(
      fc.property(
        contentUpdateGenerator,
        contentUpdateGenerator,
        (originalContent, updatedContent) => {
          // Generate metadata for original content
          const originalMetadata = generatePageMetadata(originalContent);
          
          // Generate metadata for updated content
          const updatedMetadata = generatePageMetadata(updatedContent);
          
          // Property: Metadata should reflect updated content
          expect(updatedMetadata.title).toBe(updatedContent.title);
          expect(updatedMetadata.description).toBe(updatedContent.description);
          
          // Property: If content changed, metadata should be different
          if (originalContent.title !== updatedContent.title) {
            expect(updatedMetadata.title).not.toBe(originalMetadata.title);
          }
          
          if (originalContent.description !== updatedContent.description) {
            expect(updatedMetadata.description).not.toBe(originalMetadata.description);
          }
        }
      ),
      { numRuns: 10 }
    );
  });

  // **Validates: Requirements 4.5**
  it('should update Open Graph metadata when content changes', () => {
    fc.assert(
      fc.property(
        contentUpdateGenerator,
        contentUpdateGenerator,
        (originalContent, updatedContent) => {
          const originalMetadata = generatePageMetadata(originalContent);
          const updatedMetadata = generatePageMetadata(updatedContent);
          
          // Property: Open Graph should reflect updated content
          expect(updatedMetadata.openGraph?.title).toBe(updatedContent.title);
          expect(updatedMetadata.openGraph?.description).toBe(updatedContent.description);
          
          // Property: If title changed, OG title should change
          if (originalContent.title !== updatedContent.title) {
            expect(updatedMetadata.openGraph?.title).not.toBe(originalMetadata.openGraph?.title);
          }
        }
      ),
      { numRuns: 10 }
    );
  });

  // **Validates: Requirements 4.5**
  it('should update Twitter Card metadata when content changes', () => {
    fc.assert(
      fc.property(
        contentUpdateGenerator,
        contentUpdateGenerator,
        (originalContent, updatedContent) => {
          const originalMetadata = generatePageMetadata(originalContent);
          const updatedMetadata = generatePageMetadata(updatedContent);
          
          // Property: Twitter Card should reflect updated content
          expect(updatedMetadata.twitter?.title).toBe(updatedContent.title);
          expect(updatedMetadata.twitter?.description).toBe(updatedContent.description);
          
          // Property: If description changed, Twitter description should change
          if (originalContent.description !== updatedContent.description) {
            expect(updatedMetadata.twitter?.description).not.toBe(originalMetadata.twitter?.description);
          }
        }
      ),
      { numRuns: 10 }
    );
  });

  // **Validates: Requirements 4.5**
  it('should maintain canonical URL consistency across updates', () => {
    fc.assert(
      fc.property(
        contentUpdateGenerator,
        contentUpdateGenerator,
        (originalContent, updatedContent) => {
          const originalMetadata = generatePageMetadata(originalContent);
          const updatedMetadata = generatePageMetadata(updatedContent);
          
          // Property: If URL unchanged, canonical should remain the same
          if (originalContent.url === updatedContent.url) {
            expect(updatedMetadata.alternates?.canonical).toBe(originalMetadata.alternates?.canonical);
          }
          
          // Property: If URL changed, canonical should update
          if (originalContent.url !== updatedContent.url) {
            expect(updatedMetadata.alternates?.canonical).not.toBe(originalMetadata.alternates?.canonical);
          }
          
          // Property: Canonical URL should always be valid
          const canonical = updatedMetadata.alternates?.canonical;
          if (typeof canonical === 'string') {
            expect(() => new URL(canonical)).not.toThrow();
          }
        }
      ),
      { numRuns: 10 }
    );
  });

  // **Validates: Requirements 4.5**
  it('should synchronize all metadata fields consistently', () => {
    fc.assert(
      fc.property(
        contentUpdateGenerator,
        (content) => {
          const metadata = generatePageMetadata(content);
          
          // Property: All metadata representations should be consistent
          expect(metadata.title).toBe(content.title);
          expect(metadata.openGraph?.title).toBe(content.title);
          expect(metadata.twitter?.title).toBe(content.title);
          
          expect(metadata.description).toBe(content.description);
          expect(metadata.openGraph?.description).toBe(content.description);
          expect(metadata.twitter?.description).toBe(content.description);
        }
      ),
      { numRuns: 10 }
    );
  });

  // **Validates: Requirements 4.5**
  it('should update keywords when content changes', () => {
    fc.assert(
      fc.property(
        contentUpdateGenerator,
        contentUpdateGenerator,
        (originalContent, updatedContent) => {
          const originalMetadata = generatePageMetadata(originalContent);
          const updatedMetadata = generatePageMetadata(updatedContent);
          
          // Property: Keywords should reflect updated content
          expect(updatedMetadata.keywords).toBeDefined();
          expect(Array.isArray(updatedMetadata.keywords)).toBe(true);
          
          // Property: If keywords changed, metadata keywords should change
          const originalKeywords = JSON.stringify(originalContent.keywords?.sort());
          const updatedKeywords = JSON.stringify(updatedContent.keywords?.sort());
          
          if (originalKeywords !== updatedKeywords) {
            const originalMetaKeywords = JSON.stringify(originalMetadata.keywords?.sort());
            const updatedMetaKeywords = JSON.stringify(updatedMetadata.keywords?.sort());
            expect(updatedMetaKeywords).not.toBe(originalMetaKeywords);
          }
        }
      ),
      { numRuns: 10 }
    );
  });

  // **Validates: Requirements 4.5**
  it('should preserve metadata structure across updates', () => {
    fc.assert(
      fc.property(
        contentUpdateGenerator,
        contentUpdateGenerator,
        (originalContent, updatedContent) => {
          const originalMetadata = generatePageMetadata(originalContent);
          const updatedMetadata = generatePageMetadata(updatedContent);
          
          // Property: Metadata structure should remain consistent
          expect(typeof updatedMetadata.title).toBe(typeof originalMetadata.title);
          expect(typeof updatedMetadata.description).toBe(typeof originalMetadata.description);
          expect(Array.isArray(updatedMetadata.keywords)).toBe(Array.isArray(originalMetadata.keywords));
          
          // Property: Open Graph structure should remain consistent
          expect(updatedMetadata.openGraph).toBeDefined();
          expect(updatedMetadata.openGraph?.images).toBeDefined();
          expect(Array.isArray(updatedMetadata.openGraph?.images)).toBe(true);
          
          // Property: Twitter Card structure should remain consistent
          expect(updatedMetadata.twitter).toBeDefined();
          expect(updatedMetadata.twitter?.card).toBe('summary_large_image');
        }
      ),
      { numRuns: 10 }
    );
  });

  // **Validates: Requirements 4.5**
  it('should handle rapid content updates correctly', () => {
    fc.assert(
      fc.property(
        fc.array(contentUpdateGenerator, { minLength: 2, maxLength: 5 }),
        (contentUpdates) => {
          // Simulate rapid updates
          const metadataSnapshots = contentUpdates.map(content => 
            generatePageMetadata(content)
          );
          
          // Property: Each update should produce valid metadata
          metadataSnapshots.forEach((metadata, index) => {
            expect(metadata.title).toBe(contentUpdates[index].title);
            expect(metadata.description).toBe(contentUpdates[index].description);
            expect(metadata.openGraph?.title).toBe(contentUpdates[index].title);
            expect(metadata.twitter?.title).toBe(contentUpdates[index].title);
          });
          
          // Property: Latest update should be reflected in final metadata
          const latestMetadata = metadataSnapshots[metadataSnapshots.length - 1];
          const latestContent = contentUpdates[contentUpdates.length - 1];
          
          expect(latestMetadata.title).toBe(latestContent.title);
          expect(latestMetadata.description).toBe(latestContent.description);
        }
      ),
      { numRuns: 10 }
    );
  });

  // **Validates: Requirements 4.5**
  it('should maintain SEO optimization across updates', () => {
    fc.assert(
      fc.property(
        contentUpdateGenerator,
        (content) => {
          const metadata = generatePageMetadata(content);
          
          // Property: Title should be within optimal length
          expect(metadata.title.length).toBeGreaterThan(0);
          expect(metadata.title.length).toBeLessThanOrEqual(60);
          
          // Property: Description should be within optimal length
          expect(metadata.description.length).toBeGreaterThanOrEqual(50);
          expect(metadata.description.length).toBeLessThanOrEqual(200);
          
          // Property: Keywords should exist and be reasonable
          expect(metadata.keywords).toBeDefined();
          expect(Array.isArray(metadata.keywords)).toBe(true);
          expect(metadata.keywords?.length).toBeGreaterThan(0);
          expect(metadata.keywords?.length).toBeLessThanOrEqual(10);
        }
      ),
      { numRuns: 10 }
    );
  });

  // **Validates: Requirements 4.5**
  it('should update all related metadata fields atomically', () => {
    fc.assert(
      fc.property(
        contentUpdateGenerator,
        (content) => {
          const metadata = generatePageMetadata(content);
          
          // Property: All title fields should match
          const titles = [
            metadata.title,
            metadata.openGraph?.title,
            metadata.twitter?.title,
          ];
          
          titles.forEach(title => {
            expect(title).toBe(content.title);
          });
          
          // Property: All description fields should match
          const descriptions = [
            metadata.description,
            metadata.openGraph?.description,
            metadata.twitter?.description,
          ];
          
          descriptions.forEach(description => {
            expect(description).toBe(content.description);
          });
        }
      ),
      { numRuns: 10 }
    );
  });
});
