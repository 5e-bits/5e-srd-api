import { Config } from '@jest/types';
import baseConfig from './jest.config';

const unitConfig: Config.InitialOptions = {
  ...baseConfig,
  displayName: 'Unit Tests',
  testRegex: '\\.test\\.(js|ts)$',
  setupFilesAfterEnv: ['./src/tests/support/setupRedisMock.ts'],
  silent: false,
};

console.log('RUNNING UNIT TESTS');
export default unitConfig;
