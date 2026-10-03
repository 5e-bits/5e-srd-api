import { getModelForClass, modelOptions, Severity } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { AreaOfEffect } from '@/models/common/areaOfEffect'
import { field, T } from '@/util/field'
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
  @field(T.Ref(() => DamageType), {
    description: 'The type of damage dealt.',
    gql: { nullable: true }
  })
  public damage_type!: APIReference

  // Handled by ActionDamageResolver
  @field(T.Model(() => Object), { gql: false })
  public damage_at_character_level?: Record<string, string>
}

@ObjectType({ description: 'Usage limit details for an action' })
export class Usage {
  @field(T.String, {
    description: "Type of usage limit (e.g., 'per day').",
    required: true,
    index: true
  })
  public type!: string

  @field(T.Int, {
    description: 'Number of times the action can be used.',
    required: true,
    index: true
  })
  public times!: number
}

@ObjectType({ description: 'DC details for a trait action (lacks dc_value).' })
export class TraitActionDC {
  @field(T.Ref(() => AbilityScore), {
    description: 'The ability score associated with this DC.',
    required: true
  })
  public dc_type!: APIReference

  @field(T.String, {
    description: 'The result of a successful save against this DC.',
    required: true
  })
  public success_type!: 'none' | 'half' | 'other'
}

@ObjectType({ description: 'Represents an action associated with a trait (like a breath weapon).' })
export class Action {
  @field(T.String, { description: 'The name of the action.', required: true, index: true })
  public name!: string

  @field(T.String, { description: 'Description of the action.', required: true, index: true })
  public desc!: string

  @field(T.Model(() => Usage), {
    description: 'Usage limitations for the action.',
    gql: { nullable: true }
  })
  public usage?: Usage

  @field(T.Model(() => TraitActionDC), {
    description:
      'The Difficulty Class (DC) associated with the action (value may not be applicable).',
    gql: { nullable: true }
  })
  public dc?: TraitActionDC

  @field(T.List(() => ActionDamage), {
    description: 'Damage dealt by the action.',
    gql: { nullable: true }
  })
  public damage?: ActionDamage[]

  @field(T.Model(() => AreaOfEffect), {
    description: 'The area of effect for the action.',
    gql: { nullable: true }
  })
  public area_of_effect?: AreaOfEffect
}

@ObjectType({ description: 'Details specific to certain traits.' })
export class TraitSpecific {
  // Handled by TraitSpecificResolver
  @field(T.Model(() => Choice), { gql: false })
  public subtrait_options?: Choice

  // Handled by TraitSpecificResolver
  @field(T.Model(() => Choice), { gql: false })
  public spell_options?: Choice

  // Handled by TraitSpecificResolver
  @field(T.Model(() => APIReference), { gql: false })
  public damage_type?: APIReference

  @field(T.Model(() => Action), {
    description: 'Breath weapon action details, if applicable.',
    gql: { nullable: true }
  })
  public breath_weapon?: Action
}

@ObjectType({
  description: 'A racial or subracial trait providing specific benefits or abilities.'
})
@srdModelOptions('2014-traits')
export class Trait {
  @field(T.List(T.String), {
    description: 'A description of the trait.',
    required: true,
    index: true
  })
  public desc!: string[]

  @field(T.String, {
    description: 'The unique identifier for this trait (e.g., darkvision).',
    required: true,
    index: true
  })
  public index!: string

  @field(T.String, {
    description: 'The name of the trait (e.g., Darkvision).',
    required: true,
    index: true
  })
  public name!: string

  @field(T.RefList(() => Proficiency), {
    description: 'Proficiencies granted by this trait.',
    gql: { nullable: true }
  })
  public proficiencies?: APIReference[]

  // Handled by TraitResolver
  @field(T.Model(() => Choice), { gql: false })
  public proficiency_choices?: Choice

  // Handled by TraitResolver
  @field(T.Model(() => Choice), { gql: false })
  public language_options?: Choice

  @field(T.RefList(() => Race), {
    description: 'Races that possess this trait.',
    required: true,
    gql: { nullable: true }
  })
  public races!: APIReference[]

  @field(T.RefList(() => Subrace), {
    description: 'Subraces that possess this trait.',
    required: true,
    gql: { nullable: true }
  })
  public subraces!: APIReference[]

  @field(T.Ref(() => Trait), {
    description: 'A parent trait, if this is a sub-trait.',
    gql: { nullable: true }
  })
  public parent?: APIReference

  @field(T.Model(() => TraitSpecific), {
    description: 'Specific details for this trait, if applicable.',
    gql: { nullable: true }
  })
  public trait_specific?: TraitSpecific

  @field(T.String, { required: true, index: true, gql: false })
  public url!: string

  @field(T.String, { description: 'Timestamp of the last update.', required: true, index: true })
  public updated_at!: string
}

export type TraitDocument = DocumentType<Trait>
const TraitModel = getModelForClass(Trait)

export default TraitModel
