/**
 * @jest-environment node
 */
import * as fc from 'fast-check';
import {
  PersonalInfoSchema,
  ExperienceSchema,
  CaseStudySchema,
  MetricSchema,
  ContactFormDataSchema,
} from '../../types/validation';

describe('Property-based Validation Tests', () => {
  // Custom arbitraries for our schemas
  const emailArb = fc
    .tuple(
      fc.string({ minLength: 1, maxLength: 10, alphabetBits: 7 }).filter(s => /^[a-zA-Z0-9]+$/.test(s)),
      fc.string({ minLength: 1, maxLength: 10, alphabetBits: 7 }).filter(s => /^[a-zA-Z0-9]+$/.test(s)),
      fc.constantFrom('com', 'org', 'net', 'io')
    )
    .map(([user, domain, tld]) => `${user}@${domain}.${tld}`);

  const urlArb = fc
    .tuple(
      fc.constantFrom('http', 'https'),
      fc.string({ minLength: 1, maxLength: 10, alphabetBits: 7 }).filter(s => /^[a-zA-Z0-9]+$/.test(s)),
      fc.constantFrom('com', 'org', 'net')
    )
    .map(([proto, domain, tld]) => `${proto}://${domain}.${tld}`);

  const dateArb = fc.date({ min: new Date('2000-01-01'), max: new Date('2030-12-31') }).filter(d => !isNaN(d.getTime()));

  const personalInfoArb = fc.record({
    name: fc.string({ minLength: 1 }),
    title: fc.string({ minLength: 1 }),
    location: fc.string({ minLength: 1 }),
    email: emailArb,
    phone: fc.option(fc.string(), { nil: undefined }),
    linkedIn: fc.oneof(urlArb, fc.constant('')),
    github: fc.option(fc.oneof(urlArb, fc.constant('')), { nil: undefined }),
    website: fc.option(fc.oneof(urlArb, fc.constant('')), { nil: undefined }),
    summary: fc.string({ minLength: 10 }),
    profileImage: fc.oneof(urlArb, fc.constant('')),
  });

  const metricArb = fc.record({
    id: fc.string({ minLength: 1 }),
    name: fc.string({ minLength: 1 }),
    value: fc.oneof(fc.integer(), fc.string({ minLength: 1 })),
    unit: fc.string({ minLength: 1 }),
    description: fc.string({ minLength: 1 }),
    category: fc.constantFrom('retention', 'growth', 'satisfaction', 'efficiency', 'revenue', 'other'),
    timeframe: fc.option(fc.string(), { nil: undefined }),
    context: fc.option(fc.string(), { nil: undefined }),
  });

  const resultArb = fc.record({
    id: fc.string({ minLength: 1 }),
    description: fc.string({ minLength: 10 }),
    metric: metricArb,
    impact: fc.constantFrom('high', 'medium', 'low'),
  });

  const experienceArb = fc.record({
    id: fc.string({ minLength: 1 }),
    company: fc.string({ minLength: 1 }),
    position: fc.string({ minLength: 1 }),
    location: fc.string({ minLength: 1 }),
    startDate: dateArb,
    endDate: fc.option(dateArb, { nil: undefined }),
    description: fc.string({ minLength: 10 }),
    achievements: fc.array(fc.string({ minLength: 1 }), { minLength: 1 }),
    technologies: fc.array(fc.string({ minLength: 1 })),
    metrics: fc.array(metricArb),
  });

  const testimonialArb = fc.record({
    id: fc.string({ minLength: 1 }),
    content: fc.string({ minLength: 20 }),
    author: fc.string({ minLength: 1 }),
    position: fc.string({ minLength: 1 }),
    company: fc.string({ minLength: 1 }),
    date: dateArb,
    rating: fc.option(fc.integer({ min: 1, max: 5 }), { nil: undefined }),
    image: fc.option(fc.oneof(urlArb, fc.constant('')), { nil: undefined }),
  });

  const caseStudyArb = fc.record({
    id: fc.string({ minLength: 1 }),
    title: fc.string({ minLength: 1 }),
    client: fc.string({ minLength: 1 }),
    industry: fc.string({ minLength: 1 }),
    challenge: fc.string({ minLength: 20 }),
    solution: fc.string({ minLength: 20 }),
    implementation: fc.array(fc.string({ minLength: 1 }), { minLength: 1 }),
    results: fc.array(resultArb),
    testimonial: fc.option(testimonialArb, { nil: undefined }),
    images: fc.array(urlArb),
    tags: fc.array(fc.string({ minLength: 1 })),
    featured: fc.boolean(),
    startDate: dateArb,
    endDate: fc.option(dateArb, { nil: undefined }),
  });

  const contactFormArb = fc.record({
    name: fc.string({ minLength: 1, maxLength: 100 }),
    email: emailArb,
    subject: fc.string({ minLength: 1, maxLength: 200 }),
    company: fc.option(fc.string(), { nil: undefined }),
    message: fc.string({ minLength: 10, maxLength: 1000 }),
  });

  test('PersonalInfoSchema should validate randomly generated valid personal info', () => {
    fc.assert(
      fc.property(personalInfoArb, (data) => {
        const result = PersonalInfoSchema.safeParse(data);
        return result.success;
      })
    );
  });

  test('ExperienceSchema should validate randomly generated valid experience', () => {
    fc.assert(
      fc.property(experienceArb, (data) => {
        if (data.endDate && data.endDate < data.startDate) {
          return true;
        }
        const result = ExperienceSchema.safeParse(data);
        return result.success;
      })
    );
  });

  test('CaseStudySchema should validate randomly generated valid case studies', () => {
    fc.assert(
      fc.property(caseStudyArb, (data) => {
        if (data.endDate && data.endDate < data.startDate) {
          return true;
        }
        const result = CaseStudySchema.safeParse(data);
        return result.success;
      })
    );
  });

  test('ContactFormDataSchema should validate randomly generated valid contact data', () => {
    fc.assert(
      fc.property(contactFormArb, (data) => {
        const result = ContactFormDataSchema.safeParse(data);
        return result.success;
      })
    );
  });
});
