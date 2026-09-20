import { FieldResolver, Resolver, Root } from 'type-graphql'

import { createResolver } from '@/graphql/common/createResolver'
import { regexFilter } from '@/graphql/common/filters'
import { resolveMultipleReferences } from '@/graphql/utils/resolvers'
import AbilityScoreModel, { AbilityScore2024 } from '@/models/2024/abilityScore'
import SkillModel, { Skill2024 } from '@/models/2024/skill'

import { AbilityScoreArgs, AbilityScoreArgsSchema } from './args'

@Resolver(AbilityScore2024)
export class AbilityScoreResolver extends createResolver({
  Type: AbilityScore2024,
  Model: AbilityScoreModel,
  typeName: 'AbilityScore',
  singular: 'abilityScore',
  plural: 'abilityScores',
  descriptions: {
    fields: 'Fields to sort Ability Scores by',
    order: 'Specify sorting order for ability scores.',
    list: 'Gets all ability scores, optionally filtered by name and sorted.',
    single: 'Gets a single ability score by index.'
  },
  orderFields: {
    NAME: { value: 'name', path: 'name' },
    FULL_NAME: { value: 'full_name', path: 'full_name' }
  },
  defaultSort: 'NAME',
  Args: AbilityScoreArgs,
  argsSchema: AbilityScoreArgsSchema,
  filters: (a) => [regexFilter('name', a.name), regexFilter('full_name', a.full_name)]
}) {
  @FieldResolver(() => [Skill2024])
  async skills(@Root() abilityScore: AbilityScore2024): Promise<Skill2024[]> {
    return resolveMultipleReferences(abilityScore.skills, SkillModel)
  }
}
