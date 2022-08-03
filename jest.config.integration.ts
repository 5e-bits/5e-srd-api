import config from './jest.config';

config.testRegex = '\\.itest\\.(js|ts)$'; //Overriding testRegex option
console.log('RUNNING INTEGRATION TESTS');
config.silent = true; //Overriding silent option
export default config;
