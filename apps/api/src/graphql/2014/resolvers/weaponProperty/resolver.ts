import { Resolver } from 'type-graphql'

import { createResolver } from '@/graphql/common/createResolver'
import WeaponPropertyModel, { WeaponProperty } from '@/models/2014/weaponProperty'

@Resolver(WeaponProperty)
export class WeaponPropertyResolver extends createResolver({
  Type: WeaponProperty,
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
