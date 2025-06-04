import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, Float, Int, ObjectType } from 'type-graphql'

import { IEquipment } from '@/graphql/2014/common/interfaces'
import { EquipmentCategory } from '@/models/2014/equipmentCategory'
import { APIReference } from '@/models/common/apiReference'
import { Damage } from '@/models/common/damage'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({ description: 'Details about armor class.' })
export class ArmorClass {
  @Field(() => Int, { description: 'Base armor class value.' })
  @prop({ required: true, index: true, type: () => Number })
  public base!: number

  @Field(() => Boolean, { description: 'Indicates if Dexterity bonus applies.' })
  @prop({ required: true, index: true, type: () => Boolean })
  public dex_bonus!: boolean

  @Field(() => Int, { nullable: true, description: 'Maximum Dexterity bonus allowed.' })
  @prop({ index: true, type: () => Number })
  public max_bonus?: number
}

@ObjectType({ description: 'An item and its quantity within a container or bundle.' })
export class Content {
  // Handled by ContentFieldResolver
  @prop({ type: () => APIReference })
  public item!: APIReference

  @Field(() => Int, { description: 'The quantity of the item.' })
  @prop({ required: true, index: true, type: () => Number })
  public quantity!: number
}

@ObjectType({ description: 'Cost of an item in coinage.' })
export class Cost {
  @Field(() => Int, { description: 'The quantity of coins.' })
  @prop({ required: true, index: true, type: () => Number })
  public quantity!: number

  @Field(() => String, { description: 'The unit of coinage (e.g., gp, sp, cp).' })
  @prop({ required: true, index: true, type: () => String })
  public unit!: string
}

@ObjectType({ description: 'Range of a weapon (normal and long).' })
export class Range {
  @Field(() => Int, { nullable: true, description: 'The long range of the weapon.' })
  @prop({ index: true, type: () => Number })
  public long?: number

  @Field(() => Int, { description: 'The normal range of the weapon.' })
  @prop({ required: true, index: true, type: () => Number })
  public normal!: number
}

@ObjectType({ description: 'Speed of a mount or vehicle.' })
export class Speed {
  @Field(() => Float, { description: 'The speed quantity.' })
  @prop({ required: true, index: true, type: () => Number })
  public quantity!: number

  @Field(() => String, { description: 'The unit of speed (e.g., ft./round).' })
  @prop({ required: true, index: true, type: () => String })
  public unit!: string
}

@ObjectType({ description: 'Range for a thrown weapon.' })
export class ThrowRange {
  @Field(() => Int, { description: 'The long range when thrown.' })
  @prop({ required: true, index: true, type: () => Number })
  public long!: number

  @Field(() => Int, { description: 'The normal range when thrown.' })
  @prop({ required: true, index: true, type: () => Number })
  public normal!: number
}

@ObjectType({
  description: 'Base Equipment class for common fields, potentially used in Unions.'
})
@srdModelOptions('2014-equipment')
export class Equipment implements IEquipment {
  // General fields

  @Field(() => String, { description: 'The unique identifier for this equipment.' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'The name of the equipment.' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => [String], { nullable: true, description: 'Description of the equipment.' })
  @prop({ required: true, index: true, type: () => [String] })
  public desc?: string[]

  @Field(() => EquipmentCategory, { description: 'The category this equipment belongs to.' })
  @prop({ type: () => APIReference })
  public equipment_category!: APIReference

  @Field(() => EquipmentCategory, {
    nullable: true,
    description: 'Category if the equipment is gear.'
  })
  @prop({ type: () => APIReference })
  public gear_category?: APIReference

  @Field(() => Cost, { description: 'Cost of the equipment in coinage.' })
  @prop({ type: () => Cost })
  public cost!: Cost

  @Field(() => Float, { nullable: true, description: 'Weight of the equipment in pounds.' })
  @prop({ index: true, type: () => Number })
  public weight?: number

  // Specific fields
  @prop({ index: true, type: () => String })
  public armor_category?: string

  @prop({ type: () => ArmorClass })
  public armor_class?: ArmorClass

  @prop({ index: true, type: () => String })
  public capacity?: string

  @prop({ index: true, type: () => String })
  public category_range?: string

  @prop({ type: () => [Content] })
  public contents?: Content[]

  @prop({ type: () => Damage })
  public damage?: Damage

  @prop({ index: true, type: () => String })
  public image?: string

  @prop({ type: () => [APIReference] })
  public properties?: APIReference[]

  @prop({ index: true, type: () => Number })
  public quantity?: number

  @prop({ type: () => Range })
  public range?: Range

  @prop({ index: true, type: () => [String] })
  public special?: string[]

  @prop({ type: () => Speed })
  public speed?: Speed

  @prop({ index: true, type: () => Boolean })
  public stealth_disadvantage?: boolean

  @prop({ index: true, type: () => Number })
  public str_minimum?: number

  @prop({ type: () => ThrowRange })
  public throw_range?: ThrowRange

  @prop({ index: true, type: () => String })
  public tool_category?: string

  @prop({ type: () => Damage })
  public two_handed_damage?: Damage

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @prop({ index: true, type: () => String })
  public vehicle_category?: string

  @prop({ index: true, type: () => String })
  public weapon_category?: string

  @prop({ index: true, type: () => String })
  public weapon_range?: string

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type EquipmentDocument = DocumentType<Equipment>
const EquipmentModel = getModelForClass(Equipment)

export default EquipmentModel
