import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { IEquipment } from '@/graphql/2014/common/interfaces'
import { EquipmentCategory } from '@/models/2014/equipmentCategory'
import { APIReference } from '@/models/common/apiReference'
import { Damage } from '@/models/common/damage'
import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({ description: 'Details about armor class.' })
export class ArmorClass {
  @field(T.Int, { description: 'Base armor class value.', required: true, index: true })
  public base!: number

  @field(T.Bool, {
    description: 'Indicates if Dexterity bonus applies.',
    required: true,
    index: true
  })
  public dex_bonus!: boolean

  @field(T.Int, {
    description: 'Maximum Dexterity bonus allowed.',
    index: true,
    gql: { nullable: true }
  })
  public max_bonus?: number
}

@ObjectType({ description: 'An item and its quantity within a container or bundle.' })
export class Content {
  // Handled by ContentFieldResolver
  @field(T.Model(() => APIReference), { gql: false })
  public item!: APIReference

  @field(T.Int, { description: 'The quantity of the item.', required: true, index: true })
  public quantity!: number
}

@ObjectType({ description: 'Cost of an item in coinage.' })
export class Cost {
  @field(T.Int, { description: 'The quantity of coins.', required: true, index: true })
  public quantity!: number

  @field(T.String, {
    description: 'The unit of coinage (e.g., gp, sp, cp).',
    required: true,
    index: true
  })
  public unit!: string
}

@ObjectType({ description: 'Range of a weapon (normal and long).' })
export class Range {
  @field(T.Int, {
    description: 'The long range of the weapon.',
    index: true,
    gql: { nullable: true }
  })
  public long?: number

  @field(T.Int, { description: 'The normal range of the weapon.', required: true, index: true })
  public normal!: number
}

@ObjectType({ description: 'Speed of a mount or vehicle.' })
export class Speed {
  @field(T.Float, { description: 'The speed quantity.', required: true, index: true })
  public quantity!: number

  @field(T.String, {
    description: 'The unit of speed (e.g., ft./round).',
    required: true,
    index: true
  })
  public unit!: string
}

@ObjectType({ description: 'Range for a thrown weapon.' })
export class ThrowRange {
  @field(T.Int, { description: 'The long range when thrown.', required: true, index: true })
  public long!: number

  @field(T.Int, { description: 'The normal range when thrown.', required: true, index: true })
  public normal!: number
}

@ObjectType({
  description: 'Base Equipment class for common fields, potentially used in Unions.'
})
@srdModelOptions('2014-equipment')
export class Equipment implements IEquipment {
  // General fields

  @field(T.String, {
    description: 'The unique identifier for this equipment.',
    required: true,
    index: true
  })
  public index!: string

  @field(T.String, { description: 'The name of the equipment.', required: true, index: true })
  public name!: string

  @field(T.List(T.String), {
    description: 'Description of the equipment.',
    required: true,
    index: true,
    gql: { nullable: true }
  })
  public desc?: string[]

  @field(T.Ref(() => EquipmentCategory), { description: 'The category this equipment belongs to.' })
  public equipment_category!: APIReference

  @field(T.RefList(() => EquipmentCategory), {
    description: 'All categories this equipment belongs to.'
  })
  public equipment_categories!: APIReference[]

  @field(T.Ref(() => EquipmentCategory), {
    description: 'Category if the equipment is gear.',
    gql: { nullable: true }
  })
  public gear_category?: APIReference

  @field(T.Model(() => Cost), { description: 'Cost of the equipment in coinage.' })
  public cost!: Cost

  @field(T.Float, {
    description: 'Weight of the equipment in pounds.',
    index: true,
    gql: { nullable: true }
  })
  public weight?: number

  // Specific fields
  @field(T.String, { index: true, gql: false })
  public armor_category?: string

  @field(T.Model(() => ArmorClass), { gql: false })
  public armor_class?: ArmorClass

  @field(T.String, { index: true, gql: false })
  public capacity?: string

  @field(T.String, { index: true, gql: false })
  public category_range?: string

  @field(T.List(() => Content), { gql: false })
  public contents?: Content[]

  @field(T.Model(() => Damage), { gql: false })
  public damage?: Damage

  @field(T.String, { index: true, gql: false })
  public image?: string

  @field(T.List(() => APIReference), { gql: false })
  public properties?: APIReference[]

  @field(T.Model(() => Number), { index: true, gql: false })
  public quantity?: number

  @field(T.Model(() => Range), { gql: false })
  public range?: Range

  @field(T.List(T.String), { index: true, gql: false })
  public special?: string[]

  @field(T.Model(() => Speed), { gql: false })
  public speed?: Speed

  @field(T.Bool, { index: true, gql: false })
  public stealth_disadvantage?: boolean

  @field(T.Model(() => Number), { index: true, gql: false })
  public str_minimum?: number

  @field(T.Model(() => ThrowRange), { gql: false })
  public throw_range?: ThrowRange

  @field(T.String, { index: true, gql: false })
  public tool_category?: string

  @field(T.Model(() => Damage), { gql: false })
  public two_handed_damage?: Damage

  @field(T.String, { required: true, index: true, gql: false })
  public url!: string

  @field(T.String, { index: true, gql: false })
  public vehicle_category?: string

  @field(T.String, { index: true, gql: false })
  public weapon_category?: string

  @field(T.String, { index: true, gql: false })
  public weapon_range?: string

  @field(T.String, { description: 'Timestamp of the last update.', required: true, index: true })
  public updated_at!: string
}

export type EquipmentDocument = DocumentType<Equipment>
const EquipmentModel = getModelForClass(Equipment)

export default EquipmentModel
