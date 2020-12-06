const redisClient = require('./RedisClient');
const prewarmCache = require('./prewarmCache');
const { bugsnagApiKey, mongodbUri } = require('./environmentVariables');
const { escapeRegExp } = require('./regex');
const { ResourceList, ClassAPIResource } = require('./data');

module.exports = {
  bugsnagApiKey,
  mongodbUri,
  redisClient,
  prewarmCache,
  escapeRegExp,
  ResourceList,
  ClassAPIResource
};
