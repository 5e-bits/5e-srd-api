import { Field, Int, ObjectType } from 'type-graphql'

import { ArmorClass, Content, Equipment, Range, Speed, ThrowRange } from '@/models/2014/equipment'
import { WeaponProperty } from '@/models/2014/weaponProperty'
import { APIReference } from '@/models/common/apiReference'
import { Damage } from '@/models/common/damage'

import { IEquipment } from './interfaces'

@ObjectType({ description: 'Represents Armor equipment', implements: IEquipment })
export class Armor extends Equipment {
  @Field(() => String, { description: 'Category of armor (e.g., Light, Medium, Heavy).' })
  declare armor_category: string

  @Field(() => ArmorClass, { description: 'Armor export Class details for this armor.' })
  declare armor_class: ArmorClass

  @Field(() => Int, {
    nullable: true,
    description: 'Minimum Strength score required to use this armor effectively.'
  })
  declare str_minimum?: number

  @Field(() => Boolean, {
    nullable: true,
    description: 'Whether wearing the armor imposes disadvantage on Stealth checks.'
  })
  declare stealth_disadvantage?: boolean
}

@ObjectType({ description: 'Represents Weapon equipment', implements: IEquipment })
export class Weapon extends Equipment {
  @Field(() => String, { description: 'Category of weapon (e.g., Simple, Martial).' })
  declare weapon_category: string

  @Field(() => String, { description: 'Range classification of weapon (e.g., Melee, Ranged).' })
  declare weapon_range: string

  @Field(() => String, { description: 'Range category for weapons (e.g., Melee, Ranged).' })
  declare category_range: string

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

  @Field(() => [WeaponProperty], { nullable: true, description: 'Properties of the weapon.' })
  declare properties?: APIReference[] // Resolved externally
}

@ObjectType({ description: 'Represents Tool equipment', implements: IEquipment })
export class Tool extends Equipment {
  @Field(() => String, { description: "Category of tool (e.g., Artisan's Tools, Gaming Set)." })
  declare tool_category: string
}

@ObjectType({ description: 'Represents Gear equipment (general purpose)', implements: IEquipment })
export class Gear extends Equipment {}

@ObjectType({
  description: "Represents Gear that contains other items (e.g., Explorer's Pack)",
  implements: IEquipment
})
export class Pack extends Gear {
  @Field(() => [Content], { nullable: true, description: 'Items contained within the pack.' })
  declare contents?: Content[]
}

@ObjectType({ description: 'Represents Ammunition equipment', implements: IEquipment })
export class Ammunition extends Gear {
  @Field(() => Int, { description: 'Quantity of ammunition in the bundle.' })
  declare quantity: number
}

@ObjectType({ description: 'Represents Vehicle equipment', implements: IEquipment })
export class Vehicle extends Equipment {
  @Field(() => String, { description: 'Category of vehicle (e.g., Ship, Land).' })
  declare vehicle_category: string

  @Field(() => Speed, { nullable: true, description: 'Movement speed of the vehicle.' })
  declare speed?: Speed

  @Field(() => String, { nullable: true, description: 'Carrying capacity of the vehicle.' })
  declare capacity?: string
}
