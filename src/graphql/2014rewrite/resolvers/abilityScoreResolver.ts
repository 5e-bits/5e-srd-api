import { Resolver, Query, Arg, Args, ArgsType, Field, FieldResolver, Root, Int } from 'type-graphql'
import { z } from 'zod'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { resolveMultipleReferences } from '@/graphql/2014rewrite/utils/resolvers'
import AbilityScoreModel, { AbilityScore } from '@/models/2014/abilityScore'
import SkillModel, { Skill } from '@/models/2014/skill'
import { escapeRegExp } from '@/util'
import { buildMongoSortQuery } from '../common/inputs'

// Zod schema for AbilityScoreArgs
const AbilityScoreArgsSchema = z.object({
  name: z.string().optional(),
  full_name: z.string().optional(),
  order_direction: z.nativeEnum(OrderByDirection).optional().default(OrderByDirection.ASC),
  skip: z.number().int().min(0).optional(), // TODO: Pass 5 - Implement pagination
  limit: z.number().int().min(1).optional() // TODO: Pass 5 - Implement pagination
})

// Zod schema for AbilityScore index argument
const AbilityScoreIndexArgsSchema = z.object({
  index: z.string().min(1, { message: 'Index must be a non-empty string' })
})

@ArgsType()
class AbilityScoreArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by ability score name (case-insensitive, partial match)'
  })
  name?: string

  @Field(() => String, {
    nullable: true,
    description: 'Filter by ability score full name (case-insensitive, partial match)'
  })
  full_name?: string

  @Field(() => OrderByDirection, {
    nullable: true,
    description: 'Sort direction (default: ASC for name)'
  })
  order_direction?: OrderByDirection

  @Field(() => Int, { nullable: true, description: 'TODO: Pass 5 - Number of results to skip' })
  skip?: number

  @Field(() => Int, {
    nullable: true
  })
  limit?: number
}

@Resolver(AbilityScore)
export class AbilityScoreResolver {
  @Query(() => [AbilityScore], {
    description: 'Gets all ability scores, optionally filtered by name and sorted by name.'
  })
  async abilityScores(@Args() args: AbilityScoreArgs): Promise<AbilityScore[]> {
    const validatedArgs = AbilityScoreArgsSchema.parse(args)
    const { name, full_name, order_direction } = validatedArgs

    const query = AbilityScoreModel.find()
    const filters: any[] = []

    if (name) {
      filters.push({ name: { $regex: new RegExp(escapeRegExp(name), 'i') } })
    }

    if (full_name) {
      filters.push({ full_name: { $regex: new RegExp(escapeRegExp(full_name), 'i') } })
    }

    if (filters.length > 0) {
      query.where({ $and: filters })
    }

    const sortQuery = buildMongoSortQuery({
      defaultSortField: 'name',
      orderDirection: order_direction
    })
    if (sortQuery) {
      query.sort(sortQuery)
    }

    // TODO: Pass 5 - Implement pagination
    // if (skip !== undefined) {
    //   query.skip(skip);
    // }
    // if (limit !== undefined) {
    //  query.limit(limit);
    // }

    return query.lean()
  }

  @Query(() => AbilityScore, {
    nullable: true,
    description: 'Gets a single ability score by index.'
  })
  async abilityScore(@Arg('index', () => String) indexInput: string): Promise<AbilityScore | null> {
    const { index } = AbilityScoreIndexArgsSchema.parse({ index: indexInput })
    return AbilityScoreModel.findOne({ index }).lean()
  }

  @FieldResolver(() => [Skill])
  async skills(@Root() abilityScore: AbilityScore): Promise<Skill[]> {
    return resolveMultipleReferences(abilityScore.skills, SkillModel)
  }
}
