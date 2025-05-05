import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { APIReference, Choice } from '@/models/2014/common'
import { srdModelOptions } from '@/util/modelOptions'
import { ObjectType, Field, Int } from 'type-graphql'

@ObjectType({ description: 'Ability score bonus provided by a race' })
export class RaceAbilityBonus {
  // TODO: Pass 2 - API Reference
  @prop({ type: () => APIReference, required: true })
  public ability_score!: APIReference

  @Field(() => Int, { description: 'The bonus value for the ability score' })
  @prop({ required: true, index: true, type: () => Number })
  public bonus!: number
}

@ObjectType({ description: 'Represents a playable race in D&D' })
@srdModelOptions('2014-races')
export class Race {
  // TODO: Pass 3 - Choice field
  @prop({ type: () => Choice })
  public ability_bonus_options?: Choice

  // TODO: Pass 2 - Nested type with API Reference
  @prop({ type: () => [RaceAbilityBonus], required: true })
  public ability_bonuses!: RaceAbilityBonus[]

  @Field(() => String, { description: 'Typical age range and lifespan for the race' })
  @prop({ required: true, index: true, type: () => String })
  public age!: string

  @Field(() => String, { description: 'Typical alignment tendencies for the race' })
  @prop({ required: true, index: true, type: () => String })
  public alignment!: string

  @Field(() => String, { description: 'Unique identifier for this race' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'Description of languages typically spoken by the race' })
  @prop({ required: true, index: true, type: () => String })
  public language_desc!: string

  // TODO: Pass 3 - Choice field
  @prop({ type: () => Choice, required: true })
  public language_options!: Choice

  // TODO: Pass 2 - API Reference array
  @prop({ type: () => [APIReference], required: true })
  public languages!: APIReference[]

  @Field(() => String, { description: 'Name of the race' })
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

  // TODO: Pass 2 - API Reference array
  @prop({ type: () => [APIReference] })
  public starting_proficiencies?: APIReference[]

  // TODO: Pass 3 - Choice field
  @prop({ type: () => Choice })
  public starting_proficiency_options?: Choice

  // TODO: Pass 2 - API Reference array
  @prop({ type: () => [APIReference] })
  public subraces?: APIReference[]

  // TODO: Pass 2 - API Reference array
  @prop({ type: () => [APIReference] })
  public traits?: APIReference[]

  // url field is not exposed via GraphQL
  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type RaceDocument = DocumentType<Race>
const RaceModel = getModelForClass(Race)

export default RaceModel
