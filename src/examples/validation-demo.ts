// Demonstration of TypeScript interfaces and Zod validation schemas
// This file shows how the interfaces and validation work together

import type {
  PersonalInfo,
  Experience,
  CaseStudy,
  Metric,
  ContactFormData,
  UserProfile,
} from '../types';

import {
  validatePersonalInfo,
  validateExperience,
  validateCaseStudy,
  validateMetric,
  validateContactFormData,
  validateUserProfile,
  safeValidatePersonalInfo,
  isPersonalInfo,
} from '../utils/validation';

// Example 1: Valid Personal Info
const validPersonalInfo: PersonalInfo = {
  name: 'Sarah Johnson',
  title: 'Senior Customer Success Manager',
  location: 'Austin, TX',
  email: 'sarah.johnson@example.com',
  phone: '+1-512-555-0123',
  linkedIn: 'https://linkedin.com/in/sarahjohnson',
  website: 'https://sarahjohnson.dev',
  summary: 'Experienced customer success manager with 7+ years of experience driving customer retention and growth in SaaS environments.',
  profileImage: 'https://example.com/sarah-profile.jpg',
};

// Example 2: Valid Experience
const validExperience: Experience = {
  id: 'exp-001',
  company: 'TechFlow Solutions',
  position: 'Senior Customer Success Manager',
  startDate: new Date('2021-03-01'),
  endDate: new Date('2024-01-15'),
  location: 'Austin, TX',
  description: 'Led customer success initiatives for enterprise SaaS clients, focusing on onboarding, retention, and expansion strategies.',
  achievements: [
    'Increased customer retention rate from 85% to 96% over 2 years',
    'Reduced average onboarding time by 40% through process optimization',
    'Generated $2.3M in expansion revenue through upselling initiatives',
    'Maintained 98% customer satisfaction score across 150+ enterprise accounts',
  ],
  technologies: ['Salesforce', 'HubSpot', 'Zendesk', 'Gainsight', 'Slack', 'Zoom'],
  metrics: [
    {
      id: 'metric-001',
      name: 'Customer Retention Rate',
      value: 96,
      unit: '%',
      description: 'Percentage of customers retained over 12-month period',
      category: 'retention',
      timeframe: '2023',
      context: 'Enterprise customers ($50K+ ARR)',
    },
    {
      id: 'metric-002',
      name: 'Net Revenue Retention',
      value: 118,
      unit: '%',
      description: 'Revenue growth from existing customers including expansion',
      category: 'growth',
      timeframe: '2023',
      context: 'All customer segments',
    },
  ],
};

// Example 3: Valid Case Study
const validCaseStudy: CaseStudy = {
  id: 'case-001',
  title: 'Enterprise Manufacturing Client Digital Transformation',
  client: 'Global Manufacturing Corp',
  industry: 'Manufacturing',
  challenge: 'A Fortune 500 manufacturing company needed to digitize their customer service operations across 15 global locations. They were struggling with inconsistent processes, poor visibility into customer issues, and declining satisfaction scores.',
  solution: 'Implemented a comprehensive customer success platform with automated workflows, real-time dashboards, and integrated communication tools. Developed custom training programs for 200+ customer service representatives across all locations.',
  implementation: [
    'Conducted comprehensive stakeholder analysis and requirements gathering',
    'Designed custom workflow automation for ticket routing and escalation',
    'Implemented real-time dashboard for visibility across all locations',
    'Created role-based training programs for different user types',
    'Established 24/7 support during 6-month rollout period',
    'Developed KPI tracking and reporting framework',
  ],
  results: [
    {
      id: 'result-001',
      description: 'Customer satisfaction scores improved significantly',
      metric: {
        id: 'metric-csat',
        name: 'Customer Satisfaction Score',
        value: 4.8,
        unit: '/5.0',
        description: 'Average customer satisfaction rating',
        category: 'satisfaction',
        timeframe: '6 months post-implementation',
        context: 'All customer touchpoints',
      },
      impact: 'high',
    },
    {
      id: 'result-002',
      description: 'Ticket resolution time decreased dramatically',
      metric: {
        id: 'metric-resolution',
        name: 'Average Resolution Time',
        value: 4.2,
        unit: 'hours',
        description: 'Average time to resolve customer issues',
        category: 'efficiency',
        timeframe: '6 months post-implementation',
        context: 'All ticket types',
      },
      impact: 'high',
    },
  ],
  testimonial: {
    id: 'testimonial-001',
    content: 'Sarah and her team transformed our customer service operations completely. The new system has not only improved our efficiency but also significantly enhanced our customer relationships. The training and support provided during implementation was exceptional.',
    author: 'Michael Chen',
    position: 'VP of Customer Operations',
    company: 'Global Manufacturing Corp',
    date: new Date('2023-09-15'),
    rating: 5,
  },
  images: [
    'https://example.com/case-study-dashboard.jpg',
    'https://example.com/case-study-workflow.jpg',
    'https://example.com/case-study-results.jpg',
  ],
  tags: ['enterprise', 'manufacturing', 'digital-transformation', 'automation', 'training'],
  featured: true,
  startDate: new Date('2023-01-15'),
  endDate: new Date('2023-07-30'),
};

// Example 4: Valid Contact Form Data
const validContactFormData: ContactFormData = {
  name: 'Alex Rodriguez',
  email: 'alex.rodriguez@techstartup.com',
  company: 'TechStartup Inc.',
  message: 'Hi Sarah, I came across your profile and was impressed by your track record in customer success. We are a growing SaaS company looking for someone with your expertise to help scale our customer success operations. Would you be interested in discussing potential opportunities?',
  subject: 'Customer Success Leadership Opportunity',
};

// Example 5: Complete User Profile
const validUserProfile: UserProfile = {
  id: 'user-sarah-johnson',
  personalInfo: validPersonalInfo,
  experience: [validExperience],
  skills: [
    {
      id: 'skill-001',
      name: 'Customer Relationship Management',
      category: 'soft',
      level: 'expert',
      description: 'Building and maintaining strong relationships with enterprise clients',
    },
    {
      id: 'skill-002',
      name: 'Salesforce Administration',
      category: 'technical',
      level: 'advanced',
      description: 'Advanced Salesforce configuration and automation',
    },
    {
      id: 'skill-003',
      name: 'SaaS Industry Knowledge',
      category: 'industry',
      level: 'expert',
      description: 'Deep understanding of SaaS business models and metrics',
    },
  ],
  education: [
    {
      id: 'edu-001',
      institution: 'University of Texas at Austin',
      degree: 'Bachelor of Business Administration',
      field: 'Marketing',
      startDate: new Date('2014-08-01'),
      endDate: new Date('2018-05-15'),
      gpa: 3.7,
      achievements: ['Magna Cum Laude', 'Marketing Society President'],
    },
  ],
  certifications: [
    {
      id: 'cert-001',
      name: 'Certified Customer Success Manager',
      issuer: 'Customer Success Association',
      issueDate: new Date('2020-06-15'),
      credentialId: 'CSA-CSM-2020-001234',
      credentialUrl: 'https://credentials.csa.org/001234',
    },
    {
      id: 'cert-002',
      name: 'Salesforce Certified Administrator',
      issuer: 'Salesforce',
      issueDate: new Date('2021-03-20'),
      expiryDate: new Date('2024-03-20'),
      credentialId: 'SF-ADM-2021-567890',
    },
  ],
  achievements: [
    {
      id: 'achievement-001',
      title: 'Customer Success Manager of the Year',
      description: 'Recognized for outstanding performance in customer retention and growth',
      date: new Date('2023-12-01'),
      category: 'award',
      organization: 'TechFlow Solutions',
    },
  ],
  caseStudies: [validCaseStudy],
  testimonials: [
    {
      id: 'testimonial-002',
      content: 'Sarah is an exceptional customer success manager who consistently goes above and beyond for her clients. Her strategic approach and attention to detail have been instrumental in our company\'s growth.',
      author: 'Jennifer Liu',
      position: 'CEO',
      company: 'DataFlow Analytics',
      date: new Date('2023-11-10'),
      rating: 5,
    },
  ],
  preferences: {
    theme: 'light',
    language: 'en',
    timezone: 'America/Chicago',
    emailNotifications: true,
    publicProfile: true,
  },
};

// Demonstration Functions
export function demonstrateValidation() {
  console.log('=== TypeScript Interfaces and Zod Validation Demo ===\n');

  // Test 1: Valid Personal Info
  console.log('1. Testing Valid Personal Info:');
  const personalInfoResult = validatePersonalInfo(validPersonalInfo);
  console.log('   Valid:', personalInfoResult.isValid);
  console.log('   Errors:', personalInfoResult.errors);
  console.log('');

  // Test 2: Invalid Personal Info (missing required fields)
  console.log('2. Testing Invalid Personal Info:');
  const invalidPersonalInfo = {
    name: '',
    email: 'invalid-email',
    summary: 'Too short',
  };
  const invalidPersonalInfoResult = validatePersonalInfo(invalidPersonalInfo);
  console.log('   Valid:', invalidPersonalInfoResult.isValid);
  console.log('   Errors:', invalidPersonalInfoResult.errors);
  console.log('');

  // Test 3: Valid Experience
  console.log('3. Testing Valid Experience:');
  const experienceResult = validateExperience(validExperience);
  console.log('   Valid:', experienceResult.isValid);
  console.log('   Errors:', experienceResult.errors);
  console.log('');

  // Test 4: Valid Case Study
  console.log('4. Testing Valid Case Study:');
  const caseStudyResult = validateCaseStudy(validCaseStudy);
  console.log('   Valid:', caseStudyResult.isValid);
  console.log('   Errors:', caseStudyResult.errors);
  console.log('');

  // Test 5: Valid Contact Form
  console.log('5. Testing Valid Contact Form:');
  const contactFormResult = validateContactFormData(validContactFormData);
  console.log('   Valid:', contactFormResult.isValid);
  console.log('   Errors:', contactFormResult.errors);
  console.log('');

  // Test 6: Complete User Profile
  console.log('6. Testing Complete User Profile:');
  const userProfileResult = validateUserProfile(validUserProfile);
  console.log('   Valid:', userProfileResult.isValid);
  console.log('   Errors:', userProfileResult.errors);
  console.log('');

  // Test 7: Safe Validation
  console.log('7. Testing Safe Validation:');
  const safeResult = safeValidatePersonalInfo(validPersonalInfo);
  console.log('   Safe validation result:', safeResult ? 'Success' : 'Failed');
  console.log('');

  // Test 8: Type Guards
  console.log('8. Testing Type Guards:');
  console.log('   Is valid personal info:', isPersonalInfo(validPersonalInfo));
  console.log('   Is invalid data personal info:', isPersonalInfo({ invalid: 'data' }));
  console.log('');

  console.log('=== Demo Complete ===');
}

// Export examples for use in other files
export {
  validPersonalInfo,
  validExperience,
  validCaseStudy,
  validContactFormData,
  validUserProfile,
};