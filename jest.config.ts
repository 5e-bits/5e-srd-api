/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-node',
  collectCoverage: true,
  testRegex: 'test\\.(js|ts)$',
  modulePathIgnorePatterns: ['/dist/'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  silent: false,
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      useESM: true,
      tsconfig: '<rootDir>/tsconfig.json',
    },
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {},
};
