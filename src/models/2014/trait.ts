import { getModelForClass, modelOptions, prop, Severity } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { APIReference, Choice, AreaOfEffect, DifficultyClass } from '@/models/2014/common'
import { srdModelOptions } from '@/util/modelOptions'
import { ObjectType, Field } from 'type-graphql'
import { Proficiency } from './proficiency'
import { Race } from './race'
import { Subrace } from './subrace'
import { DamageType } from './damageType'

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

@ObjectType({ description: 'Details specific to certain traits.' })
export class TraitSpecific {
  // TODO: Pass 3 - Implement choice resolver
  @prop({ type: () => Choice })
  public subtrait_options?: Choice

  // TODO: Pass 3 - Implement choice resolver
  @prop({ type: () => Choice })
  public spell_options?: Choice

  @Field(() => DamageType, {
    nullable: true,
    description: 'Specific damage type associated with the trait.'
  })
  @prop({ type: () => APIReference })
  public damage_type?: APIReference

  // No @Field decorator here yet
  // TODO: Define complex types post-Pass 2 (Define Action @ObjectType)
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

  // TODO: Pass 3 - Implement choice resolver
  @prop({ type: () => Choice })
  public proficiency_choices?: Choice

  // TODO: Pass 3 - Implement choice resolver
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
