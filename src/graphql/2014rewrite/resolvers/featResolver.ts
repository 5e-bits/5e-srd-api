import { Resolver, Query, Arg, Args, ArgsType, Field, FieldResolver, Root, Int } from 'type-graphql'
import { z } from 'zod'
import FeatModel, { Feat, Prerequisite } from '@/models/2014/feat'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { escapeRegExp } from '@/util'
import AbilityScoreModel, { AbilityScore } from '@/models/2014/abilityScore'
import { resolveSingleReference } from '@/graphql/2014rewrite/utils/resolvers'
import { buildMongoSortQuery } from '../common/inputs'

// Zod schema for FeatArgs
const FeatArgsSchema = z.object({
  name: z.string().optional(),
  order_direction: z.nativeEnum(OrderByDirection).optional().default(OrderByDirection.ASC),
  skip: z.number().int().min(0).optional(),
  limit: z.number().int().min(1).optional()
})

// Zod schema for Feat index argument
const FeatIndexArgsSchema = z.object({
  index: z.string().min(1, { message: 'Index must be a non-empty string' })
})

@ArgsType()
class FeatArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by feat name (case-insensitive, partial match)'
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

@Resolver(Feat)
export class FeatResolver {
  @Query(() => [Feat], {
    description: 'Gets all feats, optionally filtered by name and sorted by name.'
  })
  async feats(@Args() args: FeatArgs): Promise<Feat[]> {
    const validatedArgs = FeatArgsSchema.parse(args)

    const query = FeatModel.find()

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

    return query.lean()
  }

  @Query(() => Feat, { nullable: true, description: 'Gets a single feat by index.' })
  async feat(@Arg('index', () => String) indexInput: string): Promise<Feat | null> {
    const { index } = FeatIndexArgsSchema.parse({ index: indexInput })
    return FeatModel.findOne({ index }).lean()
  }
}

// Separate resolver for nested Prerequisite type
@Resolver(Prerequisite)
export class PrerequisiteResolver {
  @FieldResolver(() => AbilityScore, { nullable: true })
  async ability_score(@Root() prerequisite: Prerequisite): Promise<AbilityScore | null> {
    return resolveSingleReference(prerequisite.ability_score, AbilityScoreModel)
  }
}
