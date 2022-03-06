import redisClient from './RedisClient';

import { ResourceList } from './data';
import MagicItem from '../models/magicItem';
import Spell from '../models/spell';
import Monster from '../models/monster';
import Rule from '../models/rule';
import RuleSection from '../models/ruleSection';

const prewarmCache = async () => {
  const toPrewarm = [
    {
      Schema: MagicItem,
      endpoint: '/api/magic-items',
    },
    {
      Schema: Spell,
      endpoint: '/api/spells',
    },
    {
      Schema: Monster,
      endpoint: '/api/monsters',
    },
    {
      Schema: Rule,
      endpoint: '/api/rules',
    },
    {
      Schema: RuleSection,
      endpoint: '/api/rule-sections',
    },
  ];
  for (const element of toPrewarm) {
    const data = await element.Schema.find()
      .select({ index: 1, name: 1, url: 1, _id: 0 })
      .sort({ index: 'asc' });
    const jsonData = ResourceList(data);
    await redisClient.set(element.endpoint, JSON.stringify(jsonData));
  }
};

export default prewarmCache;
