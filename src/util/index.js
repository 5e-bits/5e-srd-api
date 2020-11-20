const redisClient = require('./RedisClient');
const prewarmCache = require('./prewarmCache');
const RealmClient = require('./RealmClient');
const { bugsnagApiKey, mongodbUri } = require('./environmentVariables');
const { escapeRegExp } = require('./regex');
const { ResourceList, ClassAPIResource } = require('./data');

module.exports = {
  bugsnagApiKey,
  mongodbUri,
  redisClient,
  RealmClient,
  prewarmCache,
  escapeRegExp,
  ResourceList,
  ClassAPIResource
};
