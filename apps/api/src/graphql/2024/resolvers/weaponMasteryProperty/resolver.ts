import { Resolver } from 'type-graphql'

import { createResolver } from '@/graphql/common/createResolver'
import WeaponMasteryPropertyModel, {
  WeaponMasteryProperty2024
} from '@/models/2024/weaponMasteryProperty'

@Resolver(WeaponMasteryProperty2024)
export class WeaponMasteryPropertyResolver extends createResolver({
  Type: WeaponMasteryProperty2024,
  Model: WeaponMasteryPropertyModel,
  typeName: 'WeaponMasteryProperty',
  singular: 'weaponMasteryProperty',
  plural: 'weaponMasteryProperties',
  descriptions: {
    fields: 'Fields to sort Weapon Mastery Properties by',
    order: 'Specify sorting order for weapon mastery properties.',
    list: 'Gets all weapon mastery properties, optionally filtered by name and sorted by name.',
    single: 'Gets a single weapon mastery property by index.'
  }
}) {}
