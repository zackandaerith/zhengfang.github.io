/**
 * Property-Based Tests for SEO Metadata Generation
 * Task 7.3: Write property test for SEO metadata generation
 * Property 6: SEO Metadata Generation
 * **Validates: Requirements 4.1, 4.2, 4.4**
 * @jest-environment node
 */

import { describe, it, expect } from '@jest/globals';
import * as fc from 'fast-check';
import {
  generatePageMetadata,
  generatePersonStructuredData,
  generatePortfolioStructuredData,
  generateBreadcrumbStructuredData,
  optimizeMetaDescription,
  generateKeywords,
  sanitizeCanonicalUrl,
} from '@/utils/seo';

// ============================================================================
// GENERATORS FOR SEO TESTING
// ============================================================================

const seoConfigGenerator = fc.record({
  title: fc.string({ minLength: 10, maxLength: 60 }),
  description: fc.string({ minLength: 50, maxLength: 200 }),
  keywords: fc.array(fc.string({ minLength: 3, maxLength: 20 }), { minLength: 1, maxLength: 10 }),
  image: fc.constantFrom('/og-image.jpg', '/images/hero.jpg', 'https://example.com/image.jpg'),
  url: fc.constantFrom('/', '/about', '/portfolio', '/contact'),
  type: fc.constantFrom('website', 'article', 'profile'),
  author: fc.option(fc.string({ minLength: 5, maxLength: 50 })),
});

const personDataGenerator = fc.record({
  name: fc.string({ minLength: 5, maxLength: 50 }),
  jobTitle: fc.string({ minLength: 5, maxLength: 50 }),
  description: fc.string({ minLength: 50, maxLength: 200 }),
  url: fc.constantFrom('/', '/about'),
  email: fc.option(fc.emailAddress()),
  linkedin: fc.option(fc.webUrl()),
  location: fc.option(fc.string({ minLength: 3, maxLength: 50 })),
});

// ============================================================================
// PROPERTY-BASED TESTS FOR SEO METADATA GENERATION
// ============================================================================

describe('SEO Engine - Property 6: SEO Metadata Generation', () => {
  
  // **Validates: Requirements 4.1**
  it('should generate complete metadata with title, description, and keywords', () => {
    fc.assert(
      fc.property(
        seoConfigGenerator,
        (config) => {
          const metadata = generatePageMetadata(config);
          
          // Property: Metadata must have title
          expect(metadata.title).toBeDefined();
          expect(metadata.title).toBe(config.title);
          
          // Property: Metadata must have description
          expect(metadata.description).toBeDefined();
          expect(metadata.description).toBe(config.description);
          
          // Property: Metadata must have keywords
          expect(metadata.keywords).toBeDefined();
          expect(Array.isArray(metadata.keywords)).toBe(true);
          expect(metadata.keywords?.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 10 }
    );
  });

  // **Validates: Requirements 4.4**
  it('should generate Open Graph metadata for social sharing', () => {
    fc.assert(
      fc.property(
        seoConfigGenerator,
        (config) => {
          const metadata = generatePageMetadata(config);
          
          // Property: Must have Open Graph data
          expect(metadata.openGraph).toBeDefined();
          expect(metadata.openGraph?.title).toBe(config.title);
          expect(metadata.openGraph?.description).toBe(config.description);
          expect(metadata.openGraph?.type).toBe(config.type);
          
          // Property: Must have Open Graph images
          expect(metadata.openGraph?.images).toBeDefined();
          expect(Array.isArray(metadata.openGraph?.images)).toBe(true);
          expect(metadata.openGraph?.images?.length).toBeGreaterThan(0);
          
          // Property: Images must have required properties
          const firstImage = metadata.openGraph?.images?.[0];
          if (typeof firstImage === 'object' && firstImage !== null) {
            expect(firstImage).toHaveProperty('url');
            expect(firstImage).toHaveProperty('width');
            expect(firstImage).toHaveProperty('height');
            expect(firstImage).toHaveProperty('alt');
          }
        }
      ),
      { numRuns: 10 }
    );
  });

  // **Validates: Requirements 4.4**
  it('should generate Twitter Card metadata', () => {
    fc.assert(
      fc.property(
        seoConfigGenerator,
        (config) => {
          const metadata = generatePageMetadata(config);
          
          // Property: Must have Twitter Card data
          expect(metadata.twitter).toBeDefined();
          expect(metadata.twitter?.card).toBe('summary_large_image');
          expect(metadata.twitter?.title).toBe(config.title);
          expect(metadata.twitter?.description).toBe(config.description);
          
          // Property: Must have Twitter Card images
          expect(metadata.twitter?.images).toBeDefined();
          expect(Array.isArray(metadata.twitter?.images)).toBe(true);
          expect(metadata.twitter?.images?.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 10 }
    );
  });

  // **Validates: Requirements 4.2**
  it('should generate structured data for professional profiles', () => {
    fc.assert(
      fc.property(
        personDataGenerator,
        (data) => {
          const structuredData = generatePersonStructuredData(data);
          
          // Property: Must have schema.org context
          expect(structuredData['@context']).toBe('https://schema.org');
          expect(structuredData['@type']).toBe('Person');
          
          // Property: Must have required person fields
          expect(structuredData.name).toBe(data.name);
          expect(structuredData.jobTitle).toBe(data.jobTitle);
          expect(structuredData.description).toBe(data.description);
          expect(structuredData.url).toBeDefined();
          
          // Property: Optional fields should be included when provided
          if (data.email) {
            expect(structuredData.email).toBe(data.email);
          }
          
          if (data.linkedin) {
            expect(structuredData.sameAs).toBeDefined();
            expect(Array.isArray(structuredData.sameAs)).toBe(true);
          }
        }
      ),
      { numRuns: 10 }
    );
  });

  // **Validates: Requirements 4.2**
  it('should generate breadcrumb structured data', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            name: fc.string({ minLength: 3, maxLength: 30 }),
            url: fc.constantFrom('/', '/about', '/portfolio', '/contact'),
          }),
          { minLength: 1, maxLength: 5 }
        ),
        (items) => {
          const structuredData = generateBreadcrumbStructuredData(items);
          
          // Property: Must have schema.org context
          expect(structuredData['@context']).toBe('https://schema.org');
          expect(structuredData['@type']).toBe('BreadcrumbList');
          
          // Property: Must have item list
          expect(structuredData.itemListElement).toBeDefined();
          expect(Array.isArray(structuredData.itemListElement)).toBe(true);
          expect(structuredData.itemListElement.length).toBe(items.length);
          
          // Property: Each item must have position, name, and item
          structuredData.itemListElement.forEach((item, index) => {
            expect(item['@type']).toBe('ListItem');
            expect(item.position).toBe(index + 1);
            expect(item.name).toBe(items[index].name);
            expect(item.item).toBeDefined();
          });
        }
      ),
      { numRuns: 10 }
    );
  });

  // **Validates: Requirements 4.1**
  it('should optimize meta descriptions to appropriate length', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 50, maxLength: 300 }),
        fc.integer({ min: 100, max: 200 }),
        (description, maxLength) => {
          const optimized = optimizeMetaDescription(description, maxLength);
          
          // Property: Optimized description should not exceed max length
          expect(optimized.length).toBeLessThanOrEqual(maxLength);
          
          // Property: Should preserve content when under limit
          if (description.length <= maxLength) {
            expect(optimized).toBe(description);
          }
          
          // Property: Should add ellipsis when truncated
          if (description.length > maxLength) {
            expect(optimized.endsWith('...')).toBe(true);
          }
        }
      ),
      { numRuns: 10 }
    );
  });

  // **Validates: Requirements 4.1**
  it('should generate relevant keywords from content', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 100, maxLength: 500 }),
        fc.integer({ min: 5, max: 15 }),
        (content, maxKeywords) => {
          const keywords = generateKeywords(content, maxKeywords);
          
          // Property: Should return array of keywords
          expect(Array.isArray(keywords)).toBe(true);
          
          // Property: Should not exceed max keywords
          expect(keywords.length).toBeLessThanOrEqual(maxKeywords);
          
          // Property: Keywords should be lowercase
          keywords.forEach(keyword => {
            expect(keyword).toBe(keyword.toLowerCase());
            expect(keyword.length).toBeGreaterThan(3);
          });
          
          // Property: Keywords should be unique
          const uniqueKeywords = new Set(keywords);
          expect(uniqueKeywords.size).toBe(keywords.length);
        }
      ),
      { numRuns: 10 }
    );
  });

  // **Validates: Requirements 4.1**
  it('should sanitize and validate canonical URLs', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('/', '/about', '/portfolio/', '/contact', 'about', 'portfolio/'),
        (url) => {
          const canonical = sanitizeCanonicalUrl(url);
          
          // Property: Should return absolute URL
          expect(canonical.startsWith('http')).toBe(true);
          
          // Property: Should not have trailing slash (except for root path)
          const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';
          if (canonical !== baseUrl && canonical !== `${baseUrl}/`) {
            expect(canonical.endsWith('/')).toBe(false);
          }
          
          // Property: Should be valid URL
          expect(() => new URL(canonical)).not.toThrow();
        }
      ),
      { numRuns: 10 }
    );
  });

  // **Validates: Requirements 4.1, 4.4**
  it('should include canonical URL in metadata', () => {
    fc.assert(
      fc.property(
        seoConfigGenerator,
        (config) => {
          const metadata = generatePageMetadata(config);
          
          // Property: Must have canonical URL
          expect(metadata.alternates).toBeDefined();
          expect(metadata.alternates?.canonical).toBeDefined();
          
          // Property: Canonical URL should be absolute
          const canonical = metadata.alternates?.canonical;
          if (typeof canonical === 'string') {
            expect(canonical.startsWith('http')).toBe(true);
          }
        }
      ),
      { numRuns: 10 }
    );
  });

  // **Validates: Requirements 4.2**
  it('should generate portfolio structured data with all required fields', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 10, maxLength: 50 }),
          description: fc.string({ minLength: 50, maxLength: 200 }),
          author: fc.string({ minLength: 5, maxLength: 50 }),
          items: fc.array(
            fc.record({
              name: fc.string({ minLength: 5, maxLength: 50 }),
              description: fc.string({ minLength: 20, maxLength: 100 }),
              url: fc.option(fc.constantFrom('/portfolio/1', '/portfolio/2')),
            }),
            { minLength: 1, maxLength: 5 }
          ),
        }),
        (data) => {
          const structuredData = generatePortfolioStructuredData(data);
          
          // Property: Must have schema.org context
          expect(structuredData['@context']).toBe('https://schema.org');
          expect(structuredData['@type']).toBe('CreativeWork');
          
          // Property: Must have required fields
          expect(structuredData.name).toBe(data.name);
          expect(structuredData.description).toBe(data.description);
          expect(structuredData.author).toBeDefined();
          expect(structuredData.author['@type']).toBe('Person');
          expect(structuredData.author.name).toBe(data.author);
          
          // Property: Must have portfolio items
          expect(structuredData.hasPart).toBeDefined();
          expect(Array.isArray(structuredData.hasPart)).toBe(true);
          expect(structuredData.hasPart.length).toBe(data.items.length);
        }
      ),
      { numRuns: 10 }
    );
  });
});
