/**
 * Content Management System Utilities
 * Handles loading, parsing, validating, and managing portfolio content
 * Supports both JSON and Markdown formats
 */

import { promises as fs } from 'fs';
import path from 'path';
import type {
  UserProfile,
  Experience,
  CaseStudy,
  Metric,
  PersonalInfo,
  Skill,
  Education,
  Certification,
  Achievement,
  Testimonial,
  ContactLink,
} from '../types';
import {
  UserProfileSchema,
  ExperienceSchema,
  CaseStudySchema,
  MetricSchema,
  PersonalInfoSchema,
  SkillSchema,
  EducationSchema,
  CertificationSchema,
  AchievementSchema,
  TestimonialSchema,
  ContactLinkSchema,
  safeValidateData,
  getValidationErrors,
  formatValidationErrors,
} from '../types/validation';
import type { z } from 'zod';

/**
 * Content file types
 */
export type ContentType = 'json' | 'markdown' | 'auto';

/**
 * Content file format
 */
export interface ContentFile {
  path: string;
  format: 'json' | 'markdown';
  content: string;
  lastModified: Date;
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
 * Content management options
 */
export interface ContentManagerOptions {
  contentDir?: string;
  backupDir?: string;
  encoding?: BufferEncoding;
  createBackups?: boolean;
}

/**
 * Detects file format from extension
 */
export function detectFileFormat(filePath: string): 'json' | 'markdown' {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.md' || ext === '.markdown') {
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
 * Supports YAML front matter for metadata
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

    // Simple YAML front matter parsing
    frontMatterStr.split('\n').forEach((line) => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > -1) {
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        
        // Try to parse as JSON for complex types
        try {
          metadata[key] = JSON.parse(value);
        } catch {
          // Keep as string if not valid JSON
          metadata[key] = value;
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

  // Get validation errors
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

/**
 * Loads and parses a content file
 */
export async function loadContentFile<T>(
  filePath: string,
  schema: z.ZodSchema<T>,
  options: ContentManagerOptions = {}
): Promise<ContentParseResult<T>> {
  const { encoding = 'utf-8' } = options;

  try {
    const content = await fs.readFile(filePath, encoding);
    const format = detectFileFormat(filePath);

    if (format === 'markdown') {
      const parseResult = parseMarkdownContent(content);
      if (!parseResult.success) {
        return parseResult as ContentParseResult<T>;
      }

      // Validate the metadata against the schema
      return validateContent(parseResult.data?.metadata, schema);
    } else {
      const parseResult = parseJsonContent<unknown>(content);
      if (!parseResult.success) {
        return parseResult as ContentParseResult<T>;
      }

      // Validate the parsed JSON against the schema
      return validateContent(parseResult.data, schema);
    }
  } catch (error) {
    return {
      success: false,
      errors: {
        file: [error instanceof Error ? error.message : 'Failed to read file'],
      },
    };
  }
}

/**
 * Saves content to a file
 */
export async function saveContentFile<T>(
  filePath: string,
  data: T,
  options: ContentManagerOptions = {}
): Promise<ContentParseResult<T>> {
  const { encoding = 'utf-8', createBackups = true, backupDir } = options;

  try {
    // Create backup if requested
    if (createBackups && backupDir) {
      try {
        const fileName = path.basename(filePath);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(backupDir, `${fileName}.${timestamp}.backup`);
        
        try {
          await fs.copyFile(filePath, backupPath);
        } catch {
          // File might not exist yet, which is fine
        }
      } catch (error) {
        console.warn('Failed to create backup:', error);
      }
    }

    const format = detectFileFormat(filePath);
    let content: string;

    if (format === 'markdown') {
      // For markdown, convert data to YAML front matter
      const metadata = data as Record<string, any>;
      const yamlLines = Object.entries(metadata).map(([key, value]) => {
        const jsonValue = typeof value === 'string' ? `"${value}"` : JSON.stringify(value);
        return `${key}: ${jsonValue}`;
      });

      content = `---\n${yamlLines.join('\n')}\n---\n`;
    } else {
      content = JSON.stringify(data, null, 2);
    }

    await fs.writeFile(filePath, content, encoding);

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      errors: {
        file: [error instanceof Error ? error.message : 'Failed to write file'],
      },
    };
  }
}

/**
 * Loads user profile from file
 */
export async function loadUserProfile(
  filePath: string,
  options: ContentManagerOptions = {}
): Promise<ContentParseResult<UserProfile>> {
  return loadContentFile(filePath, UserProfileSchema, options);
}

/**
 * Loads experience data from file
 */
export async function loadExperience(
  filePath: string,
  options: ContentManagerOptions = {}
): Promise<ContentParseResult<Experience>> {
  return loadContentFile(filePath, ExperienceSchema, options);
}

/**
 * Loads case study from file
 */
export async function loadCaseStudy(
  filePath: string,
  options: ContentManagerOptions = {}
): Promise<ContentParseResult<CaseStudy>> {
  return loadContentFile(filePath, CaseStudySchema, options);
}

/**
 * Loads metric from file
 */
export async function loadMetric(
  filePath: string,
  options: ContentManagerOptions = {}
): Promise<ContentParseResult<Metric>> {
  return loadContentFile(filePath, MetricSchema, options);
}

/**
 * Loads personal info from file
 */
export async function loadPersonalInfo(
  filePath: string,
  options: ContentManagerOptions = {}
): Promise<ContentParseResult<PersonalInfo>> {
  return loadContentFile(filePath, PersonalInfoSchema, options);
}

/**
 * Loads all content files from a directory
 */
export async function loadContentDirectory<T>(
  dirPath: string,
  schema: z.ZodSchema<T>,
  options: ContentManagerOptions = {}
): Promise<{
  success: boolean;
  items: Array<{ path: string; data: T }>;
  errors: Array<{ path: string; error: string }>;
}> {
  try {
    const files = await fs.readdir(dirPath);
    const items: Array<{ path: string; data: T }> = [];
    const errors: Array<{ path: string; error: string }> = [];

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = await fs.stat(filePath);

      if (stat.isFile() && (file.endsWith('.json') || file.endsWith('.md'))) {
        const result = await loadContentFile(filePath, schema, options);

        if (result.success && result.data) {
          items.push({ path: filePath, data: result.data });
        } else {
          errors.push({
            path: filePath,
            error: Object.values(result.errors || {}).flat().join(', '),
          });
        }
      }
    }

    return {
      success: errors.length === 0,
      items,
      errors,
    };
  } catch (error) {
    return {
      success: false,
      items: [],
      errors: [
        {
          path: dirPath,
          error: error instanceof Error ? error.message : 'Failed to read directory',
        },
      ],
    };
  }
}

/**
 * Saves user profile to file
 */
export async function saveUserProfile(
  filePath: string,
  profile: UserProfile,
  options: ContentManagerOptions = {}
): Promise<ContentParseResult<UserProfile>> {
  return saveContentFile(filePath, profile, options);
}

/**
 * Saves experience to file
 */
export async function saveExperience(
  filePath: string,
  experience: Experience,
  options: ContentManagerOptions = {}
): Promise<ContentParseResult<Experience>> {
  return saveContentFile(filePath, experience, options);
}

/**
 * Saves case study to file
 */
export async function saveCaseStudy(
  filePath: string,
  caseStudy: CaseStudy,
  options: ContentManagerOptions = {}
): Promise<ContentParseResult<CaseStudy>> {
  return saveContentFile(filePath, caseStudy, options);
}

/**
 * Saves metric to file
 */
export async function saveMetric(
  filePath: string,
  metric: Metric,
  options: ContentManagerOptions = {}
): Promise<ContentParseResult<Metric>> {
  return saveContentFile(filePath, metric, options);
}

/**
 * Saves personal info to file
 */
export async function savePersonalInfo(
  filePath: string,
  personalInfo: PersonalInfo,
  options: ContentManagerOptions = {}
): Promise<ContentParseResult<PersonalInfo>> {
  return saveContentFile(filePath, personalInfo, options);
}

/**
 * Deletes a content file
 */
export async function deleteContentFile(filePath: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await fs.unlink(filePath);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete file',
    };
  }
}

/**
 * Lists all content files in a directory
 */
export async function listContentFiles(dirPath: string): Promise<{
  success: boolean;
  files: ContentFile[];
  error?: string;
}> {
  try {
    const files = await fs.readdir(dirPath);
    const contentFiles: ContentFile[] = [];

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = await fs.stat(filePath);

      if (stat.isFile() && (file.endsWith('.json') || file.endsWith('.md'))) {
        const content = await fs.readFile(filePath, 'utf-8');
        contentFiles.push({
          path: filePath,
          format: detectFileFormat(filePath),
          content,
          lastModified: stat.mtime,
        });
      }
    }

    return {
      success: true,
      files: contentFiles,
    };
  } catch (error) {
    return {
      success: false,
      files: [],
      error: error instanceof Error ? error.message : 'Failed to list files',
    };
  }
}

/**
 * Gets file metadata without loading full content
 */
export async function getContentFileMetadata(filePath: string): Promise<{
  success: boolean;
  metadata?: {
    path: string;
    format: 'json' | 'markdown';
    size: number;
    lastModified: Date;
  };
  error?: string;
}> {
  try {
    const stat = await fs.stat(filePath);
    return {
      success: true,
      metadata: {
        path: filePath,
        format: detectFileFormat(filePath),
        size: stat.size,
        lastModified: stat.mtime,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get file metadata',
    };
  }
}

/**
 * Validates content without saving
 */
export async function validateContentFile<T>(
  filePath: string,
  schema: z.ZodSchema<T>,
  options: ContentManagerOptions = {}
): Promise<ContentParseResult<T>> {
  return loadContentFile(filePath, schema, options);
}

/**
 * Exports content to JSON format
 */
export async function exportToJson<T>(
  data: T,
  filePath: string,
  options: ContentManagerOptions = {}
): Promise<ContentParseResult<T>> {
  const { encoding = 'utf-8' } = options;

  try {
    const content = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, content, encoding);

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      errors: {
        export: [error instanceof Error ? error.message : 'Failed to export to JSON'],
      },
    };
  }
}

/**
 * Exports content to Markdown format
 */
export async function exportToMarkdown<T extends Record<string, any>>(
  data: T,
  filePath: string,
  options: ContentManagerOptions = {}
): Promise<ContentParseResult<T>> {
  const { encoding = 'utf-8' } = options;

  try {
    const yamlLines = Object.entries(data).map(([key, value]) => {
      const jsonValue = typeof value === 'string' ? `"${value}"` : JSON.stringify(value);
      return `${key}: ${jsonValue}`;
    });

    const content = `---\n${yamlLines.join('\n')}\n---\n`;
    await fs.writeFile(filePath, content, encoding);

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      errors: {
        export: [error instanceof Error ? error.message : 'Failed to export to Markdown'],
      },
    };
  }
}

/**
 * Batch loads multiple content files
 */
export async function batchLoadContent<T>(
  filePaths: string[],
  schema: z.ZodSchema<T>,
  options: ContentManagerOptions = {}
): Promise<{
  success: boolean;
  results: Array<{
    path: string;
    success: boolean;
    data?: T;
    errors?: Record<string, string[]>;
  }>;
}> {
  const results = await Promise.all(
    filePaths.map(async (filePath) => {
      const result = await loadContentFile(filePath, schema, options);
      return {
        path: filePath,
        success: result.success,
        data: result.data,
        errors: result.errors,
      };
    })
  );

  const allSuccess = results.every((r) => r.success);

  return {
    success: allSuccess,
    results,
  };
}

/**
 * Batch saves multiple content items
 */
export async function batchSaveContent<T>(
  items: Array<{ path: string; data: T }>,
  options: ContentManagerOptions = {}
): Promise<{
  success: boolean;
  results: Array<{
    path: string;
    success: boolean;
    error?: string;
  }>;
}> {
  const results = await Promise.all(
    items.map(async ({ path: filePath, data }) => {
      try {
        const result = await saveContentFile(filePath, data, options);
        return {
          path: filePath,
          success: result.success,
          error: result.errors ? Object.values(result.errors).flat().join(', ') : undefined,
        };
      } catch (error) {
        return {
          path: filePath,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    })
  );

  const allSuccess = results.every((r) => r.success);

  return {
    success: allSuccess,
    results,
  };
}
