import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import {
  APIReference,
  Choice,
  AreaOfEffect,
  DifficultyClass,
  Damage,
  Option
} from '@/models/2014/common'
import { ActionUsage } from '@/models/2014/monster'
import { srdModelOptions } from '@/util/modelOptions'

class Proficiency {
  @prop({ required: true, index: true })
  public index!: string

  @prop({ required: true, index: true })
  public name!: string

  @prop({ required: true, index: true })
  public url!: string
}

class ActionDamage {
  @prop({ type: () => APIReference })
  public damage_type!: APIReference

  @prop({ type: () => Object })
  public damage_at_character_level!: Record<string, string>
}

export class Usage {
  @prop({ required: true, index: true })
  public type!: string

  @prop({ required: true, index: true })
  public times!: number
}

class Action {
  @prop({ required: true, index: true })
  public name!: string

  @prop({ required: true, index: true })
  public desc!: string

  @prop({ type: () => Usage })
  public usage!: Usage

  @prop({ type: () => DifficultyClass })
  public dc!: DifficultyClass

  @prop({ type: () => [ActionDamage] })
  public damage!: ActionDamage[]

  @prop({ type: () => AreaOfEffect })
  public area_of_effect!: AreaOfEffect
}

export class TraitPrerequisite {
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @prop({ required: true, index: true, type: () => String })
  public type!: string

  @prop({ required: true, index: true, type: () => String })
  public url!: string
}

export class TraitSpecificProficiencyOption extends Option {
  @prop({ type: () => APIReference, required: true })
  public item!: APIReference
}

export class TraitSpecificBreathWeapon {
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @prop({ required: true, index: true, type: () => String })
  public desc!: string

  @prop({ type: () => AreaOfEffect, required: true })
  public area_of_effect!: AreaOfEffect

  @prop({ type: () => ActionUsage, required: true })
  public usage!: ActionUsage

  @prop({ type: () => DifficultyClass, required: true })
  public dc!: DifficultyClass

  @prop({ type: () => [Damage], required: true })
  public damage!: Damage[]
}

export class TraitSpecificDamageResistance {
  @prop({ type: () => String, required: true })
  public type!: string
}

export class TraitSpecificAbilityScoreIncrease {
  @prop({ type: () => APIReference, required: true })
  public ability_score!: APIReference

  @prop({ type: () => Number, required: true })
  public bonus!: number
}

export class TraitSpecific {
  @prop({ type: () => Choice })
  public subtrait_options?: Choice

  @prop({ type: () => Choice })
  public spell_options?: Choice

  @prop({ type: () => Choice })
  public proficiency_options?: Choice

  @prop({ type: () => TraitSpecificBreathWeapon })
  public breath_weapon?: TraitSpecificBreathWeapon

  @prop({ type: () => TraitSpecificDamageResistance })
  public damage_type?: TraitSpecificDamageResistance

  @prop({ type: () => TraitSpecificAbilityScoreIncrease })
  public ability_score?: TraitSpecificAbilityScoreIncrease
}

@srdModelOptions('2014-traits')
export class Trait {
  @prop({ required: true, index: true, type: () => [String] })
  public desc!: string[]

  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @prop({ type: () => [APIReference], required: true })
  public languages?: APIReference[]

  @prop({ type: () => Choice })
  public language_options?: Choice

  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @prop({ type: () => [TraitPrerequisite] })
  public parent?: TraitPrerequisite[]

  @prop({ type: () => [APIReference], required: true })
  public proficiencies?: APIReference[]

  @prop({ type: () => Choice })
  public proficiency_choices?: Choice

  @prop({ type: () => [APIReference], required: true })
  public races!: APIReference[]

  @prop({ type: () => [APIReference], required: true })
  public subraces!: APIReference[]

  @prop({ type: () => TraitSpecific })
  public trait_specific?: TraitSpecific

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type TraitDocument = DocumentType<Trait>
const TraitModel = getModelForClass(Trait)

export default TraitModel
