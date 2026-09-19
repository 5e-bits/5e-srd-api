import { Resolver } from 'type-graphql'

import { createResolver } from '@/graphql/common/createResolver'
import ConditionModel, { Condition2024 } from '@/models/2024/condition'

@Resolver(Condition2024)
export class ConditionResolver extends createResolver({
  Type: Condition2024,
  Model: ConditionModel,
  typeName: 'Condition',
  singular: 'condition',
  plural: 'conditions',
  descriptions: {
    fields: 'Fields to sort Conditions by',
    order: 'Specify sorting order for conditions.',
    list: 'Gets all conditions, optionally filtered by name and sorted by name.',
    single: 'Gets a single condition by index.'
  }
}) {}
