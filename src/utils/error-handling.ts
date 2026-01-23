/**
 * Error Handling Utilities for Resume Parser
 * Provides comprehensive error handling, user feedback, and recovery suggestions
 */

import type { ParseError, ParseResult, SectionParseResult } from '../types';

/**
 * Creates a standardized parse error with user-friendly messages and suggestions
 */
export function createParseError(
  type: ParseError['type'],
  message: string,
  section?: string,
  suggestions: string[] = [],
  details?: Record<string, any>
): ParseError {
  const baseError: ParseError = {
    type,
    message,
    section,
    suggestions: suggestions.length > 0 ? suggestions : getDefaultSuggestions(type, section),
    recoverable: isRecoverable(type),
    details,
  };

  return baseError;
}

/**
 * Gets default suggestions based on error type and section
 */
function getDefaultSuggestions(type: ParseError['type'], section?: string): string[] {
  const suggestions: Record<string, string[]> = {
    file_format: [
      'Convert your resume to PDF, Word (.docx), or plain text format',
      'Ensure the file is not password protected',
      'Try saving your document in a different format',
      'Use "Save As" instead of "Export" when creating the file',
    ],
    file_corrupted: [
      'Try re-saving your resume file',
      'Check if the file opens correctly in its native application',
      'Create a new copy of your resume',
      'Try uploading a different version of your resume',
    ],
    file_empty: [
      'Ensure your resume file contains text content',
      'Check that the file is not just images or graphics',
      'Try copying and pasting your resume content into a new document',
      'Verify the file size is greater than 0 bytes',
    ],
    file_too_large: [
      'Reduce the file size by compressing images',
      'Remove unnecessary graphics or formatting',
      'Save as a simpler format like plain text or basic PDF',
      'Split your resume into multiple smaller files if needed',
    ],
    unsupported_format: [
      'Convert your resume to PDF (.pdf), Word (.docx), or plain text (.txt)',
      'Avoid using proprietary formats or older Word versions (.doc)',
      'Copy and paste your content into a supported format',
      'Use online converters to change the file format',
    ],
    section_missing: getSectionMissingSuggestions(section),
    parsing_failed: [
      'Try reformatting your resume with clearer section headers',
      'Use standard section names like "Experience", "Education", "Skills"',
      'Ensure consistent formatting throughout your resume',
      'Consider manually entering the information if parsing continues to fail',
    ],
  };

  return suggestions[type] || ['Please try again or contact support for assistance'];
}

/**
 * Gets specific suggestions for missing sections
 */
function getSectionMissingSuggestions(section?: string): string[] {
  const sectionSuggestions: Record<string, string[]> = {
    experience: [
      'Add a section titled "Experience", "Work History", or "Professional Experience"',
      'Include your job titles, company names, and employment dates',
      'List your responsibilities and achievements for each role',
      'Use bullet points to organize your experience clearly',
    ],
    education: [
      'Add an "Education" section with your degrees and institutions',
      'Include graduation dates and any relevant coursework',
      'List certifications and professional development',
      'Mention your GPA if it\'s 3.5 or higher',
    ],
    skills: [
      'Create a "Skills" section listing your technical and soft skills',
      'Group skills by category (e.g., Programming Languages, Tools, etc.)',
      'Use comma-separated lists or bullet points',
      'Include both technical skills and soft skills relevant to your field',
    ],
    achievements: [
      'Add sections for "Awards", "Recognition", or "Achievements"',
      'Include dates and issuing organizations',
      'Describe the significance of each achievement',
      'Quantify your accomplishments with specific metrics when possible',
    ],
    personal_info: [
      'Ensure your name is prominently displayed at the top',
      'Include contact information: email, phone, location',
      'Add your LinkedIn profile URL',
      'Include a professional summary or objective statement',
    ],
  };

  return sectionSuggestions[section || ''] || [
    'Review your resume structure and ensure all sections are clearly labeled',
    'Use standard section headers that are commonly recognized',
    'Consider manually entering this information if the section cannot be detected',
  ];
}

/**
 * Determines if an error type is recoverable through user action
 */
function isRecoverable(type: ParseError['type']): boolean {
  const recoverableTypes: ParseError['type'][] = [
    'file_format',
    'section_missing',
    'parsing_failed',
    'file_too_large',
    'unsupported_format',
  ];

  return recoverableTypes.includes(type);
}

/**
 * Creates a successful parse result
 */
export function createSuccessResult<T>(data: T, warnings: ParseError[] = []): ParseResult<T> {
  return {
    success: true,
    data,
    errors: [],
    warnings,
  };
}

/**
 * Creates a failed parse result
 */
export function createFailureResult<T>(errors: ParseError[], warnings: ParseError[] = []): ParseResult<T> {
  return {
    success: false,
    errors,
    warnings,
  };
}

/**
 * Creates a section parse result
 */
export function createSectionResult(
  section: SectionParseResult['section'],
  success: boolean,
  data: any[],
  errors: ParseError[] = [],
  warnings: ParseError[] = [],
  confidence: number = 0
): SectionParseResult {
  return {
    section,
    success,
    data,
    errors,
    warnings,
    confidence,
  };
}

/**
 * Validates file before parsing
 */
export function validateFile(file: File): ParseError[] {
  const errors: ParseError[] = [];
  const maxSize = 10 * 1024 * 1024; // 10MB
  const supportedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ];
  const supportedExtensions = ['.pdf', '.docx', '.txt'];

  // Check file size
  if (file.size === 0) {
    errors.push(createParseError(
      'file_empty',
      'The uploaded file appears to be empty',
      undefined,
      undefined,
      { fileSize: file.size }
    ));
  } else if (file.size > maxSize) {
    errors.push(createParseError(
      'file_too_large',
      `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds the maximum limit of 10MB`,
      undefined,
      undefined,
      { fileSize: file.size, maxSize }
    ));
  }

  // Check file type
  const fileName = file.name.toLowerCase();
  const hasValidType = supportedTypes.includes(file.type);
  const hasValidExtension = supportedExtensions.some(ext => fileName.endsWith(ext));

  if (!hasValidType && !hasValidExtension) {
    errors.push(createParseError(
      'unsupported_format',
      `File format "${file.type || 'unknown'}" is not supported`,
      undefined,
      undefined,
      { fileType: file.type, fileName: file.name }
    ));
  }

  return errors;
}

/**
 * Validates parsed content for completeness
 */
export function validateParsedContent(
  rawText: string,
  experience: any[],
  skills: any[],
  education: any[],
  achievements: any[]
): { errors: ParseError[]; warnings: ParseError[] } {
  const errors: ParseError[] = [];
  const warnings: ParseError[] = [];

  // Check if raw text is meaningful
  if (rawText.trim().length < 50) {
    errors.push(createParseError(
      'file_empty',
      'The document contains very little readable text',
      undefined,
      [
        'Ensure your resume contains substantial text content',
        'Check if the document is mostly images or graphics',
        'Try converting to a text-based format',
      ],
      { textLength: rawText.length }
    ));
  }

  // Check for missing critical sections
  if (experience.length === 0) {
    const hasExperienceKeywords = /(?:experience|work|employment|career|job|position)/i.test(rawText);
    if (hasExperienceKeywords) {
      warnings.push(createParseError(
        'parsing_failed',
        'Experience section detected but could not be parsed properly',
        'experience',
        [
          'Try using clearer formatting for your work experience',
          'Include company names, job titles, and dates',
          'Use consistent formatting for each job entry',
        ]
      ));
    } else {
      warnings.push(createParseError(
        'section_missing',
        'No work experience section found in your resume',
        'experience'
      ));
    }
  }

  if (education.length === 0) {
    const hasEducationKeywords = /(?:education|degree|university|college|school)/i.test(rawText);
    if (hasEducationKeywords) {
      warnings.push(createParseError(
        'parsing_failed',
        'Education section detected but could not be parsed properly',
        'education'
      ));
    } else {
      warnings.push(createParseError(
        'section_missing',
        'No education section found in your resume',
        'education'
      ));
    }
  }

  if (skills.length === 0) {
    const hasSkillsKeywords = /(?:skills|competencies|expertise|proficiencies|technologies)/i.test(rawText);
    if (hasSkillsKeywords) {
      warnings.push(createParseError(
        'parsing_failed',
        'Skills section detected but could not be parsed properly',
        'skills'
      ));
    } else {
      warnings.push(createParseError(
        'section_missing',
        'No skills section found in your resume',
        'skills'
      ));
    }
  }

  return { errors, warnings };
}

/**
 * Generates user-friendly error messages for display
 */
export function formatErrorMessage(error: ParseError): string {
  const typeMessages: Record<ParseError['type'], string> = {
    file_format: '📄 File Format Issue',
    file_corrupted: '🔧 File Corruption Detected',
    file_empty: '📭 Empty File',
    file_too_large: '📏 File Too Large',
    unsupported_format: '❌ Unsupported Format',
    section_missing: '📋 Missing Section',
    parsing_failed: '⚠️ Parsing Error',
  };

  const prefix = typeMessages[error.type] || '❗ Error';
  return `${prefix}: ${error.message}`;
}

/**
 * Generates user-friendly warning messages for display
 */
export function formatWarningMessage(warning: ParseError): string {
  return `⚠️ Warning: ${warning.message}`;
}

/**
 * Creates a summary of parsing results for user feedback
 */
export function createParsingSummary(
  sectionResults: SectionParseResult[],
  overallErrors: ParseError[],
  overallWarnings: ParseError[]
): {
  successfulSections: string[];
  failedSections: string[];
  totalErrors: number;
  totalWarnings: number;
  overallSuccess: boolean;
  recommendations: string[];
} {
  const successfulSections = sectionResults
    .filter(result => result.success && result.data.length > 0)
    .map(result => result.section);

  const failedSections = sectionResults
    .filter(result => !result.success || result.data.length === 0)
    .map(result => result.section);

  const totalErrors = overallErrors.length + sectionResults.reduce((sum, result) => sum + result.errors.length, 0);
  const totalWarnings = overallWarnings.length + sectionResults.reduce((sum, result) => sum + result.warnings.length, 0);

  const overallSuccess = totalErrors === 0 && successfulSections.length > 0;

  // Generate recommendations based on results
  const recommendations: string[] = [];
  
  if (failedSections.length > 0) {
    recommendations.push(`Consider manually entering information for: ${failedSections.join(', ')}`);
  }
  
  if (totalWarnings > 0) {
    recommendations.push('Review the warnings below to improve parsing accuracy');
  }
  
  if (successfulSections.length > 0) {
    recommendations.push(`Successfully parsed: ${successfulSections.join(', ')}`);
  }

  if (totalErrors > 0) {
    recommendations.push('Please address the errors below before proceeding');
  }

  return {
    successfulSections,
    failedSections,
    totalErrors,
    totalWarnings,
    overallSuccess,
    recommendations,
  };
}

/**
 * Error recovery suggestions based on common issues
 */
export const ERROR_RECOVERY_GUIDE = {
  fileFormat: {
    title: 'File Format Issues',
    description: 'Your resume file format is not supported or may be corrupted.',
    steps: [
      'Save your resume as a PDF, Word (.docx), or plain text (.txt) file',
      'Ensure the file is not password protected',
      'Try opening the file in its native application to verify it works',
      'If using an older Word format (.doc), save as .docx instead',
    ],
  },
  missingContent: {
    title: 'Missing or Incomplete Content',
    description: 'Some sections of your resume could not be found or parsed.',
    steps: [
      'Use clear section headers like "Experience", "Education", "Skills"',
      'Ensure each section has substantial content',
      'Use consistent formatting throughout your resume',
      'Consider manually entering missing information',
    ],
  },
  parsingErrors: {
    title: 'Parsing Difficulties',
    description: 'The system had trouble understanding parts of your resume.',
    steps: [
      'Simplify your resume formatting',
      'Use bullet points for lists',
      'Include dates in a consistent format (e.g., "2020-2023")',
      'Avoid complex tables or unusual layouts',
    ],
  },
  manualEntry: {
    title: 'Manual Data Entry',
    description: 'When automatic parsing fails, you can enter information manually.',
    steps: [
      'Use the manual entry forms below',
      'Copy information directly from your resume',
      'You can always upload a new resume file later',
      'Manual entries can be edited and updated anytime',
    ],
  },
} as const;