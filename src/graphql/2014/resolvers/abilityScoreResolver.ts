import SkillModel from '@/models/2014/skill'
import {
  coalesceFilters,
  getMongoSortDirection,
  resolveContainsStringFilter,
  SortQuery,
  QueryParams
} from './common'
import { AbilityScore } from '@/models/2014/abilityScore'

const AbilityScoreResolver = {
  skills: async (abilityScore: AbilityScore, args: QueryParams) => {
    const filters: any[] = [{ index: { $in: abilityScore.skills.map((s: any) => s.index) } }]

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name))
    }

    const sort: SortQuery = {}
    if (args.order_direction) {
      sort.name = getMongoSortDirection(args.order_direction)
    }

    return await SkillModel.find(coalesceFilters(filters)).sort(sort).lean()
  }
}

export default AbilityScoreResolver
