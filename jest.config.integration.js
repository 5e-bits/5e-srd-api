const config = require('./jest.config');
config.testRegex = '\\.itest\\.js$'; //Overriding testRegex option
config.silent = true;
console.log('RUNNING INTEGRATION TESTS');
module.exports = config;
