/**
 * Property-Based Tests for Resume Parser Error Handling
 * Task 3.2: Write property test for resume parsing
 * Property 2: Resume Parsing Error Handling
 * **Validates: Requirements 1.5**
 * @jest-environment node
 */

import { describe, it, expect } from '@jest/globals';
import * as fc from 'fast-check';
import { parseResumeDocument } from '../resume-parser';
import {
  createParseError,
  validateFile,
  validateParsedContent,
  formatErrorMessage,
  createParsingSummary,
} from '../error-handling';

// ============================================================================
// PROPERTY-BASED TESTS FOR ERROR HANDLING
// ============================================================================

describe('Resume Parser - Property 2: Resume Parsing Error Handling', () => {
  
  // **Validates: Requirements 1.5**
  it('should provide clear error messages for file validation issues', () => {
    fc.assert(
      fc.property(
        fc.record({
          fileType: fc.constantFrom(
            'application/pdf',
            'text/plain',
            'image/jpeg', // Unsupported
            'application/msword', // Unsupported
          ),
          fileName: fc.oneof(
            fc.stringMatching(/^[a-zA-Z0-9_-]+\.pdf$/),
            fc.stringMatching(/^[a-zA-Z0-9_-]+\.txt$/),
            fc.stringMatching(/^[a-zA-Z0-9_-]+\.jpg$/),
            fc.stringMatching(/^[a-zA-Z0-9_-]+\.doc$/),
          ),
          content: fc.oneof(
            fc.constant(''), // Empty content
            fc.string({ minLength: 1, maxLength: 100 }), // Normal content
            fc.constant('x'.repeat(11 * 1024 * 1024)) // Too large content (11MB)
          ),
        }),
        (testCase) => {
          const file = new File([testCase.content], testCase.fileName, { 
            type: testCase.fileType 
          });

          const fileErrors = validateFile(file);

          // Property: All errors should have required fields
          fileErrors.forEach(error => {
            expect(error.type).toBeDefined();
            expect(error.message).toBeDefined();
            expect(error.message.length).toBeGreaterThan(0);
            expect(error.suggestions).toBeDefined();
            expect(error.suggestions.length).toBeGreaterThan(0);
            expect(typeof error.recoverable).toBe('boolean');
          });

          // Property: All suggestions should be meaningful
          fileErrors.forEach(error => {
            error.suggestions.forEach(suggestion => {
              expect(suggestion.length).toBeGreaterThan(10);
              expect(suggestion).toMatch(/^[A-Z]/); // Should start with capital letter
            });
          });

          // Property: Unsupported formats should be detected
          const supportedTypes = ['application/pdf', 'text/plain'];
          const supportedExtensions = ['.pdf', '.txt'];
          const fileName = testCase.fileName.toLowerCase();
          const hasValidType = supportedTypes.includes(testCase.fileType);
          const hasValidExtension = supportedExtensions.some(ext => fileName.endsWith(ext));
          
          if (!hasValidType && !hasValidExtension) {
            expect(fileErrors.some(e => e.type === 'unsupported_format')).toBe(true);
          }

          // Property: Empty files should be detected
          if (testCase.content.length === 0) {
            expect(fileErrors.some(e => e.type === 'file_empty')).toBe(true);
          }

          // Property: Large files should be detected
          if (testCase.content.length > 10 * 1024 * 1024) {
            expect(fileErrors.some(e => e.type === 'file_too_large')).toBe(true);
          }
        }
      ),
      { numRuns: 3 }
    );
  });

  // **Validates: Requirements 1.5**
  it('should provide guidance for missing content sections', () => {
    fc.assert(
      fc.property(
        fc.record({
          hasExperience: fc.boolean(),
          hasEducation: fc.boolean(),
          hasSkills: fc.boolean(),
          contentLength: fc.integer({ min: 50, max: 1000 }),
        }),
        (config) => {
          let resumeText = 'This is a resume with content. ';
          resumeText += 'x'.repeat(config.contentLength);

          if (config.hasExperience) {
            resumeText += '\nEXPERIENCE\nSoftware Engineer at Tech Corp\n2020-2023';
          }
          
          if (config.hasEducation) {
            resumeText += '\nEDUCATION\nBachelor of Science\nUniversity\n2020';
          }
          
          if (config.hasSkills) {
            resumeText += '\nSKILLS\nJavaScript, React, Python';
          }

          const { errors, warnings } = validateParsedContent(
            resumeText,
            config.hasExperience ? [{}] : [], // Mock data
            config.hasSkills ? [{}] : [],
            config.hasEducation ? [{}] : [],
            []
          );

          // Property: All issues should have suggestions
          [...errors, ...warnings].forEach(issue => {
            expect(issue.suggestions).toBeDefined();
            expect(issue.suggestions.length).toBeGreaterThan(0);
            issue.suggestions.forEach(suggestion => {
              expect(suggestion.length).toBeGreaterThan(5);
            });
          });

          // Property: Missing sections should generate warnings
          if (!config.hasExperience) {
            expect(warnings.some(w => w.section === 'experience')).toBe(true);
          }
          if (!config.hasEducation) {
            expect(warnings.some(w => w.section === 'education')).toBe(true);
          }
          if (!config.hasSkills) {
            expect(warnings.some(w => w.section === 'skills')).toBe(true);
          }
        }
      ),
      { numRuns: 3 }
    );
  });

  // **Validates: Requirements 1.5**
  it('should handle different error types with appropriate suggestions', () => {
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

          // Property: All error types should have suggestions
          expect(error.suggestions.length).toBeGreaterThan(0);
          
          // Property: All suggestions should be meaningful
          error.suggestions.forEach(suggestion => {
            expect(suggestion.length).toBeGreaterThan(10);
            expect(suggestion).toMatch(/^[A-Z]/);
          });

          // Property: Error should have correct structure
          expect(error.type).toBe(errorType);
          expect(error.message).toBeDefined();
          expect(typeof error.recoverable).toBe('boolean');
        }
      ),
      { numRuns: 3 }
    );
  });

  // **Validates: Requirements 1.5**
  it('should format error messages consistently', () => {
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
        fc.string({ minLength: 5, maxLength: 100 }),
        (errorType, message) => {
          const error = createParseError(errorType, message);
          const formatted = formatErrorMessage(error);

          // Property: Formatted messages should be enhanced
          expect(formatted.length).toBeGreaterThan(message.length);
          expect(formatted).toContain(message);
          expect(formatted).toMatch(/^[📄🔧📭📏❌📋⚠️]/); // Should start with emoji
        }
      ),
      { numRuns: 3 }
    );
  });

  // **Validates: Requirements 1.5**
  it('should create comprehensive parsing summaries', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            section: fc.constantFrom('experience', 'skills', 'education', 'achievements', 'personal_info'),
            success: fc.boolean(),
            data: fc.array(fc.anything(), { minLength: 0, maxLength: 3 }),
            errors: fc.array(
              fc.record({
                type: fc.constantFrom('parsing_failed', 'section_missing'),
                message: fc.string({ minLength: 10, maxLength: 50 }),
                section: fc.option(fc.string(), { nil: undefined }),
                suggestions: fc.array(fc.string({ minLength: 10, maxLength: 50 }), { minLength: 1, maxLength: 2 }),
                recoverable: fc.boolean(),
                details: fc.option(fc.dictionary(fc.string(), fc.anything()), { nil: undefined }),
              }),
              { minLength: 0, maxLength: 1 }
            ),
            warnings: fc.array(
              fc.record({
                type: fc.constantFrom('parsing_failed', 'section_missing'),
                message: fc.string({ minLength: 10, maxLength: 50 }),
                section: fc.option(fc.string(), { nil: undefined }),
                suggestions: fc.array(fc.string({ minLength: 10, maxLength: 50 }), { minLength: 1, maxLength: 2 }),
                recoverable: fc.boolean(),
                details: fc.option(fc.dictionary(fc.string(), fc.anything()), { nil: undefined }),
              }),
              { minLength: 0, maxLength: 1 }
            ),
            confidence: fc.float({ min: 0, max: 1, noNaN: true }),
          }),
          { minLength: 1, maxLength: 3 }
        ),
        (sectionResults) => {
          const summary = createParsingSummary(sectionResults, [], []);

          // Property: Summary should have valid structure
          expect(Array.isArray(summary.successfulSections)).toBe(true);
          expect(Array.isArray(summary.failedSections)).toBe(true);
          expect(Array.isArray(summary.recommendations)).toBe(true);
          expect(typeof summary.totalErrors).toBe('number');
          expect(typeof summary.totalWarnings).toBe('number');
          expect(typeof summary.overallSuccess).toBe('boolean');

          // Property: Counts should be non-negative
          expect(summary.totalErrors).toBeGreaterThanOrEqual(0);
          expect(summary.totalWarnings).toBeGreaterThanOrEqual(0);

          // Property: Recommendations should be meaningful when present
          summary.recommendations.forEach(recommendation => {
            expect(recommendation.length).toBeGreaterThan(10);
            expect(recommendation).toMatch(/^[A-Z]/);
          });
        }
      ),
      { numRuns: 3 }
    );
  });

  // **Validates: Requirements 1.5**
  it('should handle file parsing errors gracefully', async () => {
    fc.assert(
      fc.asyncProperty(
        fc.record({
          fileType: fc.constantFrom('application/pdf', 'text/plain'),
          content: fc.oneof(
            fc.constant(''), // Empty
            fc.string({ minLength: 50, maxLength: 200 }) // Valid content
          ),
          fileName: fc.oneof(
            fc.stringMatching(/^[a-zA-Z0-9_-]+\.pdf$/),
            fc.stringMatching(/^[a-zA-Z0-9_-]+\.txt$/)
          ),
        }),
        async (testCase) => {
          const file = new File([testCase.content], testCase.fileName, { 
            type: testCase.fileType 
          });

          const result = await parseResumeDocument(file);

          // Property: Should always return a result structure
          expect(result).toHaveProperty('success');
          expect(result).toHaveProperty('errors');
          expect(result).toHaveProperty('warnings');
          expect(Array.isArray(result.errors)).toBe(true);
          expect(Array.isArray(result.warnings)).toBe(true);

          // Property: All errors should have proper structure
          result.errors.forEach(error => {
            expect(error.type).toBeDefined();
            expect(error.message).toBeDefined();
            expect(error.suggestions).toBeDefined();
            expect(error.suggestions.length).toBeGreaterThan(0);
            expect(typeof error.recoverable).toBe('boolean');
          });

          // Property: Empty files should be detected
          if (testCase.content.length === 0) {
            expect(result.success).toBe(false);
            expect(result.errors.some(e => e.type === 'file_empty')).toBe(true);
          }
        }
      ),
      { numRuns: 3 }
    );
  });
});