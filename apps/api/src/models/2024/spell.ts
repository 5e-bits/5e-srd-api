import { getModelForClass, modelOptions, prop, Severity } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, Int, ObjectType } from 'type-graphql'

import { AbilityScore2024 } from '@/models/2024/abilityScore'
import { Class2024 } from '@/models/2024/class'
import { DamageType2024 } from '@/models/2024/damageType'
import { MagicSchool2024 } from '@/models/2024/magicSchool'
import { Subclass2024 } from '@/models/2024/subclass'
import { APIReference } from '@/models/common/apiReference'
import { AreaOfEffect } from '@/models/common/areaOfEffect'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({ description: "Details about a 2024 spell's damage." })
@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class SpellDamage2024 {
  @Field(() => DamageType2024, { nullable: true, description: 'Type of damage dealt.' })
  @prop({ type: () => APIReference })
  public damage_type?: APIReference

  // Handled by SpellDamage2024Resolver
  @prop({ mapProp: true, type: () => Object, default: undefined })
  public damage_at_slot_level?: Record<string, string>

  // Handled by SpellDamage2024Resolver
  @prop({ mapProp: true, type: () => Object, default: undefined })
  public damage_at_character_level?: Record<string, string>
}

@ObjectType({ description: "Details about a 2024 spell's saving throw." })
export class SpellDC2024 {
  @Field(() => AbilityScore2024, { description: 'The ability score used for the saving throw.' })
  @prop({ type: () => APIReference, required: true })
  public dc_type!: APIReference

  @Field(() => String, { description: "The result of a successful save (e.g., 'half', 'none')." })
  @prop({ required: true, index: true, type: () => String })
  public dc_success!: string

  @Field(() => String, {
    nullable: true,
    description: 'Additional description for the saving throw.'
  })
  @prop({ index: true, type: () => String })
  public desc?: string
}

@ObjectType({ description: 'Represents a spell in D&D 5e 2024.' })
@srdModelOptions('2024-spells')
export class Spell2024 {
  @Field(() => AreaOfEffect, {
    nullable: true,
    description: 'Area of effect details, if applicable.'
  })
  @prop({ type: () => AreaOfEffect })
  public area_of_effect?: AreaOfEffect

  @Field(() => String, {
    nullable: true,
    description: 'Type of attack associated with the spell (e.g., melee, ranged).'
  })
  @prop({ index: true, type: () => String })
  public attack_type?: string

  @Field(() => String, { description: 'Time required to cast the spell.' })
  @prop({ required: true, index: true, type: () => String })
  public casting_time!: string

  @Field(() => [Class2024], { nullable: true, description: 'Classes that can cast this spell.' })
  @prop({ type: () => [APIReference], required: true })
  public classes!: APIReference[]

  @Field(() => [String], { description: 'Components required for the spell (V, S, M).' })
  @prop({ type: () => [String], required: true })
  public components!: string[]

  @Field(() => Boolean, { description: 'Indicates if the spell requires concentration.' })
  @prop({ required: true, index: true, type: () => Boolean })
  public concentration!: boolean

  @Field(() => SpellDamage2024, { nullable: true, description: 'Damage details, if applicable.' })
  @prop({ type: () => SpellDamage2024 })
  public damage?: SpellDamage2024

  @Field(() => SpellDC2024, { nullable: true, description: 'Saving throw details, if applicable.' })
  @prop({ type: () => SpellDC2024 })
  public dc?: SpellDC2024

  @Field(() => String, { description: "Description of the spell's effects." })
  @prop({ required: true, type: () => String })
  public description!: string

  @Field(() => String, { description: 'Duration of the spell.' })
  @prop({ required: true, index: true, type: () => String })
  public duration!: string

  // Handled by Spell2024Resolver
  @prop({ type: () => Object })
  public heal_at_slot_level?: Record<string, string>

  @Field(() => String, {
    nullable: true,
    description: 'Description of effects when cast at higher levels.'
  })
  @prop({ type: () => String })
  public higher_level?: string

  @Field(() => String, { description: 'Unique identifier for this spell.' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => Int, { description: 'Level of the spell (0 for cantrips).' })
  @prop({ required: true, index: true, type: () => Number })
  public level!: number

  @Field(() => String, { nullable: true, description: 'Material components required, if any.' })
  @prop({ type: () => String })
  public material?: string

  @Field(() => String, { description: 'Name of the spell.' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => String, { description: 'Range of the spell.' })
  @prop({ required: true, index: true, type: () => String })
  public range!: string

  @Field(() => Boolean, { description: 'Indicates if the spell can be cast as a ritual.' })
  @prop({ required: true, index: true, type: () => Boolean })
  public ritual!: boolean

  @Field(() => MagicSchool2024, {
    nullable: true,
    description: 'The school of magic this spell belongs to.'
  })
  @prop({ type: () => APIReference, required: true })
  public school!: APIReference

  @Field(() => [Subclass2024], {
    nullable: true,
    description: 'Subclasses that can cast this spell.'
  })
  @prop({ type: () => [APIReference] })
  public subclasses?: APIReference[]

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type Spell2024Document = DocumentType<Spell2024>
const Spell2024Model = getModelForClass(Spell2024)

export default Spell2024Model
