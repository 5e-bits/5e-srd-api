import RuleSectionModel from '@/models/2014/ruleSection'
import { coalesceFilters, resolveContainsStringFilter, QueryParams } from './common'
import { Rule } from '@/models/2014/rule'
import { APIReference } from '@/models/2014/types/apiReference'

const RuleResolver = {
  subsections: async (rule: Rule, args: QueryParams) => {
    const filters: any[] = [
      {
        index: { $in: rule.subsections.map((r: APIReference) => r.index) }
      }
    ]

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name))
    }

    return await RuleSectionModel.find(coalesceFilters(filters)).lean()
  }
}

export default RuleResolver
