/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  testRegex: 'test\\.js$',
  modulePathIgnorePatterns: ['/dist/'],
  coveragePathIgnorePatterns: ['/node_modules/'],
};
