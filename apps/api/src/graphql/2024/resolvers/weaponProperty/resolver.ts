import { Resolver } from 'type-graphql'

import { createResolver } from '@/graphql/common/createResolver'
import WeaponPropertyModel, { WeaponProperty2024 } from '@/models/2024/weaponProperty'

@Resolver(WeaponProperty2024)
export class WeaponPropertyResolver extends createResolver({
  Type: WeaponProperty2024,
  Model: WeaponPropertyModel,
  typeName: 'WeaponProperty',
  singular: 'weaponProperty',
  plural: 'weaponProperties',
  descriptions: {
    fields: 'Fields to sort Weapon Properties by',
    order: 'Specify sorting order for weapon properties.',
    list: 'Gets all weapon properties, optionally filtered by name and sorted by name.',
    single: 'Gets a single weapon property by index.'
  }
}) {}
