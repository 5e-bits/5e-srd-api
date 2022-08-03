import config from './jest.config';
config.testRegex = '\\.test\\.(js|ts)$'; //Overriding testRegex option
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
(config.setupFilesAfterEnv = ['./src/tests/support/setupRedisMock.ts']),
  console.log('RUNNING UNIT TESTS');
export default config;
