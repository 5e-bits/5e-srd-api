import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, Float, Int, ObjectType } from 'type-graphql'

import { EquipmentCategory2024 } from '@/models/2024/equipmentCategory'
import { APIReference } from '@/models/common/apiReference'
import { Damage } from '@/models/common/damage'
import { DifficultyClass } from '@/models/common/difficultyClass'
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

@ObjectType({ description: 'Range for a thrown weapon.' })
export class ThrowRange {
  @Field(() => Int, { description: 'The long range when thrown.' })
  @prop({ required: true, index: true, type: () => Number })
  public long!: number

  @Field(() => Int, { description: 'The normal range when thrown.' })
  @prop({ required: true, index: true, type: () => Number })
  public normal!: number
}

@ObjectType({ description: 'How to utilize a tool.' })
export class Utilize {
  @Field(() => String, { description: 'The name of the action.' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => DifficultyClass, { description: 'The DC of the action.' })
  @prop({ type: () => DifficultyClass })
  public dc!: DifficultyClass
}

@ObjectType({
  description: 'Base Equipment class for common fields, potentially used in Unions.'
})
@srdModelOptions('2024-equipment')
export class Equipment2024 {
  // General fields

  @Field(() => String, { description: 'The unique identifier for this equipment.' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'The name of the equipment.' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => [String], { nullable: true, description: 'Description of the equipment.' })
  @prop({ required: true, index: true, type: () => [String] })
  public description?: string[]

  @Field(() => [EquipmentCategory2024], {
    description: 'The categories this equipment belongs to.'
  })
  @prop({ type: () => [APIReference] })
  public equipment_categories!: APIReference[]

  @prop({ index: true, type: () => APIReference })
  public ammunition?: APIReference

  @prop({ type: () => ArmorClass })
  public armor_class?: ArmorClass

  @prop({ type: () => [Content] })
  public contents?: Content[]

  @Field(() => Cost, { description: 'Cost of the equipment in coinage.' })
  @prop({ type: () => Cost })
  public cost!: Cost

  @Field(() => Float, { nullable: true, description: 'Weight of the equipment in pounds.' })
  @prop({ index: true, type: () => Number })
  public weight?: number

  @prop({ index: true, type: () => APIReference })
  public ability?: APIReference

  @prop({ index: true, type: () => [APIReference] })
  public craft?: APIReference[]

  @prop({ type: () => Damage })
  public damage?: Damage

  @prop({ index: true, type: () => String })
  public doff_time?: string

  @prop({ index: true, type: () => String })
  public don_time?: string

  @prop({ index: true, type: () => String })
  public image?: string

  @prop({ index: true, type: () => APIReference })
  public mastery?: APIReference

  @prop({ index: true, type: () => [String] })
  public notes?: string[]

  @prop({ type: () => [APIReference] })
  public properties?: APIReference[]

  @prop({ index: true, type: () => Number })
  public quantity?: number

  @prop({ type: () => Range })
  public range?: Range

  @prop({ index: true, type: () => Boolean })
  public stealth_disadvantage?: boolean

  @prop({ index: true, type: () => Number })
  public str_minimum?: number

  @prop({ type: () => ThrowRange })
  public throw_range?: ThrowRange

  @prop({ type: () => Damage })
  public two_handed_damage?: Damage

  @prop({ index: true, type: () => [Utilize] })
  public utilize?: Utilize[]

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type EquipmentDocument = DocumentType<Equipment2024>
const EquipmentModel = getModelForClass(Equipment2024)

export default EquipmentModel
