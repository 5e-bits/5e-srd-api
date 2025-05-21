import { Resolver, Query, Arg, Args, ArgsType, Field, FieldResolver, Root } from 'type-graphql'
import { z } from 'zod'
import { resolveMultipleReferences } from '@/graphql/2014/utils/resolvers'
import AbilityScoreModel, { AbilityScore } from '@/models/2014/abilityScore'
import SkillModel, { Skill } from '@/models/2014/skill'
import { escapeRegExp } from '@/util'
import { buildMongoSortQuery } from '../common/inputs'
import { BaseFilterNameSortArgs, BaseFilterNameSortArgsSchema } from '../common/args'

const AbilityScoreArgsSchema = BaseFilterNameSortArgsSchema.extend({
  full_name: z.string().optional()
})

const AbilityScoreIndexArgsSchema = z.object({
  index: z.string().min(1, { message: 'Index must be a non-empty string' })
})
@ArgsType()
class AbilityScoreArgs extends BaseFilterNameSortArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by ability score full name (case-insensitive, partial match)'
  })
  full_name?: string
}

@Resolver(AbilityScore)
export class AbilityScoreResolver {
  @Query(() => [AbilityScore], {
    description: 'Gets all ability scores, optionally filtered by name and sorted.'
  })
  async abilityScores(@Args() args: AbilityScoreArgs): Promise<AbilityScore[]> {
    const validatedArgs = AbilityScoreArgsSchema.parse(args)

    const query = AbilityScoreModel.find()
    const filters: Record<string, any>[] = [] // Prepare for multiple filters

    if (validatedArgs.name) {
      filters.push({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    if (validatedArgs.full_name) {
      filters.push({
        full_name: { $regex: new RegExp(escapeRegExp(validatedArgs.full_name), 'i') }
      })
    }

    if (filters.length > 0) {
      query.where({ $and: filters })
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

  @Query(() => AbilityScore, {
    nullable: true,
    description: 'Gets a single ability score by index.'
  })
  async abilityScore(@Arg('index') indexInput: string): Promise<AbilityScore | null> {
    const { index } = AbilityScoreIndexArgsSchema.parse({ index: indexInput })
    return AbilityScoreModel.findOne({ index }).lean()
  }

  @FieldResolver(() => [Skill])
  async skills(@Root() abilityScore: AbilityScore): Promise<Skill[]> {
    return resolveMultipleReferences(abilityScore.skills, SkillModel)
  }
}
