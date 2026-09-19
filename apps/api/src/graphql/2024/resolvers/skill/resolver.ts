import { FieldResolver, Resolver, Root } from 'type-graphql'

import { createResolver } from '@/graphql/common/createResolver'
import { inFilter, regexFilter } from '@/graphql/common/filters'
import { resolveSingleReference } from '@/graphql/utils/resolvers'
import AbilityScoreModel, { AbilityScore2024 } from '@/models/2024/abilityScore'
import SkillModel, { Skill2024 } from '@/models/2024/skill'

import { SkillArgs, SkillArgsSchema } from './args'

@Resolver(Skill2024)
export class SkillResolver extends createResolver({
  Type: Skill2024,
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
  @FieldResolver(() => AbilityScore2024)
  async ability_score(@Root() skill: Skill2024): Promise<AbilityScore2024 | null> {
    return resolveSingleReference(skill.ability_score, AbilityScoreModel)
  }
}
