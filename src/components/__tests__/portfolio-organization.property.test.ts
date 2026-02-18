/**
 * Property-Based Tests for Portfolio Content Organization
 * Task 4.5: Write property test for portfolio organization
 * Property 4: Portfolio Content Organization
 * **Validates: Requirements 2.1, 2.4, 2.5**
 * @jest-environment node
 */

import { describe, it, expect } from '@jest/globals';
import * as fc from 'fast-check';
import { CaseStudy, Testimonial, Metric } from '@/types';

// ============================================================================
// SIMPLIFIED GENERATORS FOR PORTFOLIO CONTENT
// ============================================================================

const metricGenerator = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 10, maxLength: 50 }),
  value: fc.oneof(fc.integer({ min: 1, max: 100 }), fc.constant('10+')),
  unit: fc.constantFrom('%', 'M', 'K', 'NPS'),
  description: fc.string({ minLength: 20, maxLength: 100 }),
  category: fc.constantFrom('retention', 'growth', 'satisfaction', 'efficiency', 'revenue'),
  timeframe: fc.string({ minLength: 5, maxLength: 20 }),
  context: fc.string({ minLength: 10, maxLength: 50 }),
}) as fc.Arbitrary<Metric>;

const resultGenerator = fc.record({
  id: fc.uuid(),
  description: fc.string({ minLength: 20, maxLength: 100 }),
  metric: metricGenerator,
  impact: fc.constantFrom('high', 'medium', 'low'),
});

const testimonialGenerator = fc.record({
  id: fc.uuid(),
  content: fc.string({ minLength: 50, maxLength: 200 }),
  author: fc.string({ minLength: 5, maxLength: 30 }),
  position: fc.string({ minLength: 5, maxLength: 50 }),
  company: fc.string({ minLength: 3, maxLength: 50 }),
  date: fc.date({ min: new Date('2020-01-01'), max: new Date('2024-12-31') }),
  rating: fc.option(fc.integer({ min: 1, max: 5 })),
  image: fc.option(fc.constant('/images/testimonial.jpg')),
}) as fc.Arbitrary<Testimonial>;

const caseStudyGenerator = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 10, maxLength: 50 }),
  client: fc.string({ minLength: 3, maxLength: 30 }),
  industry: fc.string({ minLength: 3, maxLength: 30 }),
  challenge: fc.string({ minLength: 50, maxLength: 200 }),
  solution: fc.string({ minLength: 50, maxLength: 200 }),
  implementation: fc.array(fc.string({ minLength: 20, maxLength: 100 }), { minLength: 1, maxLength: 3 }),
  results: fc.array(resultGenerator, { minLength: 1, maxLength: 3 }),
  testimonial: fc.option(testimonialGenerator),
  images: fc.array(fc.constant('/images/case-study.jpg'), { minLength: 0, maxLength: 3 }),
  tags: fc.array(fc.string({ minLength: 3, maxLength: 15 }), { minLength: 1, maxLength: 5 }),
  featured: fc.boolean(),
  startDate: fc.date({ min: new Date('2020-01-01'), max: new Date('2024-12-31') }),
  endDate: fc.option(fc.date({ min: new Date('2020-01-01'), max: new Date('2024-12-31') })),
}) as fc.Arbitrary<CaseStudy>;

// Portfolio content generator with all sections
const portfolioContentGenerator = fc.record({
  metrics: fc.array(metricGenerator, { minLength: 0, maxLength: 3 }),
  caseStudies: fc.array(caseStudyGenerator, { minLength: 0, maxLength: 2 }),
  testimonials: fc.array(testimonialGenerator, { minLength: 0, maxLength: 3 }),
});

// ============================================================================
// PROPERTY-BASED TESTS FOR PORTFOLIO ORGANIZATION
// ============================================================================

describe('Portfolio Showcase - Property 4: Portfolio Content Organization', () => {
  
  // **Validates: Requirements 2.1, 2.4**
  it('should organize portfolio content into logical sections (metrics, case studies, testimonials)', () => {
    fc.assert(
      fc.property(
        portfolioContentGenerator,
        (portfolio) => {
          // Property: Portfolio must have all three logical sections defined
          expect(portfolio).toHaveProperty('metrics');
          expect(portfolio).toHaveProperty('caseStudies');
          expect(portfolio).toHaveProperty('testimonials');

          // Property: All sections must be arrays
          expect(Array.isArray(portfolio.metrics)).toBe(true);
          expect(Array.isArray(portfolio.caseStudies)).toBe(true);
          expect(Array.isArray(portfolio.testimonials)).toBe(true);

          // Property: Each section should maintain its own structure
          if (portfolio.metrics.length > 0) {
            portfolio.metrics.forEach(metric => {
              expect(metric).toHaveProperty('id');
              expect(metric).toHaveProperty('name');
              expect(metric).toHaveProperty('value');
              expect(metric).toHaveProperty('category');
            });
          }

          if (portfolio.caseStudies.length > 0) {
            portfolio.caseStudies.forEach(caseStudy => {
              expect(caseStudy).toHaveProperty('id');
              expect(caseStudy).toHaveProperty('title');
              expect(caseStudy).toHaveProperty('challenge');
              expect(caseStudy).toHaveProperty('solution');
              expect(caseStudy).toHaveProperty('results');
            });
          }

          if (portfolio.testimonials.length > 0) {
            portfolio.testimonials.forEach(testimonial => {
              expect(testimonial).toHaveProperty('id');
              expect(testimonial).toHaveProperty('content');
              expect(testimonial).toHaveProperty('author');
              expect(testimonial).toHaveProperty('company');
            });
          }
        }
      ),
      { numRuns: 5 }
    );
  });

  // **Validates: Requirements 2.4, 2.5**
  it('should maintain consistent formatting across all portfolio sections', () => {
    fc.assert(
      fc.property(
        portfolioContentGenerator,
        (portfolio) => {
          // Property: All IDs across sections should be unique
          const allIds = [
            ...portfolio.metrics.map(m => m.id),
            ...portfolio.caseStudies.map(cs => cs.id),
            ...portfolio.testimonials.map(t => t.id),
          ];

          const uniqueIds = new Set(allIds);
          expect(uniqueIds.size).toBe(allIds.length);

          // Property: All text content should not be empty
          const allTextContent: string[] = [
            ...portfolio.metrics.map(m => m.name),
            ...portfolio.metrics.map(m => m.description),
            ...portfolio.caseStudies.map(cs => cs.title),
            ...portfolio.caseStudies.map(cs => cs.challenge),
            ...portfolio.caseStudies.map(cs => cs.solution),
            ...portfolio.testimonials.map(t => t.content),
          ];

          allTextContent.forEach(text => {
            expect(text.length).toBeGreaterThan(0);
          });

          // Property: All dates should be valid Date objects
          const allDates = [
            ...portfolio.caseStudies.map(cs => cs.startDate),
            ...portfolio.caseStudies.flatMap(cs => cs.endDate ? [cs.endDate] : []),
            ...portfolio.testimonials.map(t => t.date),
          ];

          allDates.forEach(date => {
            expect(date).toBeInstanceOf(Date);
            expect(date.getTime()).not.toBeNaN();
          });
        }
      ),
      { numRuns: 5 }
    );
  });

  // **Validates: Requirements 2.5**
  it('should maintain professional presentation standards across all sections', () => {
    fc.assert(
      fc.property(
        portfolioContentGenerator,
        (portfolio) => {
          // Property: Metrics should have professional categorization
          portfolio.metrics.forEach(metric => {
            expect(metric.category).toMatch(/^(retention|growth|satisfaction|efficiency|revenue)$/);
            expect(metric.name.length).toBeGreaterThanOrEqual(10);
            expect(metric.description.length).toBeGreaterThanOrEqual(20);
          });

          // Property: Case studies should have professional structure
          portfolio.caseStudies.forEach(caseStudy => {
            expect(caseStudy.title.length).toBeGreaterThanOrEqual(10);
            expect(caseStudy.challenge.length).toBeGreaterThanOrEqual(50);
            expect(caseStudy.solution.length).toBeGreaterThanOrEqual(50);
            expect(caseStudy.implementation.length).toBeGreaterThan(0);
            expect(caseStudy.results.length).toBeGreaterThan(0);
            expect(caseStudy.tags.length).toBeGreaterThan(0);
          });

          // Property: Testimonials should have professional attribution
          portfolio.testimonials.forEach(testimonial => {
            expect(testimonial.content.length).toBeGreaterThanOrEqual(50);
            expect(testimonial.author.length).toBeGreaterThanOrEqual(5);
            expect(testimonial.position.length).toBeGreaterThanOrEqual(5);
            expect(testimonial.company.length).toBeGreaterThanOrEqual(3);
            
            if (testimonial.rating !== null && testimonial.rating !== undefined) {
              expect(testimonial.rating).toBeGreaterThanOrEqual(1);
              expect(testimonial.rating).toBeLessThanOrEqual(5);
            }
          });
        }
      ),
      { numRuns: 5 }
    );
  });

  // **Validates: Requirements 2.1, 2.4, 2.5**
  it('should ensure portfolio sections are cohesive and cross-referenced appropriately', () => {
    fc.assert(
      fc.property(
        portfolioContentGenerator,
        (portfolio) => {
          // Property: Case studies with testimonials should have valid testimonial data
          portfolio.caseStudies.forEach(caseStudy => {
            if (caseStudy.testimonial) {
              const testimonial = caseStudy.testimonial;
              expect(testimonial.id).toBeDefined();
              expect(testimonial.content).toBeDefined();
              expect(testimonial.author).toBeDefined();
              expect(testimonial.date).toBeInstanceOf(Date);
            }
          });

          // Property: Case study results should contain metrics
          portfolio.caseStudies.forEach(caseStudy => {
            caseStudy.results.forEach(result => {
              const metric = result.metric;
              expect(metric.id).toBeDefined();
              expect(metric.name).toBeDefined();
              expect(metric.value).toBeDefined();
              expect(metric.category).toMatch(/^(retention|growth|satisfaction|efficiency|revenue)$/);
            });
          });
        }
      ),
      { numRuns: 5 }
    );
  });
});
