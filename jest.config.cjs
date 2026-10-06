const nextJest = require('next/jest')

const createJestConfig = nextJest({ dir: './' })

module.exports = createJestConfig({
  testEnvironment: 'jsdom',
  // The chatbot worker is a separate package tested with Vitest.
  testPathIgnorePatterns: ['<rootDir>/chatbot/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
})
