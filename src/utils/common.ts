// Browser-safe utility functions for the Customer Success Manager Portfolio

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  safeValidateData,
  getValidationErrors,
  formatValidationErrors,
} from '../types/validation';
import type { z } from 'zod';

/**
 * Combines class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date to a readable string
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return dateObj.toLocaleDateString('en-US', { ...defaultOptions, ...options });
}

/**
 * Formats a date range
 */
export function formatDateRange(startDate: Date | string, endDate?: Date | string): string {
  const start = formatDate(startDate, { year: 'numeric', month: 'short' });

  if (!endDate) {
    return `${start} - Present`;
  }

  const end = formatDate(endDate, { year: 'numeric', month: 'short' });
  return `${start} - ${end}`;
}

/**
 * Calculates duration between two dates
 */
export function calculateDuration(startDate: Date | string, endDate?: Date | string): string {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = endDate ? (typeof endDate === 'string' ? new Date(endDate) : endDate) : new Date();

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const years = Math.floor(diffDays / 365);
  const months = Math.floor((diffDays % 365) / 30);

  if (years > 0 && months > 0) {
    return `${years} year${years > 1 ? 's' : ''}, ${months} month${months > 1 ? 's' : ''}`;
  } else if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''}`;
  } else if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''}`;
  } else {
    return 'Less than a month';
  }
}

/**
 * Formats numbers with appropriate suffixes (K, M, B)
 */
export function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Formats currency values
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats percentage values
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Slugifies a string for URLs
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Truncates text to a specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates phone number format
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

/**
 * Generates a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Debounces a function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: any;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttles a function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Capitalizes the first letter of a string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Converts camelCase to Title Case
 */
export function camelToTitle(str: string): string {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

/**
 * Safely parses JSON
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/**
 * Checks if code is running on client side
 */
export function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Checks if code is running on server side
 */
export function isServer(): boolean {
  return typeof window === 'undefined';
}

/**
 * Gets the current environment
 */
export function getEnvironment(): 'development' | 'production' | 'test' {
  return (process.env.NODE_ENV as any) || 'development';
}

/**
 * Checks if running in development mode
 */
export function isDevelopment(): boolean {
  return getEnvironment() === 'development';
}

/**
 * Checks if running in production mode
 */
export function isProduction(): boolean {
  return getEnvironment() === 'production';
}

/**
 * Content parsing result
 */
export interface ContentParseResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string[]>;
  warnings?: string[];
  rawContent?: string;
}

/**
 * Detects file format from extension
 */
export function detectFileFormat(filePath: string): 'json' | 'markdown' {
  const extension = filePath.split('.').pop()?.toLowerCase();
  if (extension === 'md' || extension === 'markdown') {
    return 'markdown';
  }
  return 'json';
}

/**
 * Parses JSON content
 */
export function parseJsonContent<T>(content: string): ContentParseResult<T> {
  try {
    const data = JSON.parse(content);
    return {
      success: true,
      data,
      rawContent: content,
    };
  } catch (error) {
    return {
      success: false,
      errors: {
        parse: [error instanceof Error ? error.message : 'Failed to parse JSON'],
      },
      rawContent: content,
    };
  }
}

/**
 * Parses Markdown content with YAML front matter
 */
export function parseMarkdownContent(content: string): ContentParseResult<{
  metadata: Record<string, any>;
  body: string;
}> {
  const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontMatterRegex);

  if (!match) {
    return {
      success: true,
      data: {
        metadata: {},
        body: content,
      },
      rawContent: content,
    };
  }

  try {
    const [, frontMatterStr, body] = match;
    const metadata: Record<string, any> = {};

    frontMatterStr.split('\n').forEach((line) => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > -1) {
        const key = line.substring(0, colonIndex).trim();
        let value = line.substring(colonIndex + 1).trim();

        // Try to parse as JSON for complex types (arrays, objects, numbers, booleans)
        try {
          metadata[key] = JSON.parse(value);
        } catch {
          // If JSON parse fails, check if it's a quoted string
          if (value.startsWith('"') && value.endsWith('"')) {
            metadata[key] = value.substring(1, value.length - 1);
          } else if (value.startsWith("'") && value.endsWith("'")) {
            metadata[key] = value.substring(1, value.length - 1);
          } else {
            // Keep as string
            metadata[key] = value;
          }
        }
      }
    });

    return {
      success: true,
      data: {
        metadata,
        body,
      },
      rawContent: content,
    };
  } catch (error) {
    return {
      success: false,
      errors: {
        parse: [error instanceof Error ? error.message : 'Failed to parse Markdown front matter'],
      },
      rawContent: content,
    };
  }
}

/**
 * Validates data against a Zod schema
 */
export function validateContent<T>(
  data: unknown,
  schema: z.ZodSchema<T>
): ContentParseResult<T> {
  const result = safeValidateData(schema, data);

  if (result) {
    return {
      success: true,
      data: result,
    };
  }

  const parseResult = schema.safeParse(data);
  if (!parseResult.success) {
    const validationErrors = getValidationErrors(parseResult.error);
    const errors = formatValidationErrors(validationErrors);
    return {
      success: false,
      errors,
    };
  }

  return {
    success: false,
    errors: { validation: ['Unknown validation error'] },
  };
}
