import { Resolver } from 'type-graphql'

import { createResolver } from '@/graphql/common/createResolver'
import { inFilter, numberFilter, regexFilter } from '@/graphql/common/filters'
import Poison2024Model, { Poison2024 } from '@/models/2024/poison'

import { PoisonArgs, PoisonArgsSchema } from './args'

@Resolver(Poison2024)
export class PoisonResolver extends createResolver({
  Type: Poison2024,
  Model: Poison2024Model,
  typeName: 'Poison',
  enumTypeName: 'Poison2024',
  singular: 'poison',
  plural: 'poisons',
  descriptions: {
    fields: 'Fields to sort 2024 Poisons by',
    order: 'Specify sorting order for 2024 poisons.',
    list: 'Gets all 2024 poisons, optionally filtered and sorted.',
    single: 'Gets a single 2024 poison by index.'
  },
  orderFields: {
    NAME: { value: 'name', path: 'name' },
    COST: { value: 'cost', path: 'cost' },
    TYPE: { value: 'type', path: 'type' }
  },
  defaultSort: 'NAME',
  Args: PoisonArgs,
  argsSchema: PoisonArgsSchema,
  filters: (a) => [
    regexFilter('name', a.name),
    inFilter('type', a.type),
    numberFilter('cost', a.cost)
  ]
}) {}
