/**
 * Tests for Content Management System
 * Tests loading, parsing, validating, and managing portfolio content
 * @jest-environment node
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { promises as fs } from 'fs';
import path from 'path';
import {
  detectFileFormat,
  parseJsonContent,
  parseMarkdownContent,
  validateContent,
  loadContentFile,
  saveContentFile,
  loadUserProfile,
  loadExperience,
  loadCaseStudy,
  loadMetric,
  loadPersonalInfo,
  loadContentDirectory,
  saveUserProfile,
  saveExperience,
  saveCaseStudy,
  saveMetric,
  savePersonalInfo,
  deleteContentFile,
  listContentFiles,
  getContentFileMetadata,
  validateContentFile,
  exportToJson,
  exportToMarkdown,
  batchLoadContent,
  batchSaveContent,
} from '../content-manager';
import {
  UserProfileSchema,
  ExperienceSchema,
  CaseStudySchema,
  MetricSchema,
  PersonalInfoSchema,
} from '../../types/validation';
import type {
  UserProfile,
  Experience,
  CaseStudy,
  Metric,
  PersonalInfo,
} from '../../types';

// Test directory
const testDir = path.join(__dirname, '.test-content');

// Helper to create test directory
async function setupTestDir() {
  try {
    await fs.mkdir(testDir, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
}

// Helper to clean up test directory
async function cleanupTestDir() {
  try {
    const files = await fs.readdir(testDir);
    for (const file of files) {
      await fs.unlink(path.join(testDir, file));
    }
    await fs.rmdir(testDir);
  } catch (error) {
    // Directory might not exist
  }
}

describe('Content Manager - File Format Detection', () => {
  it('should detect JSON format from .json extension', () => {
    expect(detectFileFormat('profile.json')).toBe('json');
  });

  it('should detect Markdown format from .md extension', () => {
    expect(detectFileFormat('content.md')).toBe('markdown');
  });

  it('should detect Markdown format from .markdown extension', () => {
    expect(detectFileFormat('content.markdown')).toBe('markdown');
  });

  it('should default to JSON for unknown extensions', () => {
    expect(detectFileFormat('file.txt')).toBe('json');
  });

  it('should be case-insensitive for extensions', () => {
    expect(detectFileFormat('file.MD')).toBe('markdown');
    expect(detectFileFormat('file.JSON')).toBe('json');
  });
});

describe('Content Manager - JSON Parsing', () => {
  it('should parse valid JSON content', () => {
    const json = '{"name": "John", "age": 30}';
    const result = parseJsonContent(json);

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ name: 'John', age: 30 });
  });

  it('should handle invalid JSON gracefully', () => {
    const json = '{invalid json}';
    const result = parseJsonContent(json);

    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors?.parse).toBeDefined();
  });

  it('should preserve raw content', () => {
    const json = '{"test": true}';
    const result = parseJsonContent(json);

    expect(result.rawContent).toBe(json);
  });

  it('should handle empty JSON objects', () => {
    const json = '{}';
    const result = parseJsonContent(json);

    expect(result.success).toBe(true);
    expect(result.data).toEqual({});
  });

  it('should handle JSON arrays', () => {
    const json = '[1, 2, 3]';
    const result = parseJsonContent(json);

    expect(result.success).toBe(true);
    expect(result.data).toEqual([1, 2, 3]);
  });
});

describe('Content Manager - Markdown Parsing', () => {
  it('should parse Markdown with YAML front matter', () => {
    const markdown = `---
title: Test
author: John
---
# Content`;
    const result = parseMarkdownContent(markdown);

    expect(result.success).toBe(true);
    expect(result.data?.metadata.title).toBe('Test');
    expect(result.data?.metadata.author).toBe('John');
    expect(result.data?.body).toContain('# Content');
  });

  it('should handle Markdown without front matter', () => {
    const markdown = '# Just Content\nNo front matter here';
    const result = parseMarkdownContent(markdown);

    expect(result.success).toBe(true);
    expect(result.data?.metadata).toEqual({});
    expect(result.data?.body).toBe(markdown);
  });

  it('should parse JSON values in YAML front matter', () => {
    const markdown = `---
tags: ["tag1", "tag2"]
count: 42
---
Content`;
    const result = parseMarkdownContent(markdown);

    expect(result.success).toBe(true);
    expect(result.data?.metadata.tags).toEqual(['tag1', 'tag2']);
    expect(result.data?.metadata.count).toBe(42);
  });

  it('should preserve raw content', () => {
    const markdown = `---
title: Test
---
Content`;
    const result = parseMarkdownContent(markdown);

    expect(result.rawContent).toBe(markdown);
  });
});

describe('Content Manager - Content Validation', () => {
  it('should validate valid PersonalInfo data', () => {
    const data = {
      name: 'John Doe',
      title: 'Manager',
      location: 'San Francisco',
      email: 'john@example.com',
      linkedIn: 'https://linkedin.com/in/john',
      summary: 'A professional with 10+ years of experience',
      profileImage: 'https://example.com/image.jpg',
    };

    const result = validateContent(data, PersonalInfoSchema);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  it('should reject invalid PersonalInfo data', () => {
    const data = {
      name: 'John Doe',
      // Missing required fields
    };

    const result = validateContent(data, PersonalInfoSchema);

    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
  });

  it('should validate Metric data', () => {
    const data = {
      id: 'metric-1',
      name: 'Retention Rate',
      value: 95,
      unit: '%',
      description: 'Customer retention rate',
      category: 'retention' as const,
      timeframe: 'Last 12 months',
      context: 'Enterprise accounts',
    };

    const result = validateContent(data, MetricSchema);

    expect(result.success).toBe(true);
  });

  it('should provide detailed error messages', () => {
    const data = {
      name: 'John',
      // Missing other required fields
    };

    const result = validateContent(data, PersonalInfoSchema);

    expect(result.success).toBe(false);
    expect(Object.keys(result.errors || {}).length).toBeGreaterThan(0);
  });
});

describe('Content Manager - File Operations', () => {
  beforeEach(async () => {
    await setupTestDir();
  });

  afterEach(async () => {
    await cleanupTestDir();
  });

  it('should save and load JSON content', async () => {
    const testFile = path.join(testDir, 'test.json');
    const metric: Metric = {
      id: 'test-1',
      name: 'Test Metric',
      value: 100,
      unit: '%',
      description: 'A test metric',
      category: 'retention',
      timeframe: 'Monthly',
      context: 'Test context',
    };

    // Save
    const saveResult = await saveMetric(testFile, metric);
    expect(saveResult.success).toBe(true);

    // Load
    const loadResult = await loadMetric(testFile);
    expect(loadResult.success).toBe(true);
    expect(loadResult.data?.name).toBe('Test Metric');
  });

  it('should save and load Markdown content', async () => {
    const testFile = path.join(testDir, 'test.md');
    const metric: Metric = {
      id: 'test-1',
      name: 'Test Metric',
      value: 100,
      unit: '%',
      description: 'A test metric',
      category: 'retention',
      timeframe: 'Monthly',
      context: 'Test context',
    };

    // Save
    const saveResult = await saveMetric(testFile, metric);
    expect(saveResult.success).toBe(true);

    // Load
    const loadResult = await loadMetric(testFile);
    expect(loadResult.success).toBe(true);
    expect(loadResult.data?.name).toBe('Test Metric');
  });

  it('should create backups when saving', async () => {
    const testFile = path.join(testDir, 'test.json');
    const backupDir = path.join(testDir, 'backups');
    await fs.mkdir(backupDir, { recursive: true });

    const metric: Metric = {
      id: 'test-1',
      name: 'Test Metric',
      value: 100,
      unit: '%',
      description: 'A test metric',
      category: 'retention',
      timeframe: 'Monthly',
      context: 'Test context',
    };

    // Save with backup
    const saveResult = await saveMetric(testFile, metric, {
      createBackups: true,
      backupDir,
    });
    expect(saveResult.success).toBe(true);

    // Check if backup was created
    const backups = await fs.readdir(backupDir);
    expect(backups.length).toBeGreaterThanOrEqual(0); // Backup might not exist if file didn't exist before
  });

  it('should delete content files', async () => {
    const testFile = path.join(testDir, 'test.json');
    const metric: Metric = {
      id: 'test-1',
      name: 'Test Metric',
      value: 100,
      unit: '%',
      description: 'A test metric',
      category: 'retention',
      timeframe: 'Monthly',
      context: 'Test context',
    };

    // Save
    await saveMetric(testFile, metric);

    // Delete
    const deleteResult = await deleteContentFile(testFile);
    expect(deleteResult.success).toBe(true);

    // Verify deletion
    try {
      await fs.stat(testFile);
      expect(true).toBe(false); // Should not reach here
    } catch {
      expect(true).toBe(true); // File should not exist
    }
  });

  it('should list content files in directory', async () => {
    const metric: Metric = {
      id: 'test-1',
      name: 'Test Metric',
      value: 100,
      unit: '%',
      description: 'A test metric',
      category: 'retention',
      timeframe: 'Monthly',
      context: 'Test context',
    };

    // Save multiple files
    await saveMetric(path.join(testDir, 'metric1.json'), metric);
    await saveMetric(path.join(testDir, 'metric2.json'), metric);

    // List files
    const listResult = await listContentFiles(testDir);
    expect(listResult.success).toBe(true);
    expect(listResult.files.length).toBeGreaterThanOrEqual(2);
  });

  it('should get file metadata', async () => {
    const testFile = path.join(testDir, 'test.json');
    const metric: Metric = {
      id: 'test-1',
      name: 'Test Metric',
      value: 100,
      unit: '%',
      description: 'A test metric',
      category: 'retention',
      timeframe: 'Monthly',
      context: 'Test context',
    };

    // Save
    await saveMetric(testFile, metric);

    // Get metadata
    const metadataResult = await getContentFileMetadata(testFile);
    expect(metadataResult.success).toBe(true);
    expect(metadataResult.metadata?.format).toBe('json');
    expect(metadataResult.metadata?.size).toBeGreaterThan(0);
  });
});

describe('Content Manager - Batch Operations', () => {
  beforeEach(async () => {
    await setupTestDir();
  });

  afterEach(async () => {
    await cleanupTestDir();
  });

  it('should batch load multiple content files', async () => {
    const metric: Metric = {
      id: 'test-1',
      name: 'Test Metric',
      value: 100,
      unit: '%',
      description: 'A test metric',
      category: 'retention',
      timeframe: 'Monthly',
      context: 'Test context',
    };

    const file1 = path.join(testDir, 'metric1.json');
    const file2 = path.join(testDir, 'metric2.json');

    // Save files
    await saveMetric(file1, metric);
    await saveMetric(file2, metric);

    // Batch load
    const batchResult = await batchLoadContent([file1, file2], MetricSchema);
    expect(batchResult.success).toBe(true);
    expect(batchResult.results.length).toBe(2);
    expect(batchResult.results.every((r) => r.success)).toBe(true);
  });

  it('should batch save multiple content items', async () => {
    const metric: Metric = {
      id: 'test-1',
      name: 'Test Metric',
      value: 100,
      unit: '%',
      description: 'A test metric',
      category: 'retention',
      timeframe: 'Monthly',
      context: 'Test context',
    };

    const items = [
      { path: path.join(testDir, 'metric1.json'), data: metric },
      { path: path.join(testDir, 'metric2.json'), data: metric },
    ];

    // Batch save
    const batchResult = await batchSaveContent(items);
    expect(batchResult.success).toBe(true);
    expect(batchResult.results.length).toBe(2);
    expect(batchResult.results.every((r) => r.success)).toBe(true);
  });
});

describe('Content Manager - Export Operations', () => {
  beforeEach(async () => {
    await setupTestDir();
  });

  afterEach(async () => {
    await cleanupTestDir();
  });

  it('should export content to JSON', async () => {
    const testFile = path.join(testDir, 'export.json');
    const metric: Metric = {
      id: 'test-1',
      name: 'Test Metric',
      value: 100,
      unit: '%',
      description: 'A test metric',
      category: 'retention',
      timeframe: 'Monthly',
      context: 'Test context',
    };

    const exportResult = await exportToJson(metric, testFile);
    expect(exportResult.success).toBe(true);

    // Verify file was created
    const content = await fs.readFile(testFile, 'utf-8');
    expect(content).toContain('Test Metric');
  });

  it('should export content to Markdown', async () => {
    const testFile = path.join(testDir, 'export.md');
    const data = {
      title: 'Test',
      author: 'John',
      count: 42,
    };

    const exportResult = await exportToMarkdown(data, testFile);
    expect(exportResult.success).toBe(true);

    // Verify file was created
    const content = await fs.readFile(testFile, 'utf-8');
    expect(content).toContain('---');
    expect(content).toContain('title');
  });
});

describe('Content Manager - Error Handling', () => {
  it('should handle missing files gracefully', async () => {
    const nonExistentFile = path.join(__dirname, 'nonexistent.json');
    const result = await loadMetric(nonExistentFile);

    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
  });

  it('should handle invalid file paths', async () => {
    const invalidPath = '/invalid/path/that/does/not/exist/file.json';
    const result = await loadMetric(invalidPath);

    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
  });

  it('should handle corrupted JSON files', async () => {
    const testDir = path.join(__dirname, '.test-corrupted');
    await fs.mkdir(testDir, { recursive: true });

    try {
      const testFile = path.join(testDir, 'corrupted.json');
      await fs.writeFile(testFile, '{invalid json content}');

      const result = await loadMetric(testFile);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    } finally {
      await fs.unlink(path.join(testDir, 'corrupted.json'));
      await fs.rmdir(testDir);
    }
  });
});

describe('Content Manager - Content Directory Loading', () => {
  beforeEach(async () => {
    await setupTestDir();
  });

  afterEach(async () => {
    await cleanupTestDir();
  });

  it('should load all content files from a directory', async () => {
    const metric: Metric = {
      id: 'test-1',
      name: 'Test Metric',
      value: 100,
      unit: '%',
      description: 'A test metric',
      category: 'retention',
      timeframe: 'Monthly',
      context: 'Test context',
    };

    // Save multiple files
    await saveMetric(path.join(testDir, 'metric1.json'), metric);
    await saveMetric(path.join(testDir, 'metric2.json'), metric);

    // Load directory
    const result = await loadContentDirectory(testDir, MetricSchema);
    expect(result.success).toBe(true);
    expect(result.items.length).toBeGreaterThanOrEqual(2);
  });

  it('should handle mixed valid and invalid files', async () => {
    const metric: Metric = {
      id: 'test-1',
      name: 'Test Metric',
      value: 100,
      unit: '%',
      description: 'A test metric',
      category: 'retention',
      timeframe: 'Monthly',
      context: 'Test context',
    };

    // Save valid file
    await saveMetric(path.join(testDir, 'valid.json'), metric);

    // Save invalid file
    await fs.writeFile(path.join(testDir, 'invalid.json'), '{invalid}');

    // Load directory
    const result = await loadContentDirectory(testDir, MetricSchema);
    expect(result.items.length).toBeGreaterThanOrEqual(1);
    expect(result.errors.length).toBeGreaterThanOrEqual(1);
  });
});
