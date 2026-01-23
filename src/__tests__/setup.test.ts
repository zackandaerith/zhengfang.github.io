/**
 * Basic setup test to verify the testing environment is working
 */

describe('Project Setup', () => {
  it('should have a working test environment', () => {
    expect(true).toBe(true);
  });

  it('should be able to import utility functions', () => {
    const { formatDate } = require('../utils');
    const date = new Date('2024-01-01');
    const formatted = formatDate(date);
    expect(formatted).toContain('2024');
  });

  it('should be able to import types', () => {
    // This test just verifies TypeScript compilation works
    const testData: { name: string; value: number } = {
      name: 'test',
      value: 42,
    };
    expect(testData.name).toBe('test');
    expect(testData.value).toBe(42);
  });
});