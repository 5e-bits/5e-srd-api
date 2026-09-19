import SimpleController from '@/controllers/simpleController'
import Monster from '@/models/2014/monster'
import { MonsterIndexQuerySchema } from '@/schemas/schemas'

export default new SimpleController(Monster, {
  querySchema: MonsterIndexQuerySchema,
  filter: ({ challenge_rating }) =>
    challenge_rating !== undefined && challenge_rating.length > 0
      ? { challenge_rating: { $in: challenge_rating } }
      : {},
  cache: true
})
