import { getModelForClass, modelOptions, prop, Severity } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { APIReference, AreaOfEffect } from '@/models/2014/common'
import { srdModelOptions } from '@/util/modelOptions'
import { ObjectType, Field, Int } from 'type-graphql'

@ObjectType({ description: 'Details about spell damage' })
@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class SpellDamage {
  // TODO: Pass 2 - API Reference
  @prop({ type: () => APIReference })
  public damage_type?: APIReference

  // TODO: Pass 2/3 - Complex map object
  @prop({ mapProp: true, type: () => Object, default: undefined })
  public damage_at_slot_level?: Record<number, string>

  // TODO: Pass 2/3 - Complex map object
  @prop({ mapProp: true, type: () => Object, default: undefined })
  public damage_at_character_level?: Record<number, string>
}

@ObjectType({ description: "Details about a spell's saving throw" })
export class SpellDC {
  // TODO: Pass 2 - API Reference
  @prop({ type: () => APIReference, required: true })
  public dc_type!: APIReference

  // TODO: Pass 2/3? - Basic field, but part of complex parent
  @prop({ required: true, index: true, type: () => String })
  public dc_success!: string

  // TODO: Pass 2/3? - Basic field, but part of complex parent
  @prop({ index: true, type: () => String })
  public desc?: string
}

@ObjectType({ description: 'Represents a spell in D&D' })
@srdModelOptions('2014-spells')
export class Spell {
  // TODO: Pass 2/3 - Complex nested type (AreaOfEffect)
  @prop({ type: () => AreaOfEffect })
  public area_of_effect?: AreaOfEffect

  @Field(() => String, {
    nullable: true,
    description: 'Type of attack associated with the spell (e.g., Melee, Ranged)'
  })
  @prop({ index: true, type: () => String })
  public attack_type?: string

  @Field(() => String, { description: 'Time required to cast the spell' })
  @prop({ required: true, index: true, type: () => String })
  public casting_time!: string

  // TODO: Pass 2 - API Reference array
  @prop({ type: () => [APIReference], required: true })
  public classes!: APIReference[]

  @Field(() => [String], { description: 'Components required for the spell (V, S, M)' })
  @prop({ type: () => [String], required: true })
  public components!: string[]

  @Field(() => Boolean, { description: 'Indicates if the spell requires concentration' })
  @prop({ index: true, type: () => Boolean })
  public concentration!: boolean

  // TODO: Pass 2/3 - Complex nested type (SpellDamage)
  @prop({ type: () => SpellDamage })
  public damage?: SpellDamage

  // TODO: Pass 2/3 - Complex nested type (SpellDC)
  @prop({ type: () => SpellDC })
  public dc?: SpellDC

  @Field(() => [String], { description: "Description of the spell's effects" })
  @prop({ required: true, index: true, type: () => [String] })
  public desc!: string[]

  @Field(() => String, { description: 'Duration of the spell' })
  @prop({ required: true, index: true, type: () => String })
  public duration!: string

  // TODO: Pass 2/3 - Complex map object
  @prop({ type: () => Object })
  public heal_at_slot_level?: Record<number, string>

  @Field(() => [String], {
    nullable: true,
    description: 'Description of effects when cast at higher levels'
  })
  @prop({ type: () => [String] })
  public higher_level?: string[]

  @Field(() => String, { description: 'Unique identifier for this spell' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => Int, { description: 'Level of the spell (0 for cantrips)' })
  @prop({ required: true, index: true, type: () => Number })
  public level!: number

  @Field(() => String, { nullable: true, description: 'Material components required, if any' })
  @prop({ index: true, type: () => String })
  public material?: string

  @Field(() => String, { description: 'Name of the spell' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => String, { description: 'Range of the spell' })
  @prop({ required: true, index: true, type: () => String })
  public range!: string

  @Field(() => Boolean, { description: 'Indicates if the spell can be cast as a ritual' })
  @prop({ required: true, index: true, type: () => Boolean })
  public ritual!: boolean

  // TODO: Pass 2 - API Reference
  @prop({ type: () => APIReference, required: true })
  public school!: APIReference

  // TODO: Pass 2 - API Reference array
  @prop({ type: () => [APIReference], required: true })
  public subclasses?: APIReference[]

  // url field is not exposed via GraphQL
  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type SpellDocument = DocumentType<Spell>
const SpellModel = getModelForClass(Spell)

export default SpellModel
