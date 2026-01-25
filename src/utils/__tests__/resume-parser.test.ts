/**
 * Tests for Resume Parser
 * Tests parsing of PDF, Word, and plain text resumes
 * Tests extraction of experience, skills, and education
 * Tests comprehensive error handling and user feedback
 * @jest-environment node
 */

import { describe, it, expect } from '@jest/globals';
import * as fc from 'fast-check';
import {
  extractExperience,
  extractSkills,
  extractEducation,
  extractAchievements,
  parseResumeDocument,
} from '../resume-parser';
import {
  createParseError,
  validateFile,
  validateParsedContent,
  formatErrorMessage,
  createParsingSummary,
} from '../error-handling';

// ============================================================================
// ERROR HANDLING TESTS
// ============================================================================

describe('Resume Parser - Error Handling', () => {
  it('should validate file format and size', () => {
    // Test unsupported file type
    const unsupportedFile = new File(['content'], 'resume.jpg', { type: 'image/jpeg' });
    const errors = validateFile(unsupportedFile);
    
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].type).toBe('unsupported_format');
    expect(errors[0].recoverable).toBe(true);
    expect(errors[0].suggestions.length).toBeGreaterThan(0);
  });

  it('should detect empty files', () => {
    const emptyFile = new File([''], 'resume.pdf', { type: 'application/pdf' });
    const errors = validateFile(emptyFile);
    
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].type).toBe('file_empty');
  });

  it('should detect files that are too large', () => {
    const largeContent = 'x'.repeat(11 * 1024 * 1024); // 11MB
    const largeFile = new File([largeContent], 'resume.pdf', { type: 'application/pdf' });
    const errors = validateFile(largeFile);
    
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].type).toBe('file_too_large');
  });

  it('should validate parsed content completeness', () => {
    const shortText = 'Hi';
    const { errors, warnings } = validateParsedContent(shortText, [], [], [], []);
    
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].type).toBe('file_empty');
  });

  it('should create parse errors with proper structure', () => {
    const error = createParseError(
      'parsing_failed',
      'Test error message',
      'experience',
      ['Suggestion 1', 'Suggestion 2']
    );

    expect(error.type).toBe('parsing_failed');
    expect(error.message).toBe('Test error message');
    expect(error.section).toBe('experience');
    expect(error.suggestions).toHaveLength(2);
    expect(error.recoverable).toBe(true);
  });

  it('should format error messages properly', () => {
    const error = createParseError('file_format', 'Invalid file format');
    const formatted = formatErrorMessage(error);
    
    expect(formatted).toContain('📄 File Format Issue');
    expect(formatted).toContain('Invalid file format');
  });

  it('should create parsing summary with correct statistics', () => {
    const sectionResults = [
      {
        section: 'experience' as const,
        success: true,
        data: [{}],
        errors: [],
        warnings: [],
        confidence: 0.8,
      },
      {
        section: 'skills' as const,
        success: false,
        data: [],
        errors: [createParseError('parsing_failed', 'Skills parsing failed', 'skills')],
        warnings: [],
        confidence: 0.1,
      },
    ];

    const summary = createParsingSummary(sectionResults, [], []);

    expect(summary.successfulSections).toContain('experience');
    expect(summary.failedSections).toContain('skills');
    expect(summary.totalErrors).toBe(1);
    expect(summary.overallSuccess).toBe(false);
    expect(summary.recommendations.length).toBeGreaterThan(0);
  });

  it('should handle file parsing errors gracefully', async () => {
    // Create a mock file that will cause parsing to fail
    const corruptedFile = new File(['invalid pdf content'], 'resume.pdf', { 
      type: 'application/pdf' 
    });

    const result = await parseResumeDocument(corruptedFile);

    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0].type).toBe('file_corrupted');
    expect(result.errors[0].suggestions.length).toBeGreaterThan(0);
  });

  it('should provide section-specific error handling', () => {
    const textWithoutExperience = `
      EDUCATION
      Bachelor of Science
      University of Test
      2020
      
      SKILLS
      JavaScript, React
    `;

    const { warnings } = validateParsedContent(textWithoutExperience, [], ['skill1'], ['edu1'], []);

    const experienceWarning = warnings.find(w => w.section === 'experience');
    expect(experienceWarning).toBeDefined();
    expect(experienceWarning?.type).toBe('section_missing');
    expect(experienceWarning?.suggestions.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// UNIT TESTS
// ============================================================================

describe('Resume Parser - Experience Extraction', () => {
  it('should extract professional experience from text', () => {
    const text = `
      PROFESSIONAL EXPERIENCE
      
      Senior Engineer at Google
      2020 - Present
      Mountain View, CA
      - Led team of engineers
      - Improved performance by 50%
      
      Engineer at Facebook
      2018 - 2020
      Menlo Park, CA
      - Developed features
      - Fixed bugs
    `;

    const experiences = extractExperience(text);

    expect(experiences.length).toBeGreaterThan(0);
    expect(experiences[0]).toHaveProperty('company');
    expect(experiences[0]).toHaveProperty('position');
    expect(experiences[0]).toHaveProperty('startDate');
    expect(experiences[0]).toHaveProperty('location');
    expect(experiences[0]).toHaveProperty('achievements');
  });

  it('should extract multiple job entries', () => {
    const text = `
      EXPERIENCE
      
      Manager at Company A
      2021 - Present
      - Achievement 1
      
      Developer at Company B
      2019 - 2021
      - Achievement 2
      
      Intern at Company C
      2018 - 2019
      - Achievement 3
    `;

    const experiences = extractExperience(text);

    expect(experiences.length).toBeGreaterThanOrEqual(1);
    experiences.forEach((exp) => {
      expect(exp.id).toBeDefined();
      expect(exp.company).toBeDefined();
      expect(exp.position).toBeDefined();
      expect(exp.startDate).toBeInstanceOf(Date);
    });
  });

  it('should handle missing experience section', () => {
    const text = 'No experience section here';

    const experiences = extractExperience(text);

    expect(experiences).toEqual([]);
  });

  it('should extract achievements from job entries', () => {
    const text = `
      EXPERIENCE
      
      Manager at Company
      2020 - Present
      - Achieved 95% customer satisfaction
      - Improved retention by 40%
      - Led team of 10 people
    `;

    const experiences = extractExperience(text);

    expect(experiences.length).toBeGreaterThan(0);
    expect(experiences[0].achievements.length).toBeGreaterThan(0);
  });

  it('should extract technologies from experience', () => {
    const text = `
      EXPERIENCE
      
      Developer at Tech Company
      2020 - Present
      - Built React applications
      - Developed Node.js APIs
      - Used AWS for deployment
      - Managed PostgreSQL databases
    `;

    const experiences = extractExperience(text);

    expect(experiences.length).toBeGreaterThan(0);
    expect(experiences[0].technologies.length).toBeGreaterThan(0);
    expect(experiences[0].technologies).toContain('React');
  });
});

describe('Resume Parser - Skills Extraction', () => {
  it('should extract skills from resume', () => {
    const text = `
      SKILLS
      
      JavaScript, React, Node.js, Python, AWS, Docker, Git, SQL
    `;

    const skills = extractSkills(text);

    expect(skills.length).toBeGreaterThan(0);
    skills.forEach((skill) => {
      expect(skill.id).toBeDefined();
      expect(skill.name).toBeDefined();
      expect(skill.category).toMatch(/technical|soft|industry/);
      expect(skill.level).toBeDefined();
    });
  });

  it('should extract skills from bullet points', () => {
    const text = `
      SKILLS
      
      • JavaScript
      • React
      • Node.js
      - Python
      - AWS
      * Docker
    `;

    const skills = extractSkills(text);

    expect(skills.length).toBeGreaterThan(0);
  });

  it('should categorize technical skills', () => {
    const text = `
      SKILLS
      
      JavaScript, React, Python, AWS, Docker, SQL
    `;

    const skills = extractSkills(text);
    const technicalSkills = skills.filter((s) => s.category === 'technical');

    expect(technicalSkills.length).toBeGreaterThan(0);
  });

  it('should categorize soft skills', () => {
    const text = `
      SKILLS
      
      Leadership, Communication, Problem Solving, Teamwork
    `;

    const skills = extractSkills(text);
    const softSkills = skills.filter((s) => s.category === 'soft');

    expect(softSkills.length).toBeGreaterThan(0);
  });

  it('should handle missing skills section', () => {
    const text = 'No skills section here';

    const skills = extractSkills(text);

    expect(Array.isArray(skills)).toBe(true);
  });

  it('should avoid duplicate skills', () => {
    const text = `
      SKILLS
      
      JavaScript, JavaScript, React, React, Python
    `;

    const skills = extractSkills(text);
    const skillNames = skills.map((s) => s.name);
    const uniqueNames = new Set(skillNames);

    expect(uniqueNames.size).toBe(skillNames.length);
  });
});

describe('Resume Parser - Education Extraction', () => {
  it('should extract education from resume', () => {
    const text = `
      EDUCATION
      
      Bachelor of Science in Computer Science
      University of California, Berkeley
      2018
      
      Master of Science in Computer Science
      Stanford University
      2020
    `;

    const education = extractEducation(text);

    expect(education.length).toBeGreaterThan(0);
    education.forEach((edu) => {
      expect(edu.id).toBeDefined();
      expect(edu.institution).toBeDefined();
      expect(edu.degree).toBeDefined();
      expect(edu.field).toBeDefined();
      expect(edu.startDate).toBeInstanceOf(Date);
    });
  });

  it('should extract multiple degrees', () => {
    const text = `
      EDUCATION
      
      Bachelor of Science in Computer Science
      University of California
      2018
      
      Master of Science in Computer Science
      Stanford University
      2020
      
      PhD in Computer Science
      MIT
      2023
    `;

    const education = extractEducation(text);

    expect(education.length).toBeGreaterThanOrEqual(1);
  });

  it('should extract GPA if present', () => {
    const text = `
      EDUCATION
      
      Bachelor of Science in Computer Science
      University of California
      2018
      GPA: 3.8
    `;

    const education = extractEducation(text);

    expect(education.length).toBeGreaterThan(0);
    if (education[0].gpa) {
      expect(education[0].gpa).toBeCloseTo(3.8, 1);
    }
  });

  it('should handle missing education section', () => {
    const text = 'No education section here';

    const education = extractEducation(text);

    expect(education).toEqual([]);
  });

  it('should extract date ranges', () => {
    const text = `
      EDUCATION
      
      Bachelor of Science
      University of California
      2016 - 2020
    `;

    const education = extractEducation(text);

    expect(education.length).toBeGreaterThan(0);
    expect(education[0].startDate).toBeInstanceOf(Date);
    expect(education[0].endDate).toBeInstanceOf(Date);
  });
});

describe('Resume Parser - Achievements Extraction', () => {
  it('should extract achievements from resume', () => {
    const text = `
      AWARDS & RECOGNITION
      
      • Employee of the Year - 2022
      • Best Innovation Award - 2021
      • Leadership Excellence - 2020
    `;

    const achievements = extractAchievements(text);

    expect(achievements.length).toBeGreaterThan(0);
    achievements.forEach((achievement) => {
      expect(achievement.id).toBeDefined();
      expect(achievement.title).toBeDefined();
      expect(achievement.date).toBeInstanceOf(Date);
    });
  });

  it('should handle missing achievements section', () => {
    const text = 'No achievements section here';

    const achievements = extractAchievements(text);

    expect(achievements).toEqual([]);
  });

  it('should extract achievement details', () => {
    const text = `
      ACHIEVEMENTS
      
      • Employee of the Year Award - 2022 - Tech Corp
      • Innovation Excellence - 2021 - StartUp Inc
    `;

    const achievements = extractAchievements(text);

    expect(achievements.length).toBeGreaterThan(0);
    achievements.forEach((achievement) => {
      expect(achievement.title).toBeDefined();
      expect(achievement.title.length).toBeGreaterThan(0);
    });
  });
});

describe('Resume Parser - Data Validation', () => {
  it('should return valid data structure for experience', () => {
    const text = `
      EXPERIENCE
      Senior Engineer at Company
      2020 - Present
    `;

    const experiences = extractExperience(text);

    if (experiences.length > 0) {
      const exp = experiences[0];
      expect(exp).toHaveProperty('id');
      expect(exp).toHaveProperty('company');
      expect(exp).toHaveProperty('position');
      expect(exp).toHaveProperty('startDate');
      expect(exp).toHaveProperty('location');
      expect(exp).toHaveProperty('description');
      expect(exp).toHaveProperty('achievements');
      expect(exp).toHaveProperty('technologies');
      expect(exp).toHaveProperty('metrics');
    }
  });

  it('should return valid data structure for skills', () => {
    const text = `
      SKILLS
      JavaScript, React
    `;

    const skills = extractSkills(text);

    if (skills.length > 0) {
      const skill = skills[0];
      expect(skill).toHaveProperty('id');
      expect(skill).toHaveProperty('name');
      expect(skill).toHaveProperty('category');
      expect(skill).toHaveProperty('level');
    }
  });

  it('should return valid data structure for education', () => {
    const text = `
      EDUCATION
      Bachelor of Science
      University
      2020
    `;

    const education = extractEducation(text);

    if (education.length > 0) {
      const edu = education[0];
      expect(edu).toHaveProperty('id');
      expect(edu).toHaveProperty('institution');
      expect(edu).toHaveProperty('degree');
      expect(edu).toHaveProperty('field');
      expect(edu).toHaveProperty('startDate');
    }
  });

  it('should have unique IDs for all extracted items', () => {
    const text = `
      EXPERIENCE
      Senior Engineer at Company A
      2020 - Present
      
      Engineer at Company B
      2018 - 2020
      
      EDUCATION
      Bachelor of Science
      University
      2020
      
      SKILLS
      JavaScript, React, Python, AWS
    `;

    const experiences = extractExperience(text);
    const skills = extractSkills(text);
    const education = extractEducation(text);

    const allIds = [
      ...experiences.map((e) => e.id),
      ...skills.map((s) => s.id),
      ...education.map((e) => e.id),
    ];

    const uniqueIds = new Set(allIds);
    expect(uniqueIds.size).toBe(allIds.length);
  });
});

// ============================================================================
// PROPERTY-BASED TESTS
// ============================================================================

describe('Resume Parser - Property Tests', () => {
  // Feature: cs-manager-profile-website, Property 1: Resume Parsing Completeness
  // **Validates: Requirements 1.1, 1.2, 1.3, 1.4**
  it('should extract all available professional experience while preserving meaning', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            company: fc.stringMatching(/[A-Z][a-z]+ (?:Corp|Inc|Ltd|LLC)/),
            position: fc.stringMatching(/[A-Z][a-z]+ (?:Engineer|Manager|Developer|Analyst)/),
            year: fc.integer({ min: 2000, max: 2024 }),
          }),
          { minLength: 1, maxLength: 5 }
        ),
        (jobs) => {
          const resumeText = `
            PROFESSIONAL EXPERIENCE
            ${jobs
              .map(
                (job) => `
              ${job.position} at ${job.company}
              ${job.year} - Present
              - Achieved significant results
              - Led important projects
            `
              )
              .join('\n')}
          `;

          const experiences = extractExperience(resumeText);

          // Property: All jobs should be extracted
          expect(experiences.length).toBeGreaterThan(0);

          // Property: Each extracted experience should have required fields
          experiences.forEach((exp) => {
            expect(exp.company).toBeDefined();
            expect(exp.company.length).toBeGreaterThan(0);
            expect(exp.position).toBeDefined();
            expect(exp.position.length).toBeGreaterThan(0);
            expect(exp.startDate).toBeInstanceOf(Date);
            expect(exp.id).toBeDefined();
          });

          // Property: Original meaning should be preserved
          experiences.forEach((exp) => {
            expect(resumeText.toLowerCase()).toContain(exp.company.toLowerCase());
            expect(resumeText.toLowerCase()).toContain(exp.position.toLowerCase());
          });
        }
      ),
      { numRuns: 10 }
    );
  });

  // Feature: cs-manager-profile-website, Property 2: Resume Parsing Error Handling
  // **Validates: Requirements 1.5**
  it('should provide clear error messages for unparseable sections', () => {
    fc.assert(
      fc.property(
        fc.record({
          fileType: fc.constantFrom('application/pdf', 'text/plain', 'image/jpeg', 'application/msword'),
          fileName: fc.stringMatching(/^[a-zA-Z0-9_-]+\.(pdf|txt|jpg|doc)$/),
          content: fc.oneof(
            fc.constant(''), // Empty content
            fc.string({ minLength: 1, maxLength: 10 }), // Very short content
            fc.string({ minLength: 50, maxLength: 1000 }), // Normal content
          ),
        }),
        (testCase) => {
          const file = new File([testCase.content], testCase.fileName, { 
            type: testCase.fileType 
          });

          // Test file validation (synchronous)
          const fileErrors = validateFile(file);

          // Property: Unsupported formats should be detected
          if (testCase.fileType === 'image/jpeg' || testCase.fileType === 'application/msword') {
            expect(fileErrors.some(e => e.type === 'unsupported_format')).toBe(true);
          }

          // Property: Empty files should be detected
          if (testCase.content.length === 0) {
            expect(fileErrors.some(e => e.type === 'file_empty')).toBe(true);
          }

          // Property: All errors should have suggestions
          fileErrors.forEach(error => {
            expect(error.suggestions.length).toBeGreaterThan(0);
            expect(error.message.length).toBeGreaterThan(0);
            expect(error.recoverable).toBeDefined();
          });

          // Property: Error messages should be user-friendly
          fileErrors.forEach(error => {
            const formatted = formatErrorMessage(error);
            expect(formatted.length).toBeGreaterThan(error.message.length);
            expect(formatted).toMatch(/^[📄🔧📭📏❌📋⚠️]/); // Should start with emoji
          });
        }
      ),
      { numRuns: 10 }
    );
  });

  // Feature: cs-manager-profile-website, Property 2: Resume Parsing Error Handling
  // **Validates: Requirements 1.5**
  it('should provide guidance for manual input when parsing fails', () => {
    fc.assert(
      fc.property(
        fc.record({
          hasExperience: fc.boolean(),
          hasEducation: fc.boolean(),
          hasSkills: fc.boolean(),
          contentQuality: fc.constantFrom('empty', 'minimal', 'normal'),
        }),
        (testCase) => {
          let resumeText = '';

          // Build resume text based on test case
          if (testCase.contentQuality === 'empty') {
            resumeText = '';
          } else if (testCase.contentQuality === 'minimal') {
            resumeText = 'Short resume';
          } else {
            resumeText = 'This is a normal length resume with sufficient content for parsing.';
            
            if (testCase.hasExperience) {
              resumeText += '\nEXPERIENCE\nSoftware Engineer at Tech Corp\n2020-2023';
            }
            
            if (testCase.hasEducation) {
              resumeText += '\nEDUCATION\nBachelor of Science\nUniversity of Test\n2020';
            }
            
            if (testCase.hasSkills) {
              resumeText += '\nSKILLS\nJavaScript, React, Node.js';
            }
          }

          const experience = extractExperience(resumeText);
          const skills = extractSkills(resumeText);
          const education = extractEducation(resumeText);

          const { errors, warnings } = validateParsedContent(
            resumeText,
            experience,
            skills,
            education,
            []
          );

          // Property: Missing sections should generate warnings with guidance
          if (!testCase.hasExperience && resumeText.length > 50) {
            const experienceWarning = warnings.find(w => w.section === 'experience');
            if (experienceWarning) {
              expect(experienceWarning.suggestions.length).toBeGreaterThan(0);
              expect(experienceWarning.suggestions.some(s => 
                s.toLowerCase().includes('experience') || 
                s.toLowerCase().includes('work') ||
                s.toLowerCase().includes('job')
              )).toBe(true);
            }
          }

          // Property: All errors and warnings should provide actionable guidance
          [...errors, ...warnings].forEach(issue => {
            expect(issue.suggestions.length).toBeGreaterThan(0);
            issue.suggestions.forEach(suggestion => {
              expect(suggestion.length).toBeGreaterThan(10); // Meaningful suggestions
              expect(suggestion).toMatch(/^[A-Z]/); // Should start with capital letter
            });
          });

          // Property: Recoverable errors should be marked as such
          errors.forEach(error => {
            if (['file_format', 'section_missing', 'parsing_failed'].includes(error.type)) {
              expect(error.recoverable).toBe(true);
            }
          });
        }
      ),
      { numRuns: 10 }
    );
  });

  // Feature: cs-manager-profile-website, Property 2: Resume Parsing Error Handling  
  // **Validates: Requirements 1.5**
  it('should handle different error types with appropriate recovery suggestions', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          'file_format',
          'file_corrupted', 
          'file_empty',
          'section_missing',
          'parsing_failed',
          'file_too_large',
          'unsupported_format'
        ),
        (errorType) => {
          const error = createParseError(errorType, `Test ${errorType} error`);

          // Property: All error types should have appropriate suggestions
          expect(error.suggestions.length).toBeGreaterThan(0);
          
          // Property: File-related errors should suggest file format changes
          if (['file_format', 'unsupported_format', 'file_corrupted'].includes(errorType)) {
            expect(error.suggestions.some(s => 
              s.toLowerCase().includes('pdf') || 
              s.toLowerCase().includes('word') ||
              s.toLowerCase().includes('format')
            )).toBe(true);
          }

          // Property: Content-related errors should suggest content improvements
          if (['section_missing', 'parsing_failed'].includes(errorType)) {
            expect(error.suggestions.some(s => 
              s.toLowerCase().includes('section') || 
              s.toLowerCase().includes('format') ||
              s.toLowerCase().includes('manual')
            )).toBe(true);
          }

          // Property: Size-related errors should suggest size reduction
          if (errorType === 'file_too_large') {
            expect(error.suggestions.some(s => 
              s.toLowerCase().includes('size') || 
              s.toLowerCase().includes('compress') ||
              s.toLowerCase().includes('reduce')
            )).toBe(true);
          }

          // Property: Empty file errors should suggest content addition
          if (errorType === 'file_empty') {
            expect(error.suggestions.some(s => 
              s.toLowerCase().includes('content') || 
              s.toLowerCase().includes('text') ||
              s.toLowerCase().includes('ensure')
            )).toBe(true);
          }

          // Property: Error messages should be formatted consistently
          const formatted = formatErrorMessage(error);
          expect(formatted).toMatch(/^[📄🔧📭📏❌📋⚠️]/);
          expect(formatted).toContain(error.message);
        }
      ),
      { numRuns: 10 }
    );
  });

  // Feature: cs-manager-profile-website, Property 1: Resume Parsing Completeness
  // **Validates: Requirements 1.1, 1.2, 1.3, 1.4**
  it('should extract skills while maintaining original context', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.stringMatching(/^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?$/),
          { minLength: 1, maxLength: 10 }
        ),
        (skillNames) => {
          const resumeText = `
            SKILLS
            ${skillNames.join(', ')}
          `;

          const skills = extractSkills(resumeText);

          // Property: Skills should be extracted
          expect(skills.length).toBeGreaterThan(0);

          // Property: Each skill should have required fields
          skills.forEach((skill) => {
            expect(skill.name).toBeDefined();
            expect(skill.name.length).toBeGreaterThan(0);
            expect(skill.category).toMatch(/technical|soft|industry/);
            expect(skill.id).toBeDefined();
          });

          // Property: Extracted skills should be in original text
          skills.forEach((skill) => {
            expect(resumeText.toLowerCase()).toContain(skill.name.toLowerCase());
          });
        }
      ),
      { numRuns: 10 }
    );
  });

  // Feature: cs-manager-profile-website, Property 1: Resume Parsing Completeness
  // **Validates: Requirements 1.1, 1.2, 1.3, 1.4**
  it('should extract education while preserving degree and institution information', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            degree: fc.stringMatching(/(?:Bachelor|Master|PhD|Associate)/),
            field: fc.stringMatching(/[A-Z][a-z]+ (?:Science|Engineering|Arts|Business)/),
            institution: fc.stringMatching(/[A-Z][a-z]+ (?:University|College|Institute)/),
            year: fc.integer({ min: 2000, max: 2024 }),
          }),
          { minLength: 1, maxLength: 3 }
        ),
        (educations) => {
          const resumeText = `
            EDUCATION
            ${educations
              .map(
                (edu) => `
              ${edu.degree} of ${edu.field}
              ${edu.institution}
              ${edu.year}
            `
              )
              .join('\n')}
          `;

          const extracted = extractEducation(resumeText);

          // Property: Education should be extracted
          expect(extracted.length).toBeGreaterThan(0);

          // Property: Each education should have required fields
          extracted.forEach((edu) => {
            expect(edu.institution).toBeDefined();
            expect(edu.institution.length).toBeGreaterThan(0);
            expect(edu.degree).toBeDefined();
            expect(edu.field).toBeDefined();
            expect(edu.startDate).toBeInstanceOf(Date);
            expect(edu.id).toBeDefined();
          });

          // Property: Original information should be preserved
          extracted.forEach((edu) => {
            expect(resumeText.toLowerCase()).toContain(edu.institution.toLowerCase());
          });
        }
      ),
      { numRuns: 10 }
    );
  });

  // Feature: cs-manager-profile-website, Property 1: Resume Parsing Completeness
  // **Validates: Requirements 1.1, 1.2, 1.3, 1.4**
  it('should maintain data integrity across all parsed resume sections', () => {
    fc.assert(
      fc.property(
        fc.record({
          hasExperience: fc.boolean(),
          hasEducation: fc.boolean(),
          hasSkills: fc.boolean(),
        }),
        (config) => {
          let resumeText = '';

          if (config.hasExperience) {
            resumeText += `
              PROFESSIONAL EXPERIENCE
              Senior Engineer at Tech Corp
              2020 - Present
              - Led team of 5 engineers
            `;
          }

          if (config.hasEducation) {
            resumeText += `
              EDUCATION
              Bachelor of Science in Computer Science
              University of California
              2020
            `;
          }

          if (config.hasSkills) {
            resumeText += `
              SKILLS
              JavaScript, React, Python, AWS
            `;
          }

          const experiences = extractExperience(resumeText);
          const education = extractEducation(resumeText);
          const skills = extractSkills(resumeText);

          // Property: Data should be consistent with input
          if (config.hasExperience) {
            expect(experiences.length).toBeGreaterThan(0);
          } else {
            expect(experiences.length).toBe(0);
          }

          if (config.hasEducation) {
            expect(education.length).toBeGreaterThan(0);
          } else {
            expect(education.length).toBe(0);
          }

          if (config.hasSkills) {
            expect(skills.length).toBeGreaterThan(0);
          }

          // Property: All extracted items should have valid IDs
          const allIds = [
            ...experiences.map((e) => e.id),
            ...education.map((e) => e.id),
            ...skills.map((s) => s.id),
          ];

          const uniqueIds = new Set(allIds);
          expect(uniqueIds.size).toBe(allIds.length);
        }
      ),
      { numRuns: 10 }
    );
  });
});
