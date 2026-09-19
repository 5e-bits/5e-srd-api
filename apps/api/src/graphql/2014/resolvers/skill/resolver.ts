import { FieldResolver, Resolver, Root } from 'type-graphql'

import { createResolver } from '@/graphql/common/createResolver'
import { inFilter, regexFilter } from '@/graphql/common/filters'
import { resolveSingleReference } from '@/graphql/utils/resolvers'
import AbilityScoreModel, { AbilityScore } from '@/models/2014/abilityScore'
import SkillModel, { Skill } from '@/models/2014/skill'

import { SkillArgs, SkillArgsSchema } from './args'

@Resolver(Skill)
export class SkillResolver extends createResolver({
  Type: Skill,
  Model: SkillModel,
  typeName: 'Skill',
  singular: 'skill',
  plural: 'skills',
  descriptions: {
    fields: 'Fields to sort Skills by',
    order: 'Specify sorting order for skills.',
    list: 'Gets all skills, optionally filtered by name and sorted by name.',
    single: 'Gets a single skill by index.'
  },
  orderFields: {
    NAME: { value: 'name', path: 'name' },
    ABILITY_SCORE: { value: 'ability_score', path: 'ability_score.name' }
  },
  defaultSort: 'NAME',
  Args: SkillArgs,
  argsSchema: SkillArgsSchema,
  filters: (a) => [regexFilter('name', a.name), inFilter('ability_score.index', a.ability_score)]
}) {
  @FieldResolver(() => AbilityScore)
  async ability_score(@Root() skill: Skill): Promise<AbilityScore | null> {
    return resolveSingleReference(skill.ability_score, AbilityScoreModel)
  }
}
