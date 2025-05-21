import { Resolver, Query, Arg, Args, FieldResolver, Root } from 'type-graphql'
import RuleModel, { Rule } from '@/models/2014/rule'
import RuleSectionModel, { RuleSection } from '@/models/2014/ruleSection'
import { escapeRegExp } from '@/util'
import { resolveMultipleReferences } from '@/graphql/2014/utils/resolvers'
import { buildMongoSortQuery } from '@/graphql/2014/common/inputs'
import { RuleArgs, RuleArgsSchema, RuleIndexArgsSchema } from './args'

@Resolver(Rule)
export class RuleResolver {
  @Query(() => [Rule], {
    description: 'Gets all rules, optionally filtered by name and sorted by name.'
  })
  async rules(@Args() args: RuleArgs): Promise<Rule[]> {
    const validatedArgs = RuleArgsSchema.parse(args)
    const query = RuleModel.find()

    if (validatedArgs.name) {
      query.where({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    const sortQuery = buildMongoSortQuery({
      orderDirection: validatedArgs.order_direction,
      defaultSortField: 'name'
    })

    if (sortQuery) {
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
  async rule(@Arg('index') indexInput: string): Promise<Rule | null> {
    const { index } = RuleIndexArgsSchema.parse({ index: indexInput })
    return RuleModel.findOne({ index }).lean()
  }

  @FieldResolver(() => [RuleSection])
  async subsections(@Root() rule: Rule): Promise<RuleSection[]> {
    return resolveMultipleReferences(rule.subsections, RuleSectionModel)
  }
}
