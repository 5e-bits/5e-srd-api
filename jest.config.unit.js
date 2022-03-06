const config = require('./jest.config');
config.testRegex = '\\.test\\.(js|ts)$'; //Overriding testRegex option
console.log('RUNNING UNIT TESTS');
module.exports = config;
