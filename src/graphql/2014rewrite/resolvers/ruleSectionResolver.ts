import { Resolver, Query, Arg, Args, ArgsType, Field, Int } from 'type-graphql'
import { z } from 'zod'
import RuleSectionModel, { RuleSection } from '@/models/2014/ruleSection'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { escapeRegExp } from '@/util'
import { buildMongoSortQuery } from '../common/inputs'

// Zod schema for RuleSectionArgs
const RuleSectionArgsSchema = z.object({
  name: z.string().optional(),
  order_direction: z.nativeEnum(OrderByDirection).optional().default(OrderByDirection.ASC),
  skip: z.number().int().min(0).optional(),
  limit: z.number().int().min(1).optional()
})

// Zod schema for RuleSection index argument
const RuleSectionIndexArgsSchema = z.object({
  index: z.string().min(1, { message: 'Index must be a non-empty string' })
})

@ArgsType()
class RuleSectionArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by rule section name (case-insensitive, partial match)'
  })
  name?: string

  @Field(() => OrderByDirection, {
    nullable: true,
    description: 'Sort direction (default: ASC for name)'
  })
  order_direction?: OrderByDirection

  @Field(() => Int, { nullable: true, description: 'TODO: Pass 5 - Number of results to skip' })
  skip?: number

  @Field(() => Int, {
    nullable: true,
    description: 'TODO: Pass 5 - Maximum number of results to return'
  })
  limit?: number
}

@Resolver(RuleSection)
export class RuleSectionResolver {
  @Query(() => [RuleSection], {
    description: 'Gets all rule sections, optionally filtered by name and sorted by name.'
  })
  async ruleSections(@Args() args: RuleSectionArgs): Promise<RuleSection[]> {
    const validatedArgs = RuleSectionArgsSchema.parse(args)
    const { name, order_direction /*, skip, limit */ } = validatedArgs

    const query = RuleSectionModel.find()

    if (name) {
      query.where({ name: { $regex: new RegExp(escapeRegExp(name), 'i') } })
    }

    const sortQuery = buildMongoSortQuery({
      defaultSortField: 'name',
      orderDirection: order_direction
    })
    if (sortQuery) {
      query.sort(sortQuery)
    }

    return query.lean()
  }

  @Query(() => RuleSection, { nullable: true, description: 'Gets a single rule section by index.' })
  async ruleSection(@Arg('index', () => String) indexInput: string): Promise<RuleSection | null> {
    const { index } = RuleSectionIndexArgsSchema.parse({ index: indexInput })
    return RuleSectionModel.findOne({ index }).lean()
  }
}
