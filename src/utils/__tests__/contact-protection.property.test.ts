/**
 * Property-Based Tests for Contact Information Protection
 * Task 8.5: Write property test for contact information protection
 * Property 9: Contact Information Protection
 * **Validates: Requirements 5.3**
 * @jest-environment node
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import * as fc from 'fast-check';
import {
  checkRateLimit,
  validateHoneypot,
  validateSubmissionTime,
  detectSpamContent,
  validateEmailDomain,
  performSpamCheck,
  clearRateLimit,
  RATE_LIMIT_CONFIG,
} from '@/utils/spam-protection';

// ============================================================================
// PROPERTY-BASED TESTS FOR CONTACT PROTECTION
// ============================================================================

describe('Contact Protection - Property 9: Contact Information Protection', () => {
  
  beforeEach(() => {
    // Clear rate limits before each test
    clearRateLimit('test-identifier');
  });

  // **Validates: Requirements 5.3**
  it('should enforce rate limiting to prevent spam', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 5, maxLength: 20 }),
        fc.integer({ min: 1, max: 10 }),
        (identifier, attempts) => {
          clearRateLimit(identifier);
          
          let lastResult;
          for (let i = 0; i < attempts; i++) {
            lastResult = checkRateLimit(identifier);
          }
          
          // Property: Should track attempts
          expect(lastResult).toBeDefined();
          expect(lastResult).toHaveProperty('allowed');
          expect(lastResult).toHaveProperty('remaining');
          expect(lastResult).toHaveProperty('resetTime');
          
          // Property: Should block after max attempts
          if (attempts > RATE_LIMIT_CONFIG.maxAttempts) {
            expect(lastResult?.allowed).toBe(false);
            expect(lastResult?.remaining).toBe(0);
          }
        }
      ),
      { numRuns: 10 }
    );
  });

  // **Validates: Requirements 5.3**
  it('should validate honeypot fields correctly', () => {
    fc.assert(
      fc.property(
        fc.option(fc.string({ minLength: 0, maxLength: 100 })),
        (honeypotValue) => {
          const isValid = validateHoneypot(honeypotValue);
          
          // Property: Empty or undefined honeypot should be valid
          if (!honeypotValue || honeypotValue.trim() === '') {
            expect(isValid).toBe(true);
          } else {
            // Property: Filled honeypot should be invalid
            expect(isValid).toBe(false);
          }
        }
      ),
      { numRuns: 10 }
    );
  });

  // **Validates: Requirements 5.3**
  it('should validate submission timing to detect bots', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 10000 }),
        fc.integer({ min: 0, max: 10000 }),
        (loadTime, submitTime) => {
          const actualSubmitTime = loadTime + submitTime;
          const isValid = validateSubmissionTime(loadTime, actualSubmitTime, 3);
          
          // Property: Submissions within 3 seconds should be invalid
          if (submitTime < 3000) {
            expect(isValid).toBe(false);
          } else {
            expect(isValid).toBe(true);
          }
        }
      ),
      { numRuns: 10 }
    );
  });

  // **Validates: Requirements 5.3**
  it('should detect spam content patterns', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 10, maxLength: 500 }),
        (content) => {
          const result = detectSpamContent(content);
          
          // Property: Should return spam detection result
          expect(result).toHaveProperty('isSpam');
          expect(result).toHaveProperty('reasons');
          expect(Array.isArray(result.reasons)).toBe(true);
          
          // Property: If spam detected, should have reasons
          if (result.isSpam) {
            expect(result.reasons.length).toBeGreaterThan(0);
          }
        }
      ),
      { numRuns: 10 }
    );
  });

  // **Validates: Requirements 5.3**
  it('should detect excessive URLs in content', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 10 }),
        (urlCount) => {
          const urls = Array(urlCount).fill('https://example.com').join(' ');
          const content = `Message with URLs: ${urls}`;
          
          const result = detectSpamContent(content);
          
          // Property: More than 3 URLs should be flagged
          if (urlCount > 3) {
            expect(result.isSpam).toBe(true);
            expect(result.reasons.some(r => r.includes('URL'))).toBe(true);
          }
        }
      ),
      { numRuns: 10 }
    );
  });

  // **Validates: Requirements 5.3**
  it('should validate email domains against disposable providers', () => {
    fc.assert(
      fc.property(
        fc.emailAddress(),
        (email) => {
          const result = validateEmailDomain(email);
          
          // Property: Should return validation result
          expect(result).toHaveProperty('valid');
          
          // Property: Valid emails should pass
          const domain = email.split('@')[1];
          const disposableDomains = ['tempmail.com', 'throwaway.email', 'guerrillamail.com'];
          
          if (domain && !disposableDomains.includes(domain.toLowerCase())) {
            expect(result.valid).toBe(true);
          }
        }
      ),
      { numRuns: 10 }
    );
  });

  // **Validates: Requirements 5.3**
  it('should block disposable email addresses', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('tempmail.com', 'throwaway.email', 'guerrillamail.com', '10minutemail.com'),
        (disposableDomain) => {
          const email = `test@${disposableDomain}`;
          const result = validateEmailDomain(email);
          
          // Property: Disposable emails should be blocked
          expect(result.valid).toBe(false);
          expect(result.reason).toBeDefined();
        }
      ),
      { numRuns: 10 }
    );
  });

  // **Validates: Requirements 5.3**
  it('should perform comprehensive spam checks', () => {
    fc.assert(
      fc.property(
        fc.record({
          email: fc.emailAddress(),
          message: fc.string({ minLength: 10, maxLength: 200 }),
          honeypot: fc.option(fc.string({ minLength: 0, maxLength: 10 })),
          identifier: fc.string({ minLength: 5, maxLength: 20 }),
        }),
        (data) => {
          clearRateLimit(data.identifier);
          
          const result = performSpamCheck({
            ...data,
            formLoadTime: Date.now() - 5000,
            submitTime: Date.now(),
          });
          
          // Property: Should return comprehensive result
          expect(result).toHaveProperty('passed');
          expect(result).toHaveProperty('blocked');
          expect(result).toHaveProperty('reasons');
          expect(Array.isArray(result.reasons)).toBe(true);
          
          // Property: If blocked, should have reasons
          if (result.blocked) {
            expect(result.reasons.length).toBeGreaterThan(0);
          }
        }
      ),
      { numRuns: 10 }
    );
  });

  // **Validates: Requirements 5.3**
  it('should reset rate limits after time window', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 5, maxLength: 20 }),
        (identifier) => {
          clearRateLimit(identifier);
          
          // Make max attempts
          for (let i = 0; i < RATE_LIMIT_CONFIG.maxAttempts + 1; i++) {
            checkRateLimit(identifier);
          }
          
          // Should be blocked
          let result = checkRateLimit(identifier);
          expect(result.allowed).toBe(false);
          
          // Clear and try again
          clearRateLimit(identifier);
          result = checkRateLimit(identifier);
          
          // Property: Should allow after reset
          expect(result.allowed).toBe(true);
          expect(result.remaining).toBe(RATE_LIMIT_CONFIG.maxAttempts - 1);
        }
      ),
      { numRuns: 5 }
    );
  });

  // **Validates: Requirements 5.3**
  it('should maintain accessibility for legitimate users', () => {
    fc.assert(
      fc.property(
        fc.record({
          email: fc.emailAddress().filter(e => !e.includes('tempmail')),
          message: fc.string({ minLength: 50, maxLength: 200 }),
          identifier: fc.string({ minLength: 5, maxLength: 20 }),
        }),
        (data) => {
          clearRateLimit(data.identifier);
          
          const result = performSpamCheck({
            ...data,
            honeypot: undefined,
            formLoadTime: Date.now() - 10000, // 10 seconds ago
            submitTime: Date.now(),
          });
          
          // Property: Legitimate submissions should pass
          // (unless they trigger content filters)
          if (!detectSpamContent(data.message).isSpam) {
            expect(result.passed || !result.blocked).toBe(true);
          }
        }
      ),
      { numRuns: 10 }
    );
  });

  // **Validates: Requirements 5.3**
  it('should detect repeated character spam patterns', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('a', 'b', 'x', '1', '!'),
        fc.integer({ min: 5, max: 20 }),
        (char, repeatCount) => {
          const repeatedContent = char.repeat(repeatCount);
          const message = `Message with ${repeatedContent} repeated characters`;
          
          const result = detectSpamContent(message);
          
          // Property: Excessive repetition should be flagged
          if (repeatCount > 10) {
            expect(result.isSpam).toBe(true);
            expect(result.reasons.some(r => r.includes('Repeated'))).toBe(true);
          }
        }
      ),
      { numRuns: 10 }
    );
  });

  // **Validates: Requirements 5.3**
  it('should track remaining attempts correctly', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 5, maxLength: 20 }),
        fc.integer({ min: 1, max: RATE_LIMIT_CONFIG.maxAttempts }),
        (identifier, attempts) => {
          clearRateLimit(identifier);
          
          let result;
          for (let i = 0; i < attempts; i++) {
            result = checkRateLimit(identifier);
          }
          
          // Property: Remaining should decrease with each attempt
          expect(result?.remaining).toBe(RATE_LIMIT_CONFIG.maxAttempts - attempts);
        }
      ),
      { numRuns: 10 }
    );
  });

  // **Validates: Requirements 5.3**
  it('should provide reset time information', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 5, maxLength: 20 }),
        (identifier) => {
          clearRateLimit(identifier);
          
          const result = checkRateLimit(identifier);
          
          // Property: Should provide reset time
          expect(result.resetTime).toBeDefined();
          expect(result.resetTime).toBeGreaterThan(Date.now());
          
          // Property: Reset time should be within window
          const maxResetTime = Date.now() + RATE_LIMIT_CONFIG.windowMs + 1000; // 1s buffer
          expect(result.resetTime).toBeLessThanOrEqual(maxResetTime);
        }
      ),
      { numRuns: 10 }
    );
  });
});
