import config from './jest.config';
config.testRegex = '\\.itest\\.(js|ts)$'; //Overriding testRegex option
config.silent = true;
console.log('RUNNING INTEGRATION TESTS');
export default config;
