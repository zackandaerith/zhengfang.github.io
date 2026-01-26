// Utility functions for the Customer Success Manager Portfolio

// Re-export browser-safe utilities
export * from './common';

// Re-export validation utilities
export * from './validation';

// Re-export resume parser utilities
export * from './resume-parser';

// Note: content-manager is NOT exported here to avoid bundling 'fs' in client components.
// Use import { ... } from '@/utils/content-manager' in server components/actions.

/**
 * Creates a delay/sleep function
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Removes undefined values from an object
 */
export function removeUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: Partial<T> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key as keyof T] = value;
    }
  }
  return result;
}
