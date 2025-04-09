import { Config } from '@jest/types';
import baseConfig from './jest.config';

const integrationConfig: Config.InitialOptions = {
  ...baseConfig,
  displayName: 'Integration Tests',
  testRegex: '\\.itest\\.(js|ts)$',
  silent: true,
  maxWorkers: 1, // Use 1 worker to run tests sequentially
};

console.log('RUNNING INTEGRATION TESTS');
export default integrationConfig;
