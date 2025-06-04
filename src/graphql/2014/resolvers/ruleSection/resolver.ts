import { Arg, Args, Query, Resolver } from 'type-graphql'

import { buildSortPipeline } from '@/graphql/common/args'
import RuleSectionModel, { RuleSection } from '@/models/2014/ruleSection'
import { escapeRegExp } from '@/util'

import {
  RULE_SECTION_SORT_FIELD_MAP,
  RuleSectionArgs,
  RuleSectionArgsSchema,
  RuleSectionIndexArgsSchema,
  RuleSectionOrderField
} from './args'

@Resolver(RuleSection)
export class RuleSectionResolver {
  @Query(() => [RuleSection], {
    description: 'Gets all rule sections, optionally filtered by name and sorted by name.'
  })
  async ruleSections(@Args(() => RuleSectionArgs) args: RuleSectionArgs): Promise<RuleSection[]> {
    const validatedArgs = RuleSectionArgsSchema.parse(args)
    const query = RuleSectionModel.find()

    if (validatedArgs.name != null && validatedArgs.name !== '') {
      query.where({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    const sortQuery = buildSortPipeline<RuleSectionOrderField>({
      order: validatedArgs.order,
      sortFieldMap: RULE_SECTION_SORT_FIELD_MAP
    })

    if (Object.keys(sortQuery).length > 0) {
      query.sort(sortQuery)
    }

    if (validatedArgs.skip) {
      query.skip(validatedArgs.skip)
    }
    if (validatedArgs.limit) {
      query.limit(validatedArgs.limit)
    }

    return query.lean()
  }

  @Query(() => RuleSection, {
    nullable: true,
    description: 'Gets a single rule section by index.'
  })
  async ruleSection(@Arg('index', () => String) indexInput: string): Promise<RuleSection | null> {
    const { index } = RuleSectionIndexArgsSchema.parse({ index: indexInput })
    return RuleSectionModel.findOne({ index }).lean()
  }
}
