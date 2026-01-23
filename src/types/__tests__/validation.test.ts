/**
 * @jest-environment node
 */
import { describe, it, expect } from '@jest/globals';
import {
  PersonalInfoSchema,
  ExperienceSchema,
  CaseStudySchema,
  MetricSchema,
  ContactFormDataSchema,
  UserProfileSchema,
  validateData,
  safeValidateData,
  getValidationErrors,
  formatValidationErrors,
} from '../validation';
import type {
  PersonalInfo,
  Experience,
  CaseStudy,
  Metric,
  ContactFormData,
  UserProfile,
} from '../index';

describe('Validation Schemas', () => {
  describe('PersonalInfoSchema', () => {
    it('should validate valid personal info', () => {
      const validPersonalInfo: PersonalInfo = {
        name: 'John Doe',
        title: 'Customer Success Manager',
        location: 'San Francisco, CA',
        email: 'john.doe@example.com',
        phone: '+1-555-0123',
        linkedIn: 'https://linkedin.com/in/johndoe',
        website: 'https://johndoe.com',
        summary: 'Experienced customer success manager with 5+ years of experience.',
        profileImage: 'https://example.com/profile.jpg',
      };

      const result = validateData(PersonalInfoSchema, validPersonalInfo);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validPersonalInfo);
    });

    it('should reject invalid email', () => {
      const invalidPersonalInfo = {
        name: 'John Doe',
        title: 'Customer Success Manager',
        location: 'San Francisco, CA',
        email: 'invalid-email',
        linkedIn: 'https://linkedin.com/in/johndoe',
        summary: 'Experienced customer success manager with 5+ years of experience.',
        profileImage: 'https://example.com/profile.jpg',
      };

      const result = validateData(PersonalInfoSchema, invalidPersonalInfo);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('should reject empty required fields', () => {
      const invalidPersonalInfo = {
        name: '',
        title: 'Customer Success Manager',
        location: 'San Francisco, CA',
        email: 'john.doe@example.com',
        linkedIn: 'https://linkedin.com/in/johndoe',
        summary: 'Short',
        profileImage: 'https://example.com/profile.jpg',
      };

      const result = validateData(PersonalInfoSchema, invalidPersonalInfo);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });

  describe('MetricSchema', () => {
    it('should validate valid metric', () => {
      const validMetric: Metric = {
        id: 'metric-1',
        name: 'Customer Retention Rate',
        value: 95,
        unit: '%',
        description: 'Percentage of customers retained over 12 months',
        category: 'retention',
        timeframe: '12 months',
        context: 'Enterprise customers',
      };

      const result = validateData(MetricSchema, validMetric);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validMetric);
    });

    it('should accept string values', () => {
      const validMetric: Metric = {
        id: 'metric-2',
        name: 'Customer Satisfaction',
        value: 'Excellent',
        unit: 'rating',
        description: 'Overall customer satisfaction rating',
        category: 'satisfaction',
        timeframe: 'Q4 2023',
        context: 'All customer segments',
      };

      const result = validateData(MetricSchema, validMetric);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validMetric);
    });

    it('should reject invalid category', () => {
      const invalidMetric = {
        id: 'metric-1',
        name: 'Customer Retention Rate',
        value: 95,
        unit: '%',
        description: 'Percentage of customers retained over 12 months',
        category: 'invalid-category',
        timeframe: '12 months',
        context: 'Enterprise customers',
      };

      const result = validateData(MetricSchema, invalidMetric);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });

  describe('ExperienceSchema', () => {
    it('should validate valid experience', () => {
      const validExperience: Experience = {
        id: 'exp-1',
        company: 'TechCorp Inc.',
        position: 'Senior Customer Success Manager',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2023-12-31'),
        location: 'San Francisco, CA',
        description: 'Led customer success initiatives for enterprise clients.',
        achievements: [
          'Increased customer retention by 25%',
          'Reduced churn rate by 15%',
        ],
        technologies: ['Salesforce', 'HubSpot', 'Zendesk'],
        metrics: [],
      };

      const result = validateData(ExperienceSchema, validExperience);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validExperience);
    });

    it('should reject end date before start date', () => {
      const invalidExperience = {
        id: 'exp-1',
        company: 'TechCorp Inc.',
        position: 'Senior Customer Success Manager',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2020-12-31'),
        location: 'San Francisco, CA',
        description: 'Led customer success initiatives for enterprise clients.',
        achievements: ['Increased customer retention by 25%'],
        technologies: ['Salesforce'],
        metrics: [],
      };

      const result = validateData(ExperienceSchema, invalidExperience);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('should accept experience without end date (current position)', () => {
      const currentExperience: Experience = {
        id: 'exp-2',
        company: 'Current Corp',
        position: 'Customer Success Manager',
        startDate: new Date('2023-01-01'),
        location: 'Remote',
        description: 'Currently managing customer success for SaaS platform.',
        achievements: ['Onboarded 50+ new clients'],
        technologies: ['Intercom', 'Slack'],
        metrics: [],
      };

      const result = validateData(ExperienceSchema, currentExperience);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(currentExperience);
    });
  });

  describe('CaseStudySchema', () => {
    it('should validate valid case study', () => {
      const validCaseStudy: CaseStudy = {
        id: 'case-1',
        title: 'Enterprise Client Onboarding Success',
        client: 'Fortune 500 Company',
        industry: 'Technology',
        challenge: 'Complex integration requirements and tight timeline for go-live.',
        solution: 'Developed custom onboarding process with dedicated support team.',
        implementation: [
          'Conducted stakeholder analysis',
          'Created custom integration plan',
          'Provided 24/7 support during rollout',
        ],
        results: [],
        images: ['https://example.com/case1-img1.jpg'],
        tags: ['enterprise', 'onboarding', 'integration'],
        featured: true,
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-03-31'),
      };

      const result = validateData(CaseStudySchema, validCaseStudy);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validCaseStudy);
    });

    it('should reject case study with short challenge description', () => {
      const invalidCaseStudy = {
        id: 'case-1',
        title: 'Test Case',
        client: 'Test Client',
        industry: 'Technology',
        challenge: 'Short',
        solution: 'Developed custom onboarding process with dedicated support team.',
        implementation: ['Step 1'],
        results: [],
        images: [],
        tags: ['test'],
        featured: false,
        startDate: new Date('2023-01-01'),
      };

      const result = validateData(CaseStudySchema, invalidCaseStudy);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });

  describe('ContactFormDataSchema', () => {
    it('should validate valid contact form data', () => {
      const validContactData: ContactFormData = {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        company: 'Example Corp',
        message: 'I would like to discuss potential collaboration opportunities.',
        subject: 'Partnership Inquiry',
      };

      const result = validateData(ContactFormDataSchema, validContactData);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validContactData);
    });

    it('should reject message that is too short', () => {
      const invalidContactData = {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        message: 'Hi',
        subject: 'Test',
      };

      const result = validateData(ContactFormDataSchema, invalidContactData);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('should reject message that is too long', () => {
      const longMessage = 'A'.repeat(1001);
      const invalidContactData = {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        message: longMessage,
        subject: 'Test',
      };

      const result = validateData(ContactFormDataSchema, invalidContactData);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });

  describe('UserProfileSchema', () => {
    it('should validate complete user profile', () => {
      const validUserProfile: UserProfile = {
        id: 'user-1',
        personalInfo: {
          name: 'John Doe',
          title: 'Customer Success Manager',
          location: 'San Francisco, CA',
          email: 'john.doe@example.com',
          linkedIn: 'https://linkedin.com/in/johndoe',
          summary: 'Experienced customer success manager with 5+ years of experience.',
          profileImage: 'https://example.com/profile.jpg',
        },
        experience: [],
        skills: [],
        education: [],
        certifications: [],
        achievements: [],
        caseStudies: [],
        testimonials: [],
        preferences: {
          theme: 'light',
          language: 'en',
          timezone: 'America/Los_Angeles',
          emailNotifications: true,
          publicProfile: true,
        },
      };

      const result = validateData(UserProfileSchema, validUserProfile);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validUserProfile);
    });
  });

  describe('Utility Functions', () => {
    describe('safeValidateData', () => {
      it('should return data on successful validation', () => {
        const validData = {
          name: 'Test',
          email: 'test@example.com',
          message: 'This is a test message',
          subject: 'Test Subject',
        };

        const result = safeValidateData(ContactFormDataSchema, validData);
        expect(result).toEqual(validData);
      });

      it('should return null on validation failure', () => {
        const invalidData = {
          name: '',
          email: 'invalid-email',
          message: 'Hi',
          subject: '',
        };

        const result = safeValidateData(ContactFormDataSchema, invalidData);
        expect(result).toBeNull();
      });
    });

    describe('getValidationErrors', () => {
      it('should format validation errors correctly', () => {
        const invalidData = {
          name: '',
          email: 'invalid-email',
          message: 'Hi',
          subject: '',
        };

        const result = validateData(ContactFormDataSchema, invalidData);
        expect(result.success).toBe(false);
        
        if (result.errors) {
          const validationErrors = getValidationErrors(result.errors);
          const formattedErrors = formatValidationErrors(validationErrors);
          expect(formattedErrors).toHaveProperty('name');
          expect(formattedErrors).toHaveProperty('email');
          expect(formattedErrors).toHaveProperty('message');
          expect(formattedErrors).toHaveProperty('subject');
          
          expect(Array.isArray(formattedErrors.name)).toBe(true);
          expect(formattedErrors.name.length).toBeGreaterThan(0);
        }
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle optional fields correctly', () => {
      const minimalPersonalInfo = {
        name: 'John Doe',
        title: 'Customer Success Manager',
        location: 'San Francisco, CA',
        email: 'john.doe@example.com',
        linkedIn: 'https://linkedin.com/in/johndoe',
        summary: 'Experienced customer success manager with 5+ years of experience.',
        profileImage: 'https://example.com/profile.jpg',
      };

      const result = validateData(PersonalInfoSchema, minimalPersonalInfo);
      expect(result.success).toBe(true);
    });

    it('should validate URL fields correctly', () => {
      const invalidUrls = {
        name: 'John Doe',
        title: 'Customer Success Manager',
        location: 'San Francisco, CA',
        email: 'john.doe@example.com',
        linkedIn: 'not-a-url',
        website: 'also-not-a-url',
        summary: 'Experienced customer success manager with 5+ years of experience.',
        profileImage: 'not-a-url-either',
      };

      const result = validateData(PersonalInfoSchema, invalidUrls);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('should validate array fields correctly', () => {
      const experienceWithEmptyAchievements = {
        id: 'exp-1',
        company: 'TechCorp Inc.',
        position: 'Senior Customer Success Manager',
        startDate: new Date('2020-01-01'),
        location: 'San Francisco, CA',
        description: 'Led customer success initiatives for enterprise clients.',
        achievements: ['', 'Valid achievement'],
        technologies: ['Salesforce'],
        metrics: [],
      };

      const result = validateData(ExperienceSchema, experienceWithEmptyAchievements);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });
});