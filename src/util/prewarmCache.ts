import { getModelForClass } from '@typegoose/typegoose'

import MagicItem from '@/models/2014/magicItem'
import Monster from '@/models/2014/monster'
import Rule from '@/models/2014/rule'
import RuleSection from '@/models/2014/ruleSection'
import Spell from '@/models/2014/spell'

import { ResourceList } from './data'
import redisClient from './RedisClient'

type PrewarmData = {
  Schema: ReturnType<typeof getModelForClass>
  endpoint: string
}

const prewarmCache = async () => {
  const toPrewarm: PrewarmData[] = [
    {
      Schema: MagicItem,
      endpoint: '/api/2014/magic-items'
    },
    {
      Schema: Spell,
      endpoint: '/api/2014/spells'
    },
    {
      Schema: Monster,
      endpoint: '/api/2014/monsters'
    },
    {
      Schema: Rule,
      endpoint: '/api/2014/rules'
    },
    {
      Schema: RuleSection,
      endpoint: '/api/2014/rule-sections'
    }
  ]
  for (const element of toPrewarm) {
    const data = await element.Schema.find()
      .select({ index: 1, level: 1, name: 1, url: 1, _id: 0 })
      .sort({ index: 'asc' })
    const jsonData = ResourceList(data)
    await redisClient.set(element.endpoint, JSON.stringify(jsonData))
  }
}

export default prewarmCache
