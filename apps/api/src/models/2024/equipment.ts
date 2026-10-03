import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { EquipmentCategory2024 } from '@/models/2024/equipmentCategory'
import { APIReference } from '@/models/common/apiReference'
import { Damage } from '@/models/common/damage'
import { DifficultyClass } from '@/models/common/difficultyClass'
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

@ObjectType({ description: 'Range for a thrown weapon.' })
export class ThrowRange {
  @field(T.Int, { description: 'The long range when thrown.', required: true, index: true })
  public long!: number

  @field(T.Int, { description: 'The normal range when thrown.', required: true, index: true })
  public normal!: number
}

@ObjectType({ description: 'How to utilize a tool.' })
export class Utilize {
  @field(T.String, { description: 'The name of the action.', required: true, index: true })
  public name!: string

  @field(T.Model(() => DifficultyClass), { description: 'The DC of the action.' })
  public dc!: DifficultyClass
}

@ObjectType({
  description: 'Base Equipment class for common fields, potentially used in Unions.'
})
@srdModelOptions('2024-equipment')
export class Equipment2024 {
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
  public description?: string[]

  @field(T.RefList(() => EquipmentCategory2024), {
    description: 'The categories this equipment belongs to.'
  })
  public equipment_categories!: APIReference[]

  @field(T.Model(() => APIReference), { index: true, gql: false })
  public ammunition?: APIReference

  @field(T.Model(() => ArmorClass), { gql: false })
  public armor_class?: ArmorClass

  @field(T.List(() => Content), { gql: false })
  public contents?: Content[]

  @field(T.Ref(() => Equipment2024), {
    description: 'The equipment this item is contained in.',
    gql: { nullable: true }
  })
  public storage?: APIReference

  @field(T.Model(() => Cost), { description: 'Cost of the equipment in coinage.' })
  public cost!: Cost

  @field(T.Float, {
    description: 'Weight of the equipment in pounds.',
    index: true,
    gql: { nullable: true }
  })
  public weight?: number

  @field(T.Model(() => APIReference), { index: true, gql: false })
  public ability?: APIReference

  @field(T.List(() => APIReference), { index: true, gql: false })
  public craft?: APIReference[]

  @field(T.Model(() => Damage), { gql: false })
  public damage?: Damage

  @field(T.String, { index: true, gql: false })
  public doff_time?: string

  @field(T.String, { index: true, gql: false })
  public don_time?: string

  @field(T.String, { index: true, gql: false })
  public image?: string

  @field(T.Model(() => APIReference), { index: true, gql: false })
  public mastery?: APIReference

  @field(T.List(T.String), { index: true, gql: false })
  public notes?: string[]

  @field(T.List(() => APIReference), { gql: false })
  public properties?: APIReference[]

  @field(T.Model(() => Number), { index: true, gql: false })
  public quantity?: number

  @field(T.Model(() => Range), { gql: false })
  public range?: Range

  @field(T.Bool, { index: true, gql: false })
  public stealth_disadvantage?: boolean

  @field(T.Model(() => Number), { index: true, gql: false })
  public str_minimum?: number

  @field(T.Model(() => ThrowRange), { gql: false })
  public throw_range?: ThrowRange

  @field(T.Model(() => Damage), { gql: false })
  public two_handed_damage?: Damage

  @field(T.List(() => Utilize), { index: true, gql: false })
  public utilize?: Utilize[]

  @field(T.String, { required: true, index: true, gql: false })
  public url!: string

  @field(T.String, { description: 'Timestamp of the last update.', required: true, index: true })
  public updated_at!: string
}

export type EquipmentDocument = DocumentType<Equipment2024>
const EquipmentModel = getModelForClass(Equipment2024)

export default EquipmentModel
