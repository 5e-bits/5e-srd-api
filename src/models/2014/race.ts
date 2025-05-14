import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { APIReference } from '@/models/2014/types/apiReference'
import { Choice } from '@/models/2014/common'
import { srdModelOptions } from '@/util/modelOptions'
import { ObjectType, Field, Int } from 'type-graphql'
import { AbilityScore } from './abilityScore'
import { Language } from './language'
import { Proficiency } from './proficiency'
import { Subrace } from './subrace'
import { Trait } from './trait'
import {
  LanguageChoice,
  ProficiencyChoice,
  AbilityScoreBonusChoice
} from '@/graphql/2014rewrite/common/choiceTypes'

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

  @Field(() => AbilityScoreBonusChoice, {
    nullable: true,
    description: 'The ability bonus options of the race.'
  })
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

  @Field(() => LanguageChoice, {
    nullable: true,
    description: 'Languages typically spoken by this race.'
  })
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

  @Field(() => [Proficiency], {
    nullable: true,
    description: 'Proficiencies granted by this race at start.'
  })
  @prop({ type: () => [APIReference] })
  public starting_proficiencies?: APIReference[]

  @Field(() => ProficiencyChoice, {
    nullable: true,
    description: 'Proficiencies granted by this race at start.'
  })
  @prop({ type: () => Choice })
  public starting_proficiency_options?: Choice

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
