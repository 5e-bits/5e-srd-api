import config from './jest.config';
config.testRegex = '\\.test\\.(js|ts)$'; //Overriding testRegex option
console.log('RUNNING UNIT TESTS');
export default config;
