const { noop } = require('lodash');
const { redisUrl } = require('./environmentVariables');
const { promisify } = require('util');
const { RedisClient: BaseRedisClient } = require('redis');
const unifyOptions = require('redis/lib/createClient');

module.exports = exports = class RedisClient extends BaseRedisClient {
  constructor() {
    super();

    this.close = this.quit;
    this.getAsPromise = promisify(this.get).bind(this);
    this.getSafely = this.getSafely.bind(this);
  }

  async getSafely(redisKey) {
    return await this.getAsPromise(redisKey).catch(noop);
  }

  static createClient() {
    return new RedisClient(unifyOptions.apply(null, [redisUrl]));
  }
};
