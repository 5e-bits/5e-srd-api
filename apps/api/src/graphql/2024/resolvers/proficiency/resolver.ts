import { FieldResolver, Resolver, Root } from 'type-graphql'

import { createResolver } from '@/graphql/common/createResolver'
import { inFilter, regexFilter } from '@/graphql/common/filters'
import { resolveMultipleReferences } from '@/graphql/utils/resolvers'
import BackgroundModel, { Background2024 } from '@/models/2024/background'
import ProficiencyModel, { Proficiency2024 } from '@/models/2024/proficiency'

import { ProficiencyArgs, ProficiencyArgsSchema } from './args'

@Resolver(Proficiency2024)
export class ProficiencyResolver extends createResolver({
  Type: Proficiency2024,
  Model: ProficiencyModel,
  typeName: 'Proficiency',
  singular: 'proficiency',
  plural: 'proficiencies',
  descriptions: {
    fields: 'Fields to sort Proficiencies by',
    order: 'Specify sorting order for proficiencies.',
    list: 'Gets all proficiencies, optionally filtered by name and type.',
    single: 'Gets a single proficiency by index.'
  },
  orderFields: {
    NAME: { value: 'name', path: 'name' },
    TYPE: { value: 'type', path: 'type' }
  },
  defaultSort: 'NAME',
  Args: ProficiencyArgs,
  argsSchema: ProficiencyArgsSchema,
  filters: (a) => [regexFilter('name', a.name), inFilter('type', a.type)]
}) {
  @FieldResolver(() => [Background2024])
  async backgrounds(@Root() proficiency: Proficiency2024): Promise<Background2024[]> {
    return resolveMultipleReferences(proficiency.backgrounds, BackgroundModel)
  }
}
