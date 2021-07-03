/** @type {import('@jest/types').Config.InitialOptions} */
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const requireJSON = require('require-strip-json-comments');
const { compilerOptions } = requireJSON('./tsconfig.json');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/src/',
  }),
  coveragePathIgnorePatterns: ['/dist/'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      diagnostics: true,
    },
  },
  verbose: true,
  setupFilesAfterEnv: ['jest-expect-message'],
  collectCoverage: true,
  coverageDirectory: './reports/coverage',
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        pageTitle: 'Test Report',
        outputPath: './reports/test/index.html',
      },
    ],
    [
      'jest-junit',
      { outputDirectory: './reports/junit', outputName: 'results.xml' },
    ],
  ],
};
