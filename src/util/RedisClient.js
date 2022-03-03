// const { noop } = require('lodash');
const { redisUrl, redisHost, redisPort } = require('./environmentVariables');
const { createClient } = require('redis');

module.exports = createClient({ socket: { host: redisHost, port: redisPort } });
