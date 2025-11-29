import { Field, Int, ObjectType } from 'type-graphql'

import { AbilityScore2024 } from '@/models/2024/abilityScore'
import {
  ArmorClass,
  Content,
  Equipment2024,
  Range,
  ThrowRange,
  Utilize
} from '@/models/2024/equipment'
import { WeaponProperty2024 } from '@/models/2024/weaponProperty'
import { APIReference } from '@/models/common/apiReference'
import { Damage } from '@/models/common/damage'

import { IEquipment } from './interfaces'
import { AnyEquipment } from './unions'

@ObjectType({ description: 'Represents Armor equipment', implements: IEquipment })
export class Armor extends Equipment2024 {
  @Field(() => ArmorClass, { description: 'Armor export Class details for this armor.' })
  declare armor_class: ArmorClass

  @Field(() => String, { description: 'Time to doff the armor.' })
  declare doff_time: string

  @Field(() => String, { description: 'Time to don the armor.' })
  declare don_time: string

  @Field(() => Int, {
    nullable: true,
    description: 'Minimum Strength score required to use this armor effectively.'
  })
  declare str_minimum: number

  @Field(() => Boolean, {
    nullable: true,
    description: 'Whether wearing the armor imposes disadvantage on Stealth checks.'
  })
  declare stealth_disadvantage: boolean
}

@ObjectType({ description: 'Represents Weapon equipment', implements: IEquipment })
export class Weapon extends Equipment2024 {
  @Field(() => Damage, { nullable: true, description: 'Primary damage dealt by the weapon.' })
  declare damage?: Damage

  @Field(() => Damage, {
    nullable: true,
    description: 'Damage dealt when using the weapon with two hands.'
  })
  declare two_handed_damage?: Damage

  @Field(() => Range, { nullable: true, description: 'Weapon range details.' })
  declare range?: Range

  @Field(() => ThrowRange, { nullable: true, description: 'Range when the weapon is thrown.' })
  declare throw_range?: ThrowRange

  @Field(() => [WeaponProperty2024], { nullable: true, description: 'Properties of the weapon.' })
  declare properties?: APIReference[] // Resolved externally
}

@ObjectType({ description: 'Represents Gear equipment (general purpose)', implements: IEquipment })
export class AdventuringGear extends Equipment2024 {}

@ObjectType({
  description: "Represents Gear that contains other items (e.g., Explorer's Pack)",
  implements: IEquipment
})
export class Pack extends AdventuringGear {
  @Field(() => [Content], { nullable: true, description: 'Items contained within the pack.' })
  declare contents?: Content[]
}

@ObjectType({ description: 'Represents Ammunition equipment', implements: IEquipment })
export class Ammunition extends AdventuringGear {
  @Field(() => Int, { description: 'Quantity of ammunition in the bundle.' })
  declare quantity: number

  @Field(() => Equipment2024, { nullable: true, description: 'Storage of the ammunition.' })
  declare storage?: APIReference
}

@ObjectType({ description: 'Represents Tool equipment', implements: IEquipment })
export class Tool extends Equipment2024 {
  @Field(() => AbilityScore2024, {
    nullable: true,
    description: 'Ability score required to use the tool.'
  })
  declare ability?: APIReference

  @Field(() => [AnyEquipment], {
    nullable: true,
    description: 'Equipment that can be crafted with the tool.'
  })
  declare craft?: APIReference[]

  @Field(() => [Utilize], { nullable: true, description: 'How to utilize the tool.' })
  declare utilize?: Utilize[]
}
