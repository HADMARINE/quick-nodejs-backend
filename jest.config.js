const { pathsToModuleNameMapper } = require('ts-jest/utils');
const requireJSON = require('require-strip-json-comments');
const { compilerOptions } = requireJSON('./tsconfig.json');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/src/',
  }),
  coveragePathIgnorePatterns: ['/node_modules/'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      diagnostics: true,
    },
  },
  verbose: true,
  setupFilesAfterEnv: ["jest-expect-message"]
};
