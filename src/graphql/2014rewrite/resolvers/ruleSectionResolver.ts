import { Resolver, Query, Arg, Args, ArgsType } from 'type-graphql'
import { z } from 'zod'
import RuleSectionModel, { RuleSection } from '@/models/2014/ruleSection'
import { escapeRegExp } from '@/util'
import { buildMongoSortQuery } from '@/graphql/2014rewrite/common/inputs'
import { BaseFilterNameSortArgs, BaseFilterNameSortArgsSchema } from '../common/args'

const RuleSectionArgsSchema = BaseFilterNameSortArgsSchema

const RuleSectionIndexArgsSchema = z.object({
  index: z.string().min(1, { message: 'Index must be a non-empty string' })
})

@ArgsType()
class RuleSectionArgs extends BaseFilterNameSortArgs {}

@Resolver(RuleSection)
export class RuleSectionResolver {
  @Query(() => [RuleSection], {
    description: 'Gets all rule sections, optionally filtered by name and sorted by name.'
  })
  async ruleSections(@Args() args: RuleSectionArgs): Promise<RuleSection[]> {
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
  async ruleSection(@Arg('index') indexInput: string): Promise<RuleSection | null> {
    const { index } = RuleSectionIndexArgsSchema.parse({ index: indexInput })
    return RuleSectionModel.findOne({ index }).lean()
  }
}
