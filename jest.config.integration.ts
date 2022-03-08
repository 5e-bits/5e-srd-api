import config from './jest.config';
config.testRegex = '\\.itest\\.(js|ts)$'; //Overriding testRegex option
console.log('RUNNING INTEGRATION TESTS');
export default config;
