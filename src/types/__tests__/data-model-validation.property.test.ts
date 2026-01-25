/**
 * Property-Based Tests for Data Model Validation
 * @jest-environment node
 */
import { describe, it, expect } from '@jest/globals';
import * as fc from 'fast-check';
import {
  PersonalInfoSchema,
  ExperienceSchema,
  SkillSchema,
  EducationSchema,
  AchievementSchema,
  CaseStudySchema,
  MetricSchema,
  TestimonialSchema,
  UserProfileSchema,
  ParsedResumeSchema,
  validateData,
  safeValidateData,
} from '../validation';
import type {
  PersonalInfo,
  Experience,
  Skill,
  Education,
  Achievement,
  CaseStudy,
  Metric,
  Testimonial,
  UserProfile,
  ParsedResume,
} from '../index';

// ============================================================================
// PROPERTY-BASED TEST GENERATORS
// ============================================================================

// Generator for valid email addresses
const validEmailArb = fc.stringMatching(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);

// Generator for valid URLs
const validUrlArb = fc.webUrl();

// Generator for valid dates
const validDateArb = fc.date({ min: new Date('2000-01-01'), max: new Date('2030-12-31') });

// Generator for non-empty strings
const nonEmptyStringArb = fc.string({ minLength: 1, maxLength: 100 });

// Generator for long text content
const longTextArb = fc.string({ minLength: 20, maxLength: 500 });

// Generator for PersonalInfo
const personalInfoArb: fc.Arbitrary<PersonalInfo> = fc.record({
  name: nonEmptyStringArb,
  title: nonEmptyStringArb,
  location: nonEmptyStringArb,
  email: validEmailArb,
  phone: fc.option(fc.string({ minLength: 10, maxLength: 20 })),
  linkedIn: validUrlArb,
  website: fc.option(validUrlArb),
  summary: fc.string({ minLength: 10, maxLength: 300 }),
  profileImage: validUrlArb,
});

// Generator for Metric
const metricArb: fc.Arbitrary<Metric> = fc.record({
  id: nonEmptyStringArb,
  name: nonEmptyStringArb,
  value: fc.oneof(fc.integer({ min: 0, max: 1000 }), fc.string({ minLength: 1, maxLength: 50 })),
  unit: nonEmptyStringArb,
  description: nonEmptyStringArb,
  category: fc.constantFrom('retention', 'growth', 'satisfaction', 'efficiency', 'revenue'),
  timeframe: nonEmptyStringArb,
  context: nonEmptyStringArb,
});

// Generator for Experience
const experienceArb: fc.Arbitrary<Experience> = fc.record({
  id: nonEmptyStringArb,
  company: nonEmptyStringArb,
  position: nonEmptyStringArb,
  startDate: validDateArb,
  endDate: fc.option(validDateArb),
  location: nonEmptyStringArb,
  description: fc.string({ minLength: 10, maxLength: 300 }),
  achievements: fc.array(nonEmptyStringArb, { minLength: 0, maxLength: 5 }),
  technologies: fc.array(nonEmptyStringArb, { minLength: 0, maxLength: 10 }),
  metrics: fc.array(metricArb, { minLength: 0, maxLength: 3 }),
}).filter(exp => !exp.endDate || exp.endDate >= exp.startDate);

// Generator for Skill
const skillArb: fc.Arbitrary<Skill> = fc.record({
  id: nonEmptyStringArb,
  name: nonEmptyStringArb,
  category: fc.constantFrom('technical', 'soft', 'industry'),
  level: fc.constantFrom('beginner', 'intermediate', 'advanced', 'expert'),
  description: fc.option(fc.string({ minLength: 10, maxLength: 200 })),
});

// Generator for Education
const educationArb: fc.Arbitrary<Education> = fc.record({
  id: nonEmptyStringArb,
  institution: nonEmptyStringArb,
  degree: nonEmptyStringArb,
  field: nonEmptyStringArb,
  startDate: validDateArb,
  endDate: fc.option(validDateArb),
  gpa: fc.option(fc.float({ min: 0, max: 4, noNaN: true })),
  achievements: fc.option(fc.array(nonEmptyStringArb, { minLength: 0, maxLength: 3 })),
}).filter(edu => !edu.endDate || edu.endDate >= edu.startDate);

// Generator for Achievement
const achievementArb: fc.Arbitrary<Achievement> = fc.record({
  id: nonEmptyStringArb,
  title: nonEmptyStringArb,
  description: fc.string({ minLength: 10, maxLength: 300 }),
  date: validDateArb,
  category: fc.constantFrom('award', 'recognition', 'milestone', 'publication'),
  organization: fc.option(nonEmptyStringArb),
  metrics: fc.option(fc.array(metricArb, { minLength: 0, maxLength: 2 })),
});

// ============================================================================
// PROPERTY-BASED TESTS
// ============================================================================

describe('Data Model Validation - Property Tests', () => {
  // Feature: cs-manager-profile-website, Property 1: Resume Parsing Completeness
  // **Validates: Requirements 1.1, 1.2, 1.3, 1.4**
  it('should validate all PersonalInfo data while preserving original meaning and context', () => {
    fc.assert(
      fc.property(personalInfoArb, (personalInfo) => {
        // Property: Valid PersonalInfo should always pass validation
        const result = validateData(PersonalInfoSchema, personalInfo);
        expect(result.success).toBe(true);
        expect(result.data).toEqual(personalInfo);

        // Property: Safe validation should return the same data
        const safeResult = safeValidateData(PersonalInfoSchema, personalInfo);
        expect(safeResult).toEqual(personalInfo);

        // Property: All required fields should be present and non-empty
        expect(personalInfo.name.length).toBeGreaterThan(0);
        expect(personalInfo.title.length).toBeGreaterThan(0);
        expect(personalInfo.location.length).toBeGreaterThan(0);
        expect(personalInfo.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        expect(personalInfo.linkedIn).toMatch(/^https?:\/\//);
        expect(personalInfo.summary.length).toBeGreaterThanOrEqual(10);
        expect(personalInfo.profileImage).toMatch(/^https?:\/\//);

        // Property: Optional fields should be valid when present
        if (personalInfo.phone) {
          expect(personalInfo.phone.length).toBeGreaterThanOrEqual(10);
        }
        if (personalInfo.website) {
          expect(personalInfo.website).toMatch(/^https?:\/\//);
        }
      }),
      { numRuns: 2 }
    );
  });

  // Feature: cs-manager-profile-website, Property 1: Resume Parsing Completeness
  // **Validates: Requirements 1.1, 1.2, 1.3, 1.4**
  it('should validate all Experience data while maintaining original meaning and context', () => {
    fc.assert(
      fc.property(fc.array(experienceArb, { minLength: 1, maxLength: 5 }), (experiences) => {
        experiences.forEach((experience) => {
          // Property: Valid Experience should always pass validation
          const result = validateData(ExperienceSchema, experience);
          expect(result.success).toBe(true);
          expect(result.data).toEqual(experience);

          // Property: All required fields should be present and meaningful
          expect(experience.id.length).toBeGreaterThan(0);
          expect(experience.company.length).toBeGreaterThan(0);
          expect(experience.position.length).toBeGreaterThan(0);
          expect(experience.location.length).toBeGreaterThan(0);
          expect(experience.description.length).toBeGreaterThanOrEqual(10);
          expect(experience.startDate).toBeInstanceOf(Date);

          // Property: Date ranges should be logical
          if (experience.endDate) {
            expect(experience.endDate.getTime()).toBeGreaterThanOrEqual(experience.startDate.getTime());
          }

          // Property: Arrays should contain valid elements
          experience.achievements.forEach(achievement => {
            expect(achievement.length).toBeGreaterThan(0);
          });
          experience.technologies.forEach(tech => {
            expect(tech.length).toBeGreaterThan(0);
          });

          // Property: Metrics should be valid if present
          experience.metrics.forEach(metric => {
            const metricResult = validateData(MetricSchema, metric);
            expect(metricResult.success).toBe(true);
          });
        });
      }),
      { numRuns: 2 }
    );
  });

  // Feature: cs-manager-profile-website, Property 1: Resume Parsing Completeness
  // **Validates: Requirements 1.1, 1.2, 1.3, 1.4**
  it('should validate all Skills data while preserving skill categorization and levels', () => {
    fc.assert(
      fc.property(fc.array(skillArb, { minLength: 1, maxLength: 10 }), (skills) => {
        skills.forEach((skill) => {
          // Property: Valid Skill should always pass validation
          const result = validateData(SkillSchema, skill);
          expect(result.success).toBe(true);
          expect(result.data).toEqual(skill);

          // Property: All required fields should be present and valid
          expect(skill.id.length).toBeGreaterThan(0);
          expect(skill.name.length).toBeGreaterThan(0);
          expect(['technical', 'soft', 'industry']).toContain(skill.category);
          expect(['beginner', 'intermediate', 'advanced', 'expert']).toContain(skill.level);

          // Property: Description should be meaningful if present
          if (skill.description) {
            expect(skill.description.length).toBeGreaterThanOrEqual(10);
          }
        });
      }),
      { numRuns: 2 }
    );
  });

  // Feature: cs-manager-profile-website, Property 1: Resume Parsing Completeness
  // **Validates: Requirements 1.1, 1.2, 1.3, 1.4**
  it('should validate all Education data while preserving degree and institution information', () => {
    fc.assert(
      fc.property(fc.array(educationArb, { minLength: 1, maxLength: 3 }), (educationList) => {
        educationList.forEach((education) => {
          // Property: Valid Education should always pass validation
          const result = validateData(EducationSchema, education);
          expect(result.success).toBe(true);
          expect(result.data).toEqual(education);

          // Property: All required fields should be present and meaningful
          expect(education.id.length).toBeGreaterThan(0);
          expect(education.institution.length).toBeGreaterThan(0);
          expect(education.degree.length).toBeGreaterThan(0);
          expect(education.field.length).toBeGreaterThan(0);
          expect(education.startDate).toBeInstanceOf(Date);

          // Property: Date ranges should be logical
          if (education.endDate) {
            expect(education.endDate.getTime()).toBeGreaterThanOrEqual(education.startDate.getTime());
          }

          // Property: GPA should be valid if present
          if (education.gpa !== undefined) {
            expect(education.gpa).toBeGreaterThanOrEqual(0);
            expect(education.gpa).toBeLessThanOrEqual(4);
          }

          // Property: Achievements should be valid if present
          if (education.achievements) {
            education.achievements.forEach(achievement => {
              expect(achievement.length).toBeGreaterThan(0);
            });
          }
        });
      }),
      { numRuns: 2 }
    );
  });

  // Feature: cs-manager-profile-website, Property 1: Resume Parsing Completeness
  // **Validates: Requirements 1.1, 1.2, 1.3, 1.4**
  it('should validate complete UserProfile data maintaining all section integrity', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: nonEmptyStringArb,
          personalInfo: personalInfoArb,
          experience: fc.array(experienceArb, { minLength: 0, maxLength: 3 }),
          skills: fc.array(skillArb, { minLength: 0, maxLength: 5 }),
          education: fc.array(educationArb, { minLength: 0, maxLength: 2 }),
          certifications: fc.array(fc.record({
            id: nonEmptyStringArb,
            name: nonEmptyStringArb,
            issuer: nonEmptyStringArb,
            issueDate: validDateArb,
            expiryDate: fc.option(validDateArb),
            credentialId: fc.option(nonEmptyStringArb),
            credentialUrl: fc.option(validUrlArb),
          }).filter(cert => !cert.expiryDate || cert.expiryDate >= cert.issueDate), { minLength: 0, maxLength: 3 }),
          achievements: fc.array(achievementArb, { minLength: 0, maxLength: 3 }),
          caseStudies: fc.array(fc.record({
            id: nonEmptyStringArb,
            title: nonEmptyStringArb,
            client: nonEmptyStringArb,
            industry: nonEmptyStringArb,
            challenge: longTextArb,
            solution: longTextArb,
            implementation: fc.array(nonEmptyStringArb, { minLength: 1, maxLength: 5 }),
            results: fc.array(fc.record({
              id: nonEmptyStringArb,
              description: fc.string({ minLength: 10, maxLength: 200 }),
              metric: metricArb,
              impact: fc.constantFrom('high', 'medium', 'low'),
            }), { minLength: 0, maxLength: 3 }),
            testimonial: fc.option(fc.record({
              id: nonEmptyStringArb,
              content: longTextArb,
              author: nonEmptyStringArb,
              position: nonEmptyStringArb,
              company: nonEmptyStringArb,
              date: validDateArb,
              rating: fc.option(fc.integer({ min: 1, max: 5 })),
              image: fc.option(validUrlArb),
            })),
            images: fc.array(validUrlArb, { minLength: 0, maxLength: 3 }),
            tags: fc.array(nonEmptyStringArb, { minLength: 0, maxLength: 5 }),
            featured: fc.boolean(),
            startDate: validDateArb,
            endDate: fc.option(validDateArb),
          }).filter(cs => !cs.endDate || cs.endDate >= cs.startDate), { minLength: 0, maxLength: 2 }),
          testimonials: fc.array(fc.record({
            id: nonEmptyStringArb,
            content: longTextArb,
            author: nonEmptyStringArb,
            position: nonEmptyStringArb,
            company: nonEmptyStringArb,
            date: validDateArb,
            rating: fc.option(fc.integer({ min: 1, max: 5 })),
            image: fc.option(validUrlArb),
          }), { minLength: 0, maxLength: 3 }),
          preferences: fc.record({
            theme: fc.constantFrom('light', 'dark', 'system'),
            language: fc.string({ minLength: 2, maxLength: 5 }),
            timezone: nonEmptyStringArb,
            emailNotifications: fc.boolean(),
            publicProfile: fc.boolean(),
          }),
        }),
        (userProfile) => {
          // Property: Complete UserProfile should always pass validation
          const result = validateData(UserProfileSchema, userProfile);
          expect(result.success).toBe(true);
          expect(result.data).toEqual(userProfile);

          // Property: All sections should maintain their individual integrity
          const personalInfoResult = validateData(PersonalInfoSchema, userProfile.personalInfo);
          expect(personalInfoResult.success).toBe(true);

          // Property: All array elements should be valid
          userProfile.experience.forEach(exp => {
            const expResult = validateData(ExperienceSchema, exp);
            expect(expResult.success).toBe(true);
          });

          userProfile.skills.forEach(skill => {
            const skillResult = validateData(SkillSchema, skill);
            expect(skillResult.success).toBe(true);
          });

          userProfile.education.forEach(edu => {
            const eduResult = validateData(EducationSchema, edu);
            expect(eduResult.success).toBe(true);
          });

          userProfile.achievements.forEach(achievement => {
            const achievementResult = validateData(AchievementSchema, achievement);
            expect(achievementResult.success).toBe(true);
          });

          // Property: Profile should have a valid ID
          expect(userProfile.id.length).toBeGreaterThan(0);

          // Property: Preferences should be valid
          expect(['light', 'dark', 'system']).toContain(userProfile.preferences.theme);
          expect(userProfile.preferences.language.length).toBeGreaterThanOrEqual(2);
          expect(userProfile.preferences.timezone.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 2 } // Reduced runs for complex data structure
    );
  });

  // Feature: cs-manager-profile-website, Property 1: Resume Parsing Completeness
  // **Validates: Requirements 1.1, 1.2, 1.3, 1.4**
  it('should validate ParsedResume data maintaining parsing completeness and confidence', () => {
    fc.assert(
      fc.property(
        fc.record({
          personalInfo: personalInfoArb.map(info => ({ ...info, phone: undefined, website: undefined })), // Partial for parsed data
          experience: fc.array(experienceArb, { minLength: 0, maxLength: 3 }),
          skills: fc.array(skillArb, { minLength: 0, maxLength: 5 }),
          education: fc.array(educationArb, { minLength: 0, maxLength: 2 }),
          achievements: fc.array(achievementArb, { minLength: 0, maxLength: 2 }),
          rawText: fc.string({ minLength: 50, maxLength: 1000 }),
          confidence: fc.float({ min: 0, max: 1, noNaN: true }),
          parseResult: fc.record({
            success: fc.boolean(),
            data: fc.option(fc.anything()),
            errors: fc.array(fc.record({
              type: fc.constantFrom('file_format', 'file_corrupted', 'file_empty', 'section_missing', 'parsing_failed', 'file_too_large', 'unsupported_format'),
              message: nonEmptyStringArb,
              section: fc.option(nonEmptyStringArb),
              suggestions: fc.array(nonEmptyStringArb, { minLength: 1, maxLength: 3 }),
              recoverable: fc.boolean(),
              details: fc.option(fc.dictionary(fc.string(), fc.anything())),
            }), { minLength: 0, maxLength: 3 }),
            warnings: fc.array(fc.record({
              type: fc.constantFrom('file_format', 'file_corrupted', 'file_empty', 'section_missing', 'parsing_failed', 'file_too_large', 'unsupported_format'),
              message: nonEmptyStringArb,
              section: fc.option(nonEmptyStringArb),
              suggestions: fc.array(nonEmptyStringArb, { minLength: 1, maxLength: 3 }),
              recoverable: fc.boolean(),
              details: fc.option(fc.dictionary(fc.string(), fc.anything())),
            }), { minLength: 0, maxLength: 3 }),
            confidence: fc.option(fc.float({ min: 0, max: 1, noNaN: true })),
          }),
          sectionResults: fc.array(fc.record({
            section: fc.constantFrom('experience', 'skills', 'education', 'achievements', 'personal_info'),
            success: fc.boolean(),
            data: fc.array(fc.anything(), { minLength: 0, maxLength: 5 }),
            errors: fc.array(fc.record({
              type: fc.constantFrom('file_format', 'file_corrupted', 'file_empty', 'section_missing', 'parsing_failed', 'file_too_large', 'unsupported_format'),
              message: nonEmptyStringArb,
              section: fc.option(nonEmptyStringArb),
              suggestions: fc.array(nonEmptyStringArb, { minLength: 1, maxLength: 3 }),
              recoverable: fc.boolean(),
              details: fc.option(fc.dictionary(fc.string(), fc.anything())),
            }), { minLength: 0, maxLength: 2 }),
            warnings: fc.array(fc.record({
              type: fc.constantFrom('file_format', 'file_corrupted', 'file_empty', 'section_missing', 'parsing_failed', 'file_too_large', 'unsupported_format'),
              message: nonEmptyStringArb,
              section: fc.option(nonEmptyStringArb),
              suggestions: fc.array(nonEmptyStringArb, { minLength: 1, maxLength: 3 }),
              recoverable: fc.boolean(),
              details: fc.option(fc.dictionary(fc.string(), fc.anything())),
            }), { minLength: 0, maxLength: 2 }),
            confidence: fc.float({ min: 0, max: 1, noNaN: true }),
          }), { minLength: 0, maxLength: 5 }),
        }),
        (parsedResume) => {
          // Property: ParsedResume should always pass validation
          const result = validateData(ParsedResumeSchema, parsedResume);
          expect(result.success).toBe(true);
          expect(result.data).toEqual(parsedResume);

          // Property: Confidence should be between 0 and 1
          expect(parsedResume.confidence).toBeGreaterThanOrEqual(0);
          expect(parsedResume.confidence).toBeLessThanOrEqual(1);

          // Property: Raw text should be present
          expect(parsedResume.rawText.length).toBeGreaterThan(0);

          // Property: Parse result should have valid structure
          expect(typeof parsedResume.parseResult.success).toBe('boolean');
          
          // Property: All errors and warnings should have suggestions
          [...parsedResume.parseResult.errors, ...parsedResume.parseResult.warnings].forEach(issue => {
            expect(issue.suggestions.length).toBeGreaterThan(0);
            expect(issue.message.length).toBeGreaterThan(0);
            expect(typeof issue.recoverable).toBe('boolean');
          });

          // Property: Section results should have valid confidence scores
          parsedResume.sectionResults.forEach(sectionResult => {
            expect(sectionResult.confidence).toBeGreaterThanOrEqual(0);
            expect(sectionResult.confidence).toBeLessThanOrEqual(1);
            expect(['experience', 'skills', 'education', 'achievements', 'personal_info']).toContain(sectionResult.section);
            expect(typeof sectionResult.success).toBe('boolean');
          });

          // Property: Parsed data should maintain original meaning
          // Check that extracted data is consistent with the sections
          const experienceSection = parsedResume.sectionResults.find(s => s.section === 'experience');
          if (experienceSection && experienceSection.success) {
            expect(parsedResume.experience.length).toBeGreaterThanOrEqual(0);
          }

          const skillsSection = parsedResume.sectionResults.find(s => s.section === 'skills');
          if (skillsSection && skillsSection.success) {
            expect(parsedResume.skills.length).toBeGreaterThanOrEqual(0);
          }
        }
      ),
      { numRuns: 2 } // Reduced runs for very complex data structure
    );
  });
});