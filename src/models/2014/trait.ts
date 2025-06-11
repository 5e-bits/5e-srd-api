import { getModelForClass, modelOptions, prop, Severity } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, Int, ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { AreaOfEffect } from '@/models/common/areaOfEffect'
import { srdModelOptions } from '@/util/modelOptions'

import { AbilityScore } from './abilityScore'
import { DamageType } from './damageType'
import { Proficiency } from './proficiency'
import { Race } from './race'
import { Subrace } from './subrace'
import { Choice } from '../common/choice'

@ObjectType({ description: 'Damage details for an action' })
@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class ActionDamage {
  @Field(() => DamageType, { nullable: true, description: 'The type of damage dealt.' })
  @prop({ type: () => APIReference })
  public damage_type!: APIReference

  // Handled by ActionDamageResolver
  @prop({ type: () => Object })
  public damage_at_character_level?: Record<string, string>
}

@ObjectType({ description: 'Usage limit details for an action' })
export class Usage {
  @Field(() => String, { description: "Type of usage limit (e.g., 'per day')." })
  @prop({ required: true, index: true, type: () => String })
  public type!: string

  @Field(() => Int, { description: 'Number of times the action can be used.' })
  @prop({ required: true, index: true, type: () => Number })
  public times!: number
}

@ObjectType({ description: 'DC details for a trait action (lacks dc_value).' })
export class TraitActionDC {
  @Field(() => AbilityScore, { description: 'The ability score associated with this DC.' })
  @prop({ type: () => APIReference, required: true })
  public dc_type!: APIReference

  @Field(() => String, { description: 'The result of a successful save against this DC.' })
  @prop({ type: () => String, required: true })
  public success_type!: 'none' | 'half' | 'other'
}

@ObjectType({ description: 'Represents an action associated with a trait (like a breath weapon).' })
export class Action {
  @Field(() => String, { description: 'The name of the action.' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => String, { description: 'Description of the action.' })
  @prop({ required: true, index: true, type: () => String })
  public desc!: string

  @Field(() => Usage, { nullable: true, description: 'Usage limitations for the action.' })
  @prop({ type: () => Usage })
  public usage?: Usage

  @Field(() => TraitActionDC, {
    nullable: true,
    description:
      'The Difficulty Class (DC) associated with the action (value may not be applicable).'
  })
  @prop({ type: () => TraitActionDC })
  public dc?: TraitActionDC

  @Field(() => [ActionDamage], { nullable: true, description: 'Damage dealt by the action.' })
  @prop({ type: () => [ActionDamage] })
  public damage?: ActionDamage[]

  @Field(() => AreaOfEffect, { nullable: true, description: 'The area of effect for the action.' })
  @prop({ type: () => AreaOfEffect })
  public area_of_effect?: AreaOfEffect
}

@ObjectType({ description: 'Details specific to certain traits.' })
export class TraitSpecific {
  // Handled by TraitSpecificResolver
  @prop({ type: () => Choice })
  public subtrait_options?: Choice

  // Handled by TraitSpecificResolver
  @prop({ type: () => Choice })
  public spell_options?: Choice

  // Handled by TraitSpecificResolver
  @prop({ type: () => APIReference })
  public damage_type?: APIReference

  @Field(() => Action, {
    nullable: true,
    description: 'Breath weapon action details, if applicable.'
  })
  @prop({ type: () => Action })
  public breath_weapon?: Action
}

@ObjectType({
  description: 'A racial or subracial trait providing specific benefits or abilities.'
})
@srdModelOptions('2014-traits')
export class Trait {
  @Field(() => [String], { description: 'A description of the trait.' })
  @prop({ required: true, index: true, type: () => [String] })
  public desc!: string[]

  @Field(() => String, { description: 'The unique identifier for this trait (e.g., darkvision).' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'The name of the trait (e.g., Darkvision).' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => [Proficiency], {
    nullable: true,
    description: 'Proficiencies granted by this trait.'
  })
  @prop({ type: () => [APIReference] })
  public proficiencies?: APIReference[]

  // Handled by TraitResolver
  @prop({ type: () => Choice })
  public proficiency_choices?: Choice

  // Handled by TraitResolver
  @prop({ type: () => Choice })
  public language_options?: Choice

  @Field(() => [Race], { nullable: true, description: 'Races that possess this trait.' })
  @prop({ type: () => [APIReference], required: true })
  public races!: APIReference[]

  @Field(() => [Subrace], { nullable: true, description: 'Subraces that possess this trait.' })
  @prop({ type: () => [APIReference], required: true })
  public subraces!: APIReference[]

  @Field(() => Trait, { nullable: true, description: 'A parent trait, if this is a sub-trait.' })
  @prop({ type: () => APIReference })
  public parent?: APIReference

  @Field(() => TraitSpecific, {
    nullable: true,
    description: 'Specific details for this trait, if applicable.'
  })
  @prop({ type: () => TraitSpecific })
  public trait_specific?: TraitSpecific

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type TraitDocument = DocumentType<Trait>
const TraitModel = getModelForClass(Trait)

export default TraitModel
