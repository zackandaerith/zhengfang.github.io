module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/resume-parser.test.ts', '**/__tests__/data-model-validation.property.test.ts'],
  preset: 'ts-jest',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
  ],
};
