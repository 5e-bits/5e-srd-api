// const { noop } = require('lodash');
const { redisUrl } = require('./environmentVariables');
const redis = require('redis');

module.exports = redis.createClient(redisUrl);
