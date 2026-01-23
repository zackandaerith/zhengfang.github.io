// Validation utilities for the Customer Success Manager Portfolio
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
} from '../types/validation';
import type {
  PersonalInfo,
  Experience,
  CaseStudy,
  Metric,
  ContactFormData,
  UserProfile,
  ValidationResult,
} from '../types';

/**
 * Validates personal information data
 */
export function validatePersonalInfo(data: unknown): ValidationResult {
  const result = validateData(PersonalInfoSchema, data);
  return {
    isValid: result.success,
    errors: result.errors ? getValidationErrors(result.errors) : [],
    warnings: [],
  };
}

/**
 * Validates experience data
 */
export function validateExperience(data: unknown): ValidationResult {
  const result = validateData(ExperienceSchema, data);
  return {
    isValid: result.success,
    errors: result.errors ? getValidationErrors(result.errors) : [],
    warnings: [],
  };
}

/**
 * Validates case study data
 */
export function validateCaseStudy(data: unknown): ValidationResult {
  const result = validateData(CaseStudySchema, data);
  return {
    isValid: result.success,
    errors: result.errors ? getValidationErrors(result.errors) : [],
    warnings: [],
  };
}

/**
 * Validates metric data
 */
export function validateMetric(data: unknown): ValidationResult {
  const result = validateData(MetricSchema, data);
  return {
    isValid: result.success,
    errors: result.errors ? getValidationErrors(result.errors) : [],
    warnings: [],
  };
}

/**
 * Validates contact form data
 */
export function validateContactFormData(data: unknown): ValidationResult {
  const result = validateData(ContactFormDataSchema, data);
  return {
    isValid: result.success,
    errors: result.errors ? getValidationErrors(result.errors) : [],
    warnings: [],
  };
}

/**
 * Validates complete user profile data
 */
export function validateUserProfile(data: unknown): ValidationResult {
  const result = validateData(UserProfileSchema, data);
  return {
    isValid: result.success,
    errors: result.errors ? getValidationErrors(result.errors) : [],
    warnings: [],
  };
}

/**
 * Safely validates and returns typed data or null
 */
export function safeValidatePersonalInfo(data: unknown): PersonalInfo | null {
  return safeValidateData(PersonalInfoSchema, data);
}

export function safeValidateExperience(data: unknown): Experience | null {
  return safeValidateData(ExperienceSchema, data);
}

export function safeValidateCaseStudy(data: unknown): CaseStudy | null {
  return safeValidateData(CaseStudySchema, data);
}

export function safeValidateMetric(data: unknown): Metric | null {
  return safeValidateData(MetricSchema, data);
}

export function safeValidateContactFormData(data: unknown): ContactFormData | null {
  return safeValidateData(ContactFormDataSchema, data);
}

export function safeValidateUserProfile(data: unknown): UserProfile | null {
  return safeValidateData(UserProfileSchema, data);
}

/**
 * Batch validation for multiple items
 */
export function validateExperienceList(experiences: unknown[]): {
  valid: Experience[];
  invalid: { index: number; errors: Record<string, string[]> }[];
} {
  const valid: Experience[] = [];
  const invalid: { index: number; errors: Record<string, string[]> }[] = [];

  experiences.forEach((exp, index) => {
    const result = validateData(ExperienceSchema, exp);
    if (result.success && result.data) {
      valid.push(result.data);
    } else if (result.errors) {
      invalid.push({
        index,
        errors: formatValidationErrors(getValidationErrors(result.errors)),
      });
    }
  });

  return { valid, invalid };
}

export function validateCaseStudyList(caseStudies: unknown[]): {
  valid: CaseStudy[];
  invalid: { index: number; errors: Record<string, string[]> }[];
} {
  const valid: CaseStudy[] = [];
  const invalid: { index: number; errors: Record<string, string[]> }[] = [];

  caseStudies.forEach((cs, index) => {
    const result = validateData(CaseStudySchema, cs);
    if (result.success && result.data) {
      valid.push(result.data);
    } else if (result.errors) {
      invalid.push({
        index,
        errors: formatValidationErrors(getValidationErrors(result.errors)),
      });
    }
  });

  return { valid, invalid };
}

/**
 * Validation helpers for form processing
 */
export function getFieldErrors(validationResult: ValidationResult, field: string): string[] {
  if (!validationResult.errors) return [];
  
  const fieldErrors = validationResult.errors.find(error => error.field === field);
  return fieldErrors ? [fieldErrors.message] : [];
}

export function hasFieldError(validationResult: ValidationResult, field: string): boolean {
  return getFieldErrors(validationResult, field).length > 0;
}

export function getFirstFieldError(validationResult: ValidationResult, field: string): string | null {
  const errors = getFieldErrors(validationResult, field);
  return errors.length > 0 ? errors[0] : null;
}

/**
 * Type guards for runtime type checking
 */
export function isPersonalInfo(data: unknown): data is PersonalInfo {
  return safeValidatePersonalInfo(data) !== null;
}

export function isExperience(data: unknown): data is Experience {
  return safeValidateExperience(data) !== null;
}

export function isCaseStudy(data: unknown): data is CaseStudy {
  return safeValidateCaseStudy(data) !== null;
}

export function isMetric(data: unknown): data is Metric {
  return safeValidateMetric(data) !== null;
}

export function isContactFormData(data: unknown): data is ContactFormData {
  return safeValidateContactFormData(data) !== null;
}

export function isUserProfile(data: unknown): data is UserProfile {
  return safeValidateUserProfile(data) !== null;
}