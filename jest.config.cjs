const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
  setupFiles: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  collectCoverageFrom: [
    '!**/*.d.ts',
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    '!app/layout.tsx',
    '!app/api/**/*.{js,jsx,ts,tsx}', // Already added validations in the form
    '!components/ui/**', // Exclude files in components/ui folder as they are from shadcn/ui and already was tested by the shadcn/ui package
  ],
};

module.exports = createJestConfig(customJestConfig);
