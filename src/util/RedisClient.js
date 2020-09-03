const redis = require('redis');
const { noop } = require('lodash');
const { redisUrl } = require('./environmentVariables');
const { promisify } = require('util');

module.exports = exports = class RedisClient {
  constructor() {
    this._client = redis.createClient(redisUrl);
    this._getAsync = promisify(this._client.get).bind(this._client);

    this.getDataFromCache = this.getDataFromCache.bind(this);
    this.flushall = this.flushall.bind(this);
    this.close = this.close.bind(this);
  }

  async getDataFromCache(redisKey) {
    return await this._getAsync(redisKey).catch(noop);
  }

  flushall() {
    this._client.flushall();
  }

  close() {
    this._client.quit();
  }
};
