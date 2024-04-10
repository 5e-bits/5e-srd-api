import MagicItem from '../models/magicItem/index.js';
import Monster from '../models/monster/index.js';
import { ResourceList } from './data.js';
import Rule from '../models/rule/index.js';
import RuleSection from '../models/ruleSection/index.js';
import Spell from '../models/spell/index.js';
import mongoose from 'mongoose';
import redisClient from './RedisClient.js';

type PrewarmData = {
  Schema: mongoose.Model<any, any>;
  endpoint: string;
};

const prewarmCache = async () => {
  const toPrewarm: PrewarmData[] = [
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
      .select({ index: 1, level: 1, name: 1, url: 1, _id: 0 })
      .sort({ index: 'asc' });
    const jsonData = ResourceList(data);
    await redisClient.set(element.endpoint, JSON.stringify(jsonData));
  }
};

export default prewarmCache;
