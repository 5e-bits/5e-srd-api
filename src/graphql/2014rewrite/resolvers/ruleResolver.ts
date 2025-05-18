import { Resolver, Query, Arg, Args, ArgsType, Field, FieldResolver, Root, Int } from 'type-graphql'
import { z } from 'zod'
import RuleModel, { Rule } from '@/models/2014/rule'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { escapeRegExp } from '@/util'
import RuleSectionModel, { RuleSection } from '@/models/2014/ruleSection'
import { resolveMultipleReferences } from '@/graphql/2014rewrite/utils/resolvers'
import { buildMongoSortQuery } from '@/graphql/2014rewrite/common/inputs'

// Zod schema for RuleArgs
const RuleArgsSchema = z.object({
  name: z.string().optional(),
  order_direction: z.nativeEnum(OrderByDirection).optional().default(OrderByDirection.ASC),
  skip: z.number().int().min(0).optional(),
  limit: z.number().int().min(1).optional()
})

// Zod schema for Rule index argument
const RuleIndexArgsSchema = z.object({
  index: z.string().min(1, { message: 'Index must be a non-empty string' })
})

@ArgsType()
class RuleArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by rule name (case-insensitive, partial match)'
  })
  name?: string

  @Field(() => OrderByDirection, {
    nullable: true,
    description: 'Sort direction for the name field (default: ASC)'
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
      defaultSortField: 'name',
      orderDirection: validatedArgs.order_direction
    })
    if (sortQuery) {
      query.sort(sortQuery)
    }

    // TODO: Pass 5 - Implement pagination
    // if (skip) {
    //   query.skip(skip)
    // }
    // if (limit) {
    //   query.limit(limit)
    // }

    return query.lean()
  }

  @Query(() => Rule, { nullable: true, description: 'Gets a single rule by index.' })
  async rule(@Arg('index') indexInput: string): Promise<Rule | null> {
    const { index } = RuleIndexArgsSchema.parse({ index: indexInput })
    return RuleModel.findOne({ index }).lean()
  }

  @FieldResolver(() => [RuleSection], { nullable: true })
  async subsections(@Root() rule: Rule): Promise<RuleSection[]> {
    return resolveMultipleReferences(rule.subsections, RuleSectionModel)
  }
}
