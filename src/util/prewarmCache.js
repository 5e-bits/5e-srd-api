const { promisify } = require('util');

const redisClient = require('./RedisClient');
const setAsync = promisify(redisClient.set).bind(redisClient);

const { ResourceList } = require('./data');
const MagicItem = require('../models/magicItem');
const Spell = require('../models/spell');
const Monster = require('../models/monster');
const Rule = require('../models/rule');
const RuleSection = require('../models/ruleSection');

const prewarmCache = async () => {
  const toPrewarm = [
    {
      Schema: MagicItem,
      endpoint: '/api/magic-items'
    },
    {
      Schema: Spell,
      endpoint: '/api/spells'
    },
    {
      Schema: Monster,
      endpoint: '/api/monsters'
    },
    {
      Schema: Rule,
      endpoint: '/api/rules'
    },
    {
      Schema: RuleSection,
      endpoint: '/api/rule-sections'
    }
  ];
  for (const element of toPrewarm) {
    const data = await element.Schema.find()
      .select({ index: 1, name: 1, url: 1, _id: 0 })
      .sort({ index: 'asc' });
    const jsonData = ResourceList(data);
    await setAsync(element.endpoint, JSON.stringify(jsonData));
  }
};

module.exports = prewarmCache;
