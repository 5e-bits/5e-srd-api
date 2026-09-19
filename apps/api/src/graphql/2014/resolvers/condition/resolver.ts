import { Resolver } from 'type-graphql'

import { createResolver } from '@/graphql/common/createResolver'
import ConditionModel, { Condition } from '@/models/2014/condition'

@Resolver(Condition)
export class ConditionResolver extends createResolver({
  Type: Condition,
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
