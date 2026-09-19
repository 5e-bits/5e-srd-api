import { Resolver } from 'type-graphql'

import { createResolver } from '@/graphql/common/createResolver'
import DamageTypeModel, { DamageType2024 } from '@/models/2024/damageType'

@Resolver(DamageType2024)
export class DamageTypeResolver extends createResolver({
  Type: DamageType2024,
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
