const config = require('./jest.config');
config.testRegex = '\\.test\\.js$'; //Overriding testRegex option
console.log('RUNNING UNIT TESTS');
module.exports = config;
