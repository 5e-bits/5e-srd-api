import { Arg, Args, FieldResolver, Query, Resolver, Root } from 'type-graphql'

import { buildSortPipeline } from '@/graphql/2014/common/args'
import { resolveMultipleReferences } from '@/graphql/2014/utils/resolvers'
import AbilityScoreModel, { AbilityScore } from '@/models/2014/abilityScore'
import SkillModel, { Skill } from '@/models/2014/skill'
import { escapeRegExp } from '@/util'

import {
  ABILITY_SCORE_SORT_FIELD_MAP,
  AbilityScoreArgs,
  AbilityScoreArgsSchema,
  AbilityScoreIndexArgsSchema,
  AbilityScoreOrderField} from './args'

@Resolver(AbilityScore)
export class AbilityScoreResolver {
  @Query(() => [AbilityScore], {
    description: 'Gets all ability scores, optionally filtered by name and sorted.'
  })
  async abilityScores(
    @Args(() => AbilityScoreArgs) args: AbilityScoreArgs
  ): Promise<AbilityScore[]> {
    const validatedArgs = AbilityScoreArgsSchema.parse(args)

    const query = AbilityScoreModel.find()
    const filters: Record<string, any>[] = []

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

    const sortQuery = buildSortPipeline<AbilityScoreOrderField>({
      order: validatedArgs.order,
      sortFieldMap: ABILITY_SCORE_SORT_FIELD_MAP,
      defaultSortField: AbilityScoreOrderField.NAME
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
