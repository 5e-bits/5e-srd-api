import { Resolver } from 'type-graphql'

import { createResolver } from '@/graphql/common/createResolver'
import DamageTypeModel, { DamageType } from '@/models/2014/damageType'

@Resolver(DamageType)
export class DamageTypeResolver extends createResolver({
  Type: DamageType,
  Model: DamageTypeModel,
  typeName: 'DamageType',
  singular: 'damageType',
  plural: 'damageTypes',
  descriptions: {
    fields: 'Fields to sort Damage Types by',
    order: 'Specify sorting order for damage types.',
    list: 'Gets all damage types, optionally filtered by name and sorted by name.',
    single: 'Gets a single damage type by index.'
  }
}) {}
