import { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  // Specify the test environment
  testEnvironment: 'node',

  // Specify test match patterns
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts',
  ],

  // Optionally, define other Jest configuration options
  // For example, coverage thresholds, setup files, etc.
};

export default config;
