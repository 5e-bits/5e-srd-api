import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, Int, ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { Choice } from '@/models/common/choice'
import { srdModelOptions } from '@/util/modelOptions'

import { AbilityScore } from './abilityScore'
import { Language } from './language'
import { Subrace } from './subrace'
import { Trait } from './trait'

@ObjectType({ description: 'Ability score bonus provided by a race' })
export class RaceAbilityBonus {
  @Field(() => AbilityScore, {
    nullable: true,
    description: 'The ability score that receives the bonus.'
  })
  @prop({ type: () => APIReference, required: true })
  public ability_score!: APIReference

  @Field(() => Int, { description: 'The bonus value for the ability score' })
  @prop({ required: true, index: true, type: () => Number })
  public bonus!: number
}

@ObjectType({ description: 'Represents a playable race in D&D' })
@srdModelOptions('2014-races')
export class Race {
  @Field(() => String, { description: 'The index of the race.' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  // Handled by RaceResolver
  @prop({ type: () => Choice, required: false, index: true })
  public ability_bonus_options?: Choice

  @Field(() => [RaceAbilityBonus], { description: 'Ability score bonuses granted by this race.' })
  @prop({ type: () => [RaceAbilityBonus], required: true })
  public ability_bonuses!: RaceAbilityBonus[]

  @Field(() => String, { description: 'Typical age range and lifespan for the race' })
  @prop({ required: true, index: true, type: () => String })
  public age!: string

  @Field(() => String, { description: 'Typical alignment tendencies for the race' })
  @prop({ required: true, index: true, type: () => String })
  public alignment!: string

  @Field(() => String, { description: 'Description of languages typically spoken by the race' })
  @prop({ required: true, index: true, type: () => String })
  public language_desc!: string

  // Handled by RaceResolver
  @prop({ type: () => Choice })
  public language_options?: Choice

  @Field(() => [Language], {
    nullable: true,
    description: 'Languages typically spoken by this race.'
  })
  @prop({ type: () => [APIReference], required: true })
  public languages!: APIReference[]

  @Field(() => String, { description: 'The name of the race.' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => String, { description: 'Size category (e.g., Medium, Small)' })
  @prop({ required: true, index: true, type: () => String })
  public size!: string

  @Field(() => String, { description: "Description of the race's size" })
  @prop({ required: true, index: true, type: () => String })
  public size_description!: string

  @Field(() => Int, { description: 'Base walking speed in feet' })
  @prop({ required: true, index: true, type: () => Number })
  public speed!: number

  @Field(() => [Subrace], { nullable: true, description: 'Subraces available for this race.' })
  @prop({ type: () => [APIReference] })
  public subraces?: APIReference[]

  @Field(() => [Trait], { nullable: true, description: 'Traits common to this race.' })
  @prop({ type: () => [APIReference] })
  public traits?: APIReference[]

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type RaceDocument = DocumentType<Race>
const RaceModel = getModelForClass(Race)

export default RaceModel
