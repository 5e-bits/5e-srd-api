import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { IEquipment } from '@/graphql/2014/common/interfaces'
import { EquipmentCategory } from '@/models/2014/equipmentCategory'
import { APIReference } from '@/models/common/apiReference'
import { Damage } from '@/models/common/damage'
import { field, T } from '@/util/fieldDectorator'
import { srdModelOptions } from '@/util/modelOptions'

import { WeaponProperty } from './weaponProperty'

@ObjectType({ description: 'Details about armor class.' })
export class ArmorClass {
  @field(() => T.Int, { description: 'Base armor class value.' })
  public base!: number

  @field(() => T.Bool, { description: 'Indicates if Dexterity bonus applies.' })
  public dex_bonus!: boolean

  @field(() => T.Int, { description: 'Maximum Dexterity bonus allowed.', optional: true })
  public max_bonus?: number
}

@ObjectType({ description: 'An item and its quantity within a container or bundle.' })
export class Content {
  // Handled by ContentFieldResolver
  @field(() => T.Ref(Equipment), { skipResolver: true })
  public item!: APIReference

  @field(() => T.Int, { description: 'The quantity of the item.' })
  public quantity!: number
}

@ObjectType({ description: 'Cost of an item in coinage.' })
export class Cost {
  @field(() => T.Int, { description: 'The quantity of coins.' })
  public quantity!: number

  @field(() => T.String, { description: 'The unit of coinage (e.g., gp, sp, cp).' })
  public unit!: string
}

@ObjectType({ description: 'Range of a weapon (normal and long).' })
export class Range {
  @field(() => T.Int, { description: 'The long range of the weapon.', optional: true })
  public long?: number

  @field(() => T.Int, { description: 'The normal range of the weapon.' })
  public normal!: number
}

@ObjectType({ description: 'Speed of a mount or vehicle.' })
export class Speed {
  @field(() => T.Float, { description: 'The speed quantity.' })
  public quantity!: number

  @field(() => T.String, { description: 'The unit of speed (e.g., ft./round).' })
  public unit!: string
}

@ObjectType({ description: 'Range for a thrown weapon.' })
export class ThrowRange {
  @field(() => T.Int, { description: 'The long range when thrown.' })
  public long!: number

  @field(() => T.Int, { description: 'The normal range when thrown.' })
  public normal!: number
}

@ObjectType({
  description: 'Base Equipment class for common fields, potentially used in Unions.'
})
@srdModelOptions('2014-equipment')
export class Equipment implements IEquipment {
  // General fields

  @field(() => T.String, { description: 'The unique identifier for this equipment.' })
  public index!: string

  @field(() => T.String, { description: 'The name of the equipment.' })
  public name!: string

  @field(() => T.List(String), { description: 'Description of the equipment.', optional: true })
  public desc?: string[]

  @field(() => T.Ref(EquipmentCategory), { description: 'The category this equipment belongs to.' })
  public equipment_category!: APIReference

  @field(() => T.Ref(EquipmentCategory), {
    description: 'Category if the equipment is gear.',
    optional: true
  })
  public gear_category?: APIReference

  @field(() => T.Model(Cost), { description: 'Cost of the equipment in coinage.' })
  public cost!: Cost

  @field(() => T.Float, { description: 'Weight of the equipment in pounds.', optional: true })
  public weight?: number

  @field(() => T.String, { description: 'The canonical path of this resource in the REST API.' })
  public url!: string

  @field(() => T.String, { description: 'Timestamp of the last update.' })
  public updated_at!: string

  // Specific fields
  @field(() => T.String, { skipResolver: true, optional: true })
  public armor_category?: string

  @field(() => T.Model(ArmorClass), { skipResolver: true, optional: true })
  public armor_class?: ArmorClass

  @field(() => T.String, { skipResolver: true, optional: true })
  public capacity?: string

  @field(() => T.String, { skipResolver: true, optional: true })
  public category_range?: string

  @field(() => T.List(Content), { skipResolver: true, optional: true })
  public contents?: Content[]

  @field(() => T.Model(Damage), { skipResolver: true, optional: true })
  public damage?: Damage

  @field(() => T.String, { skipResolver: true, optional: true })
  public image?: string

  @field(() => T.RefList(WeaponProperty), { skipResolver: true, optional: true })
  public properties?: APIReference[]

  @field(() => T.Int, { skipResolver: true, optional: true })
  public quantity?: number

  @field(() => T.Model(Range), { skipResolver: true, optional: true })
  public range?: Range

  @field(() => T.List(String), { skipResolver: true, optional: true })
  public special?: string[]

  @field(() => T.Model(Speed), { skipResolver: true, optional: true })
  public speed?: Speed

  @field(() => T.Bool, { skipResolver: true, optional: true })
  public stealth_disadvantage?: boolean

  @field(() => T.Int, { skipResolver: true, optional: true })
  public str_minimum?: number

  @field(() => T.Model(ThrowRange), { skipResolver: true, optional: true })
  public throw_range?: ThrowRange

  @field(() => T.String, { skipResolver: true, optional: true })
  public tool_category?: string

  @field(() => T.Model(Damage), { skipResolver: true, optional: true })
  public two_handed_damage?: Damage

  @field(() => T.String, { skipResolver: true, optional: true })
  public vehicle_category?: string

  @field(() => T.String, { skipResolver: true, optional: true })
  public weapon_category?: string

  @field(() => T.String, { skipResolver: true, optional: true })
  public weapon_range?: string
}

export type EquipmentDocument = DocumentType<Equipment>
const EquipmentModel = getModelForClass(Equipment)

export default EquipmentModel
