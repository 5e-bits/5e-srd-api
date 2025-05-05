import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { APIReference } from '@/models/2014/common'
import { srdModelOptions } from '@/util/modelOptions'
import { ObjectType, Field, Float, Int } from 'type-graphql'

// Export nested classes
// TODO: Pass 2/3 - Needs FieldResolver
// @ObjectType({ description: 'Details about armor class.' })
export class ArmorClass {
  // @Field(() => Int, { description: 'Base armor class value.' })
  @prop({ required: true, index: true, type: () => Number })
  public base!: number

  // @Field(() => Boolean, { description: 'Indicates if Dexterity bonus applies.' })
  @prop({ required: true, index: true, type: () => Boolean })
  public dex_bonus!: boolean

  // @Field(() => Int, { nullable: true, description: 'Maximum Dexterity bonus allowed.' })
  @prop({ index: true, type: () => Number })
  public max_bonus?: number
}

// TODO: Pass 2/3 - Needs FieldResolver
// @ObjectType({ description: 'An item and its quantity within a container or bundle.' })
export class Content {
  // @Field(() => APIReference, { description: 'The item contained.' }) // Needs FieldResolver for APIReference
  @prop({ type: () => APIReference })
  public item!: APIReference

  // @Field(() => Int, { description: 'The quantity of the item.' })
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

// TODO: Pass 2/3 - Needs FieldResolver
// @ObjectType({ description: 'Damage dealt by a weapon or item.' })
export class Damage {
  // @Field(() => String, { description: 'Damage roll (e.g., 1d8).' })
  @prop({ required: true, index: true, type: () => String })
  public damage_dice!: string

  // @Field(() => APIReference, { description: 'Type of damage dealt.' }) // Needs FieldResolver for APIReference
  @prop({ type: () => APIReference })
  public damage_type!: APIReference
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

// TODO: Pass 2/3 - Needs FieldResolver
// @ObjectType({ description: 'Damage dealt when using a weapon with two hands.' })
export class TwoHandedDamage {
  // @Field(() => String, { description: 'Damage roll (e.g., 1d10).' })
  @prop({ required: true, index: true, type: () => String })
  public damage_dice!: string

  // @Field(() => APIReference, { description: 'Type of damage dealt.' }) // Needs FieldResolver for APIReference
  @prop({ type: () => APIReference })
  public damage_type!: APIReference
}

@ObjectType({ description: 'An item that can be equipped or used.' })
@srdModelOptions('2014-equipment')
export class Equipment {
  @Field(() => String, {
    nullable: true,
    description: 'Category of armor (e.g., Light, Medium, Heavy).'
  })
  @prop({ index: true, type: () => String })
  public armor_category?: string

  // TODO: Pass 2/3 - Nested object with potential logic
  @prop({ type: () => ArmorClass })
  public armor_class?: ArmorClass

  @Field(() => String, { nullable: true, description: 'Carrying capacity of the item.' })
  @prop({ index: true, type: () => String })
  public capacity?: string

  @Field(() => String, {
    nullable: true,
    description: 'Range category for weapons (e.g., Melee, Ranged).'
  })
  @prop({ index: true, type: () => String })
  public category_range?: string

  // TODO: Pass 2/3 - Array of nested objects with API references
  @prop({ type: () => [Content] })
  public contents?: Content[]

  @Field(() => Cost, { description: 'Cost of the equipment in coinage.' })
  @prop({ type: () => Cost })
  public cost!: Cost

  // TODO: Pass 2/3 - Nested object with API reference
  @prop({ type: () => Damage })
  public damage?: Damage

  @Field(() => [String], { nullable: true, description: 'Description of the equipment.' })
  @prop({ required: true, index: true, type: () => [String] })
  public desc?: string[]

  // TODO: Pass 2/3 - API Reference
  @prop({ type: () => APIReference })
  public equipment_category!: APIReference

  // TODO: Pass 2/3 - API Reference
  @prop({ type: () => APIReference })
  public gear_category?: APIReference

  @Field(() => String, { nullable: true, description: 'URL of an image, if available.' })
  @prop({ index: true, type: () => String })
  public image?: string

  @Field(() => String, { description: 'Unique identifier for this equipment (e.g., club).' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'Name of the equipment (e.g., Club).' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  // TODO: Pass 2/3 - Array of API References
  @prop({ type: () => [APIReference] })
  public properties?: APIReference[]

  @Field(() => Int, { nullable: true, description: 'Quantity if part of a pack or bundle.' })
  @prop({ index: true, type: () => Number })
  public quantity?: number

  @Field(() => Range, { nullable: true, description: 'Weapon range.' })
  @prop({ type: () => Range })
  public range?: Range

  @Field(() => [String], { nullable: true, description: 'Special properties or notes.' })
  @prop({ index: true, type: () => [String] })
  public special?: string[]

  @Field(() => Speed, {
    nullable: true,
    description: 'Movement speed if equipment is a mount or vehicle.'
  })
  @prop({ type: () => Speed })
  public speed?: Speed

  @Field(() => Boolean, {
    nullable: true,
    description: 'Whether wearing the armor imposes disadvantage on Stealth checks.'
  })
  @prop({ index: true, type: () => Boolean })
  public stealth_disadvantage?: boolean

  @Field(() => Int, {
    nullable: true,
    description: 'Minimum Strength score required to use this item effectively.'
  })
  @prop({ index: true, type: () => Number })
  public str_minimum?: number

  @Field(() => ThrowRange, { nullable: true, description: 'Range when thrown.' })
  @prop({ type: () => ThrowRange })
  public throw_range?: ThrowRange

  @Field(() => String, {
    nullable: true,
    description: "Category of tool (e.g., Artisan's Tools, Gaming Set)."
  })
  @prop({ index: true, type: () => String })
  public tool_category?: string

  // TODO: Pass 2/3 - Nested object with API reference
  @prop({ type: () => TwoHandedDamage })
  public two_handed_damage?: TwoHandedDamage

  // TODO: Pass 2/3 - System field, handle later if needed
  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { nullable: true, description: 'Category of vehicle (e.g., Ship, Land).' })
  @prop({ index: true, type: () => String })
  public vehicle_category?: string

  @Field(() => String, {
    nullable: true,
    description: 'Category of weapon (e.g., Simple, Martial).'
  })
  @prop({ index: true, type: () => String })
  public weapon_category?: string

  @Field(() => String, {
    nullable: true,
    description: 'Range classification of weapon (e.g., Melee, Ranged).'
  })
  @prop({ index: true, type: () => String })
  public weapon_range?: string

  @Field(() => Float, { nullable: true, description: 'Weight of the equipment in pounds.' })
  @prop({ index: true, type: () => Number })
  public weight?: number

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type EquipmentDocument = DocumentType<Equipment>
const EquipmentModel = getModelForClass(Equipment)

export default EquipmentModel
