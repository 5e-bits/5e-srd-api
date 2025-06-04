import { Arg, Args, FieldResolver, Query, Resolver, Root } from 'type-graphql'

import { buildSortPipeline } from '@/graphql/common/args'
import { resolveMultipleReferences } from '@/graphql/utils/resolvers'
import RuleModel, { Rule } from '@/models/2014/rule'
import RuleSectionModel, { RuleSection } from '@/models/2014/ruleSection'
import { escapeRegExp } from '@/util'

import {
  RULE_SORT_FIELD_MAP,
  RuleArgs,
  RuleArgsSchema,
  RuleIndexArgsSchema,
  RuleOrderField
} from './args'

@Resolver(Rule)
export class RuleResolver {
  @Query(() => [Rule], {
    description: 'Gets all rules, optionally filtered by name and sorted by name.'
  })
  async rules(@Args(() => RuleArgs) args: RuleArgs): Promise<Rule[]> {
    const validatedArgs = RuleArgsSchema.parse(args)
    const query = RuleModel.find()

    if (validatedArgs.name != null && validatedArgs.name !== '') {
      query.where({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    const sortQuery = buildSortPipeline<RuleOrderField>({
      order: validatedArgs.order,
      sortFieldMap: RULE_SORT_FIELD_MAP
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

  @Query(() => Rule, { nullable: true, description: 'Gets a single rule by index.' })
  async rule(@Arg('index', () => String) indexInput: string): Promise<Rule | null> {
    const { index } = RuleIndexArgsSchema.parse({ index: indexInput })
    return RuleModel.findOne({ index }).lean()
  }

  @FieldResolver(() => [RuleSection])
  async subsections(@Root() rule: Rule): Promise<RuleSection[]> {
    return resolveMultipleReferences(rule.subsections, RuleSectionModel)
  }
}
