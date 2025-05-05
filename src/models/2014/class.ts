import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { APIReference, Choice } from './common'
import { srdModelOptions } from '@/util/modelOptions'
import { ObjectType, Field, Int } from 'type-graphql'

// EXPORT local classes/types needed by factories
@ObjectType({ description: 'Starting equipment item for a class' })
export class Equipment {
  // Fields skipped in Pass 1
  @prop({ type: () => APIReference })
  public equipment!: APIReference

  // Fields skipped in Pass 1
  @prop({ required: true, index: true, type: () => Number })
  public quantity!: number
}

@ObjectType({ description: "Information about a class's spellcasting ability" })
export class SpellcastingInfo {
  // Fields skipped in Pass 1
  @prop({ required: true, index: true, type: () => [String] })
  public desc!: string[]

  // Fields skipped in Pass 1
  @prop({ required: true, index: true, type: () => String })
  public name!: string
}

@ObjectType({ description: 'Spellcasting details for a class' })
export class Spellcasting {
  // Fields skipped in Pass 1
  @prop({ type: () => [SpellcastingInfo] })
  public info!: SpellcastingInfo[]

  // Fields skipped in Pass 1
  @prop({ required: true, index: true, type: () => Number })
  public level!: number

  // Fields skipped in Pass 1
  @prop({ type: () => APIReference })
  public spellcasting_ability!: APIReference
}

@ObjectType({ description: 'Prerequisite for multi-classing' })
export class MultiClassingPrereq {
  // Fields skipped in Pass 1
  @prop({ type: () => APIReference })
  public ability_score!: APIReference

  // Fields skipped in Pass 1
  @prop({ required: true, index: true, type: () => Number })
  public minimum_score!: number
}

@ObjectType({ description: 'Multi-classing requirements and features for a class' })
export class MultiClassing {
  // Fields skipped in Pass 1
  @prop({ type: () => [MultiClassingPrereq], default: undefined })
  public prerequisites?: MultiClassingPrereq[]

  // Fields skipped in Pass 1
  @prop({ type: () => Choice, default: undefined })
  public prerequisite_options?: Choice

  // Fields skipped in Pass 1
  @prop({ type: () => [APIReference], default: undefined })
  public proficiencies?: APIReference[]

  // Fields skipped in Pass 1
  @prop({ type: () => [Choice], default: undefined })
  public proficiency_choices?: Choice[]
}

@ObjectType({ description: 'Represents a character class (e.g., Barbarian, Wizard)' })
@srdModelOptions('2014-classes')
export class Class {
  // TODO: Pass 2 - Reference to Level API (likely)
  @prop({ required: true, index: true, type: () => String })
  public class_levels!: string

  // TODO: Pass 2/3 - Complex nested type (MultiClassing)
  @prop({ type: () => MultiClassing })
  public multi_classing!: MultiClassing

  @Field(() => Int, { description: 'Hit die size for the class (e.g., 6, 8, 10, 12)' })
  @prop({ required: true, index: true, type: () => Number })
  public hit_die!: number

  @Field(() => String, { description: 'Unique identifier for the class' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'Name of the class' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  // TODO: Pass 2 - API Reference array
  @prop({ type: () => [APIReference] })
  public proficiencies!: APIReference[]

  // TODO: Pass 3 - Choice array
  @prop({ type: () => [Choice] })
  public proficiency_choices!: Choice[]

  // TODO: Pass 2 - API Reference array
  @prop({ type: () => [APIReference] })
  public saving_throws!: APIReference[]

  // TODO: Pass 2/3 - Complex nested type (Spellcasting)
  @prop({ type: () => Spellcasting })
  public spellcasting?: Spellcasting

  // TODO: Pass 2 - Reference to Spell API (likely)
  @prop({ required: true, index: true, type: () => String })
  public spells!: string

  // TODO: Pass 2/3 - Array of complex nested type (Equipment)
  @prop({ type: () => [Equipment] })
  public starting_equipment!: Equipment[]

  // TODO: Pass 3 - Choice array
  @prop({ type: () => [Choice] })
  public starting_equipment_options!: Choice[]

  // TODO: Pass 2 - API Reference array
  @prop({ type: () => [APIReference] })
  public subclasses!: APIReference[]

  // url field is not exposed via GraphQL
  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type ClassDocument = DocumentType<Class>
const ClassModel = getModelForClass(Class)
export default ClassModel
