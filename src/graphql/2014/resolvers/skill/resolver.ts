import { Arg, Args, FieldResolver, Query, Resolver, Root } from 'type-graphql'

import { buildSortPipeline } from '@/graphql/2014/common/args'
import { resolveSingleReference } from '@/graphql/2014/utils/resolvers'
import AbilityScoreModel, { AbilityScore } from '@/models/2014/abilityScore'
import SkillModel, { Skill } from '@/models/2014/skill'
import { escapeRegExp } from '@/util'

import {
  SKILL_SORT_FIELD_MAP,
  SkillArgs,
  SkillArgsSchema,
  SkillIndexArgsSchema,
  SkillOrderField} from './args'

@Resolver(Skill)
export class SkillResolver {
  @Query(() => [Skill], {
    description: 'Gets all skills, optionally filtered by name and sorted by name.'
  })
  async skills(@Args(() => SkillArgs) args: SkillArgs): Promise<Skill[]> {
    const validatedArgs = SkillArgsSchema.parse(args)

    const query = SkillModel.find()
    const filters: any[] = []

    if (validatedArgs.name) {
      filters.push({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    if (validatedArgs.ability_score && validatedArgs.ability_score.length > 0) {
      filters.push({ 'ability_score.index': { $in: validatedArgs.ability_score } })
    }

    if (filters.length > 0) {
      query.where({ $and: filters })
    }

    const sortQuery = buildSortPipeline<SkillOrderField>({
      order: validatedArgs.order,
      sortFieldMap: SKILL_SORT_FIELD_MAP,
      defaultSortField: SkillOrderField.NAME
    })

    if (Object.keys(sortQuery).length > 0) {
      query.sort(sortQuery)
    }

    if (validatedArgs.skip !== undefined) {
      query.skip(validatedArgs.skip)
    }
    if (validatedArgs.limit !== undefined) {
      query.limit(validatedArgs.limit)
    }

    return query.lean()
  }

  @Query(() => Skill, { nullable: true, description: 'Gets a single skill by index.' })
  async skill(@Arg('index', () => String) indexInput: string): Promise<Skill | null> {
    const { index } = SkillIndexArgsSchema.parse({ index: indexInput })
    return SkillModel.findOne({ index }).lean()
  }

  @FieldResolver(() => AbilityScore)
  async ability_score(@Root() skill: Skill): Promise<AbilityScore | null> {
    return resolveSingleReference(skill.ability_score, AbilityScoreModel)
  }
}
