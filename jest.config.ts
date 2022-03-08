/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  testRegex: 'test\\.(js|ts)$',
  modulePathIgnorePatterns: ['/dist/'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  silent: false,
};
