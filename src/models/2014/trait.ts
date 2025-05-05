import { getModelForClass, modelOptions, prop, Severity } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { APIReference, Choice, AreaOfEffect, DifficultyClass } from '@/models/2014/common'
import { srdModelOptions } from '@/util/modelOptions'
import { ObjectType, Field } from 'type-graphql'

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
class ActionDamage {
  @prop({ type: () => APIReference })
  public damage_type!: APIReference

  @prop({ type: () => Object })
  public damage_at_character_level!: Record<string, string>
}

export class Usage {
  @prop({ required: true, index: true, type: () => String })
  public type!: string

  @prop({ required: true, index: true, type: () => Number })
  public times!: number
}

class Action {
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @prop({ required: true, index: true, type: () => [String] })
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

export class TraitSpecific {
  @prop({ type: () => Choice })
  public subtrait_options?: Choice

  @prop({ type: () => Choice })
  public spell_options?: Choice

  @prop({ type: () => APIReference })
  public damage_type?: APIReference

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

  // TODO: Pass 2 - Implement reference resolver
  @prop({ type: () => [APIReference] })
  public proficiencies?: APIReference[]

  // TODO: Pass 3 - Implement choice resolver
  @prop({ type: () => Choice })
  public proficiency_choices?: Choice

  // TODO: Pass 3 - Implement choice resolver
  @prop({ type: () => Choice })
  public language_options?: Choice

  // TODO: Pass 2 - Implement reference resolver
  @prop({ type: () => [APIReference], required: true })
  public races!: APIReference[]

  // TODO: Pass 2 - Implement reference resolver
  @prop({ type: () => [APIReference], required: true })
  public subraces!: APIReference[]

  // TODO: Pass 2 - Implement reference resolver
  @prop({ type: () => APIReference })
  public parent?: APIReference

  // TODO: Pass 2/3 - Implement trait_specific resolver (contains refs/choices)
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
