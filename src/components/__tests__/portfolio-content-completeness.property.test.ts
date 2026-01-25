/**
 * Property-Based Tests for Portfolio Content Completeness
 * Task 4.3: Write property test for portfolio content completeness
 * Property 3: Portfolio Content Completeness
 * **Validates: Requirements 2.2, 2.3**
 * @jest-environment node
 */

import { describe, it, expect } from '@jest/globals';
import * as fc from 'fast-check';
import { CaseStudy, Testimonial, Achievement, Result, Metric } from '@/types';

// ============================================================================
// GENERATORS FOR PORTFOLIO CONTENT
// ============================================================================

// Helper function to create text without excessive whitespace
const createCleanText = (minLength: number, maxLength: number) => 
  fc.stringMatching(/^[a-zA-Z0-9][a-zA-Z0-9\s.,!?'"-()]*[a-zA-Z0-9]$/)
    .filter(s => s.length >= minLength && s.length <= maxLength)
    .filter(s => !s.match(/\s{3,}/)) // No more than 2 consecutive spaces
    .filter(s => s.trim().length > 0); // Not just whitespace

const metricGenerator = fc.record({
  id: fc.stringMatching(/^[a-zA-Z0-9_-]{5,50}$/),
  name: createCleanText(10, 100),
  value: fc.oneof(
    fc.integer({ min: 1, max: 1000 }),
    fc.stringMatching(/^[a-zA-Z0-9+]{1,10}$/)
  ),
  unit: fc.constantFrom('%', 'M', 'K', 'NPS', 'positions', 'days', 'hours'),
  description: createCleanText(20, 200),
  category: fc.constantFrom('retention', 'growth', 'satisfaction', 'efficiency', 'revenue'),
  timeframe: createCleanText(5, 20),
  context: createCleanText(10, 100),
}) as fc.Arbitrary<Metric>;

const resultGenerator = fc.record({
  id: fc.stringMatching(/^[a-zA-Z0-9_-]{5,50}$/),
  description: createCleanText(20, 200),
  metric: metricGenerator,
  impact: fc.constantFrom('high', 'medium', 'low'),
}) as fc.Arbitrary<Result>;

const testimonialGenerator = fc.record({
  id: fc.stringMatching(/^[a-zA-Z0-9_-]{5,50}$/),
  content: createCleanText(50, 500),
  author: fc.stringMatching(/^[a-zA-Z][a-zA-Z\s.]{3,48}[a-zA-Z]$/).filter(s => !s.match(/\s{3,}/)),
  position: createCleanText(5, 100),
  company: createCleanText(3, 100),
  date: fc.integer({ min: new Date('2020-01-01').getTime(), max: new Date('2024-12-31').getTime() }).map(t => new Date(t)),
  rating: fc.option(fc.integer({ min: 1, max: 5 })),
  image: fc.option(fc.stringMatching(/^[a-zA-Z0-9\s./_-]{5,100}$/)),
}) as fc.Arbitrary<Testimonial>;

const caseStudyGenerator = fc.record({
  id: fc.stringMatching(/^[a-zA-Z0-9_-]{5,50}$/),
  title: createCleanText(10, 100),
  client: createCleanText(3, 100),
  industry: createCleanText(3, 50),
  challenge: createCleanText(50, 500),
  solution: createCleanText(50, 500),
  implementation: fc.array(createCleanText(20, 200), { minLength: 1, maxLength: 10 }),
  results: fc.array(resultGenerator, { minLength: 1, maxLength: 5 }),
  testimonial: fc.option(testimonialGenerator),
  images: fc.array(fc.stringMatching(/^[a-zA-Z0-9\s./_-]{5,100}$/), { minLength: 0, maxLength: 5 }),
  tags: fc.array(createCleanText(3, 30), { minLength: 1, maxLength: 10 }),
  featured: fc.boolean(),
  startDate: fc.integer({ min: new Date('2020-01-01').getTime(), max: new Date('2024-12-31').getTime() }).map(t => new Date(t)),
  endDate: fc.option(fc.integer({ min: new Date('2020-01-01').getTime(), max: new Date('2024-12-31').getTime() }).map(t => new Date(t))),
}).filter(cs => !cs.endDate || cs.endDate.getTime() >= cs.startDate.getTime()) as fc.Arbitrary<CaseStudy>;

const achievementGenerator = fc.record({
  id: fc.stringMatching(/^[a-zA-Z0-9_-]{5,50}$/),
  title: createCleanText(10, 100),
  description: createCleanText(20, 300),
  date: fc.integer({ min: new Date('2020-01-01').getTime(), max: new Date('2024-12-31').getTime() }).map(t => new Date(t)),
  category: fc.constantFrom('award', 'recognition', 'milestone', 'publication'),
  organization: fc.option(createCleanText(3, 100)),
  metrics: fc.option(fc.array(metricGenerator, { minLength: 1, maxLength: 3 })),
}) as fc.Arbitrary<Achievement>;

// ============================================================================
// PROPERTY-BASED TESTS FOR PORTFOLIO CONTENT COMPLETENESS
// ============================================================================

describe('Portfolio Showcase - Property 3: Portfolio Content Completeness', () => {
  
  // **Validates: Requirements 2.2**
  it('should ensure case studies have all required fields with proper formatting', () => {
    fc.assert(
      fc.property(
        caseStudyGenerator,
        (caseStudy) => {
          // Property: All required fields must be present and non-empty
          expect(caseStudy.id).toBeDefined();
          expect(caseStudy.id.length).toBeGreaterThan(0);
          
          expect(caseStudy.title).toBeDefined();
          expect(caseStudy.title.length).toBeGreaterThan(0);
          
          expect(caseStudy.client).toBeDefined();
          expect(caseStudy.client.length).toBeGreaterThan(0);
          
          expect(caseStudy.industry).toBeDefined();
          expect(caseStudy.industry.length).toBeGreaterThan(0);

          // Property: Problem, solution, and outcomes must be meaningful
          expect(caseStudy.challenge).toBeDefined();
          expect(caseStudy.challenge.length).toBeGreaterThanOrEqual(50);
          
          expect(caseStudy.solution).toBeDefined();
          expect(caseStudy.solution.length).toBeGreaterThanOrEqual(50);
          
          expect(caseStudy.results).toBeDefined();
          expect(Array.isArray(caseStudy.results)).toBe(true);
          expect(caseStudy.results.length).toBeGreaterThan(0);

          // Property: Each result must have measurable outcomes
          caseStudy.results.forEach(result => {
            expect(result.id).toBeDefined();
            expect(result.description).toBeDefined();
            expect(result.description.length).toBeGreaterThanOrEqual(20);
            expect(result.metric).toBeDefined();
            expect(result.impact).toMatch(/^(high|medium|low)$/);
            
            // Property: Metrics must be complete and valid
            expect(result.metric.id).toBeDefined();
            expect(result.metric.name).toBeDefined();
            expect(result.metric.value).toBeDefined();
            expect(result.metric.unit).toBeDefined();
            expect(result.metric.description).toBeDefined();
            expect(result.metric.category).toMatch(/^(retention|growth|satisfaction|efficiency|revenue)$/);
          });

          // Property: Implementation steps must be actionable
          expect(caseStudy.implementation).toBeDefined();
          expect(Array.isArray(caseStudy.implementation)).toBe(true);
          expect(caseStudy.implementation.length).toBeGreaterThan(0);
          
          caseStudy.implementation.forEach(step => {
            expect(step.length).toBeGreaterThanOrEqual(20);
          });

          // Property: Tags must be meaningful
          expect(caseStudy.tags).toBeDefined();
          expect(Array.isArray(caseStudy.tags)).toBe(true);
          expect(caseStudy.tags.length).toBeGreaterThan(0);
          
          caseStudy.tags.forEach(tag => {
            expect(tag.length).toBeGreaterThanOrEqual(3);
          });

          // Property: Dates must be valid
          expect(caseStudy.startDate).toBeInstanceOf(Date);
          expect(caseStudy.startDate.getTime()).not.toBeNaN();
          
          if (caseStudy.endDate) {
            expect(caseStudy.endDate).toBeInstanceOf(Date);
            expect(caseStudy.endDate.getTime()).not.toBeNaN();
            expect(caseStudy.endDate.getTime()).toBeGreaterThanOrEqual(caseStudy.startDate.getTime());
          }

          // Property: Featured flag must be boolean
          expect(typeof caseStudy.featured).toBe('boolean');
        }
      ),
      { numRuns: 2 }
    );
  });

  // **Validates: Requirements 2.3**
  it('should ensure testimonials have proper attribution and context', () => {
    fc.assert(
      fc.property(
        testimonialGenerator,
        (testimonial) => {
          // Property: All required fields must be present and meaningful
          expect(testimonial.id).toBeDefined();
          expect(testimonial.id.length).toBeGreaterThan(0);
          
          expect(testimonial.content).toBeDefined();
          expect(testimonial.content.length).toBeGreaterThanOrEqual(50);
          
          expect(testimonial.author).toBeDefined();
          expect(testimonial.author.length).toBeGreaterThanOrEqual(5);
          
          expect(testimonial.position).toBeDefined();
          expect(testimonial.position.length).toBeGreaterThanOrEqual(5);
          
          expect(testimonial.company).toBeDefined();
          expect(testimonial.company.length).toBeGreaterThanOrEqual(3);

          // Property: Date must be valid
          expect(testimonial.date).toBeInstanceOf(Date);
          expect(testimonial.date.getTime()).not.toBeNaN();

          // Property: Rating must be valid if present
          if (testimonial.rating !== null && testimonial.rating !== undefined) {
            expect(testimonial.rating).toBeGreaterThanOrEqual(1);
            expect(testimonial.rating).toBeLessThanOrEqual(5);
            expect(Number.isInteger(testimonial.rating)).toBe(true);
          }

          // Property: Image path must be valid if present
          if (testimonial.image) {
            expect(testimonial.image.length).toBeGreaterThan(0);
          }
        }
      ),
      { numRuns: 2 }
    );
  });

  // **Validates: Requirements 2.2, 2.3**
  it('should ensure achievements have complete information and context', () => {
    fc.assert(
      fc.property(
        achievementGenerator,
        (achievement) => {
          // Property: All required fields must be present
          expect(achievement.id).toBeDefined();
          expect(achievement.id.length).toBeGreaterThan(0);
          
          expect(achievement.title).toBeDefined();
          expect(achievement.title.length).toBeGreaterThanOrEqual(10);
          
          expect(achievement.description).toBeDefined();
          expect(achievement.description.length).toBeGreaterThanOrEqual(20);

          // Property: Date must be valid
          expect(achievement.date).toBeInstanceOf(Date);
          expect(achievement.date.getTime()).not.toBeNaN();

          // Property: Category must be valid
          expect(achievement.category).toMatch(/^(award|recognition|milestone|publication)$/);

          // Property: Organization should be meaningful if present
          if (achievement.organization) {
            expect(achievement.organization.length).toBeGreaterThanOrEqual(3);
          }

          // Property: Metrics should be complete if present
          if (achievement.metrics) {
            expect(Array.isArray(achievement.metrics)).toBe(true);
            expect(achievement.metrics.length).toBeGreaterThan(0);
            
            achievement.metrics.forEach(metric => {
              expect(metric.id).toBeDefined();
              expect(metric.name).toBeDefined();
              expect(metric.value).toBeDefined();
              expect(metric.unit).toBeDefined();
              expect(metric.description).toBeDefined();
              expect(metric.category).toMatch(/^(retention|growth|satisfaction|efficiency|revenue)$/);
            });
          }
        }
      ),
      { numRuns: 2 }
    );
  });

  // **Validates: Requirements 2.2, 2.3**
  it('should validate portfolio content arrays maintain completeness', () => {
    fc.assert(
      fc.property(
        fc.record({
          caseStudies: fc.array(caseStudyGenerator, { minLength: 0, maxLength: 10 }),
          testimonials: fc.array(testimonialGenerator, { minLength: 0, maxLength: 10 }),
          achievements: fc.array(achievementGenerator, { minLength: 0, maxLength: 10 }),
        }),
        (portfolio) => {
          // Property: All arrays should be valid arrays
          expect(Array.isArray(portfolio.caseStudies)).toBe(true);
          expect(Array.isArray(portfolio.testimonials)).toBe(true);
          expect(Array.isArray(portfolio.achievements)).toBe(true);

          // Property: All case studies should have unique IDs
          const caseStudyIds = portfolio.caseStudies.map(cs => cs.id);
          const uniqueCaseStudyIds = new Set(caseStudyIds);
          expect(uniqueCaseStudyIds.size).toBe(caseStudyIds.length);

          // Property: All testimonials should have unique IDs
          const testimonialIds = portfolio.testimonials.map(t => t.id);
          const uniqueTestimonialIds = new Set(testimonialIds);
          expect(uniqueTestimonialIds.size).toBe(testimonialIds.length);

          // Property: All achievements should have unique IDs
          const achievementIds = portfolio.achievements.map(a => a.id);
          const uniqueAchievementIds = new Set(achievementIds);
          expect(uniqueAchievementIds.size).toBe(achievementIds.length);

          // Property: Each case study should have at least one result with measurable outcome
          portfolio.caseStudies.forEach(caseStudy => {
            expect(caseStudy.results.length).toBeGreaterThan(0);
            caseStudy.results.forEach(result => {
              expect(result.metric).toBeDefined();
              expect(result.metric.value).toBeDefined();
              expect(result.description).toBeDefined();
            });
          });

          // Property: Testimonials should have proper attribution
          portfolio.testimonials.forEach(testimonial => {
            expect(testimonial.author).toBeDefined();
            expect(testimonial.position).toBeDefined();
            expect(testimonial.company).toBeDefined();
            expect(testimonial.content.length).toBeGreaterThanOrEqual(50);
          });

          // Property: Achievements should have meaningful descriptions
          portfolio.achievements.forEach(achievement => {
            expect(achievement.title).toBeDefined();
            expect(achievement.description).toBeDefined();
            expect(achievement.description.length).toBeGreaterThanOrEqual(20);
          });
        }
      ),
      { numRuns: 2 }
    );
  });

  // **Validates: Requirements 2.2, 2.3**
  it('should ensure portfolio content maintains professional formatting standards', () => {
    fc.assert(
      fc.property(
        fc.oneof(caseStudyGenerator, testimonialGenerator, achievementGenerator),
        (content) => {
          // Property: All text content should be properly formatted
          const textFields: string[] = [];
          
          if ('title' in content) textFields.push(content.title);
          if ('description' in content) textFields.push(content.description);
          if ('content' in content) textFields.push(content.content);
          if ('challenge' in content) textFields.push(content.challenge);
          if ('solution' in content) textFields.push(content.solution);

          textFields.forEach(text => {
            // Property: Text should not be empty or just whitespace
            expect(text.trim().length).toBeGreaterThan(0);
            
            // Property: Text should not have excessive whitespace
            expect(text).not.toMatch(/\s{3,}/); // No more than 2 consecutive spaces
            expect(text).not.toMatch(/^\s+|\s+$/); // No leading/trailing whitespace
          });

          // Property: IDs should follow consistent format
          expect(content.id).toMatch(/^[a-zA-Z0-9_-]+$/);
          expect(content.id.length).toBeGreaterThanOrEqual(5);

          // Property: Dates should be reasonable (not in future beyond reasonable planning)
          if ('date' in content) {
            const now = new Date();
            const maxFutureDate = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
            expect(content.date.getTime()).toBeLessThanOrEqual(maxFutureDate.getTime());
          }

          if ('startDate' in content) {
            const now = new Date();
            const maxFutureDate = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
            expect(content.startDate.getTime()).toBeLessThanOrEqual(maxFutureDate.getTime());
          }
        }
      ),
      { numRuns: 2 }
    );
  });
});