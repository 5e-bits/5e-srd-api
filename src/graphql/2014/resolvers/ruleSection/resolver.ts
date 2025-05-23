import { Resolver, Query, Arg, Args } from 'type-graphql'
import RuleSectionModel, { RuleSection } from '@/models/2014/ruleSection'
import { escapeRegExp } from '@/util'
import { buildMongoSortQuery } from '@/graphql/2014/common/inputs'
import { RuleSectionArgs, RuleSectionArgsSchema, RuleSectionIndexArgsSchema } from './args'

@Resolver(RuleSection)
export class RuleSectionResolver {
  @Query(() => [RuleSection], {
    description: 'Gets all rule sections, optionally filtered by name and sorted by name.'
  })
  async ruleSections(@Args(() => RuleSectionArgs) args: RuleSectionArgs): Promise<RuleSection[]> {
    const validatedArgs = RuleSectionArgsSchema.parse(args)
    const query = RuleSectionModel.find()

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

  @Query(() => RuleSection, {
    nullable: true,
    description: 'Gets a single rule section by index.'
  })
  async ruleSection(@Arg('index', () => String) indexInput: string): Promise<RuleSection | null> {
    const { index } = RuleSectionIndexArgsSchema.parse({ index: indexInput })
    return RuleSectionModel.findOne({ index }).lean()
  }
}
