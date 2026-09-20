import { FieldResolver, Resolver, Root } from 'type-graphql'

import { createResolver } from '@/graphql/common/createResolver'
import { regexFilter } from '@/graphql/common/filters'
import { resolveMultipleReferences } from '@/graphql/utils/resolvers'
import AbilityScoreModel, { AbilityScore } from '@/models/2014/abilityScore'
import SkillModel, { Skill } from '@/models/2014/skill'

import { AbilityScoreArgs, AbilityScoreArgsSchema } from './args'

@Resolver(AbilityScore)
export class AbilityScoreResolver extends createResolver({
  Type: AbilityScore,
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
  @FieldResolver(() => [Skill])
  async skills(@Root() abilityScore: AbilityScore): Promise<Skill[]> {
    return resolveMultipleReferences(abilityScore.skills, SkillModel)
  }
}
