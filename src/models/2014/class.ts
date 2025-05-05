import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { APIReference, Choice } from './common'
import { srdModelOptions } from '@/util/modelOptions'
import { ObjectType, Field, Int } from 'type-graphql'
import { Proficiency } from './proficiency'
import { AbilityScore } from './abilityScore'
import { Subclass } from './subclass'

@ObjectType({ description: 'Starting equipment item for a class' })
export class Equipment {
  // TODO: Define complex types post-Pass 2 (Resolve equipment reference)
  @prop({ type: () => APIReference })
  public equipment!: APIReference

  @Field(() => Int, { description: 'Quantity of the equipment item.' })
  @prop({ required: true, index: true, type: () => Number })
  public quantity!: number
}

@ObjectType({ description: "Information about a class's spellcasting ability" })
export class SpellcastingInfo {
  // TODO: Define complex types post-Pass 2
  @prop({ required: true, index: true, type: () => [String] })
  public desc!: string[]

  // TODO: Define complex types post-Pass 2
  @prop({ required: true, index: true, type: () => String })
  public name!: string
}

@ObjectType({ description: 'Spellcasting details for a class' })
export class Spellcasting {
  // TODO: Define complex types post-Pass 2
  @prop({ type: () => [SpellcastingInfo] })
  public info!: SpellcastingInfo[]

  // TODO: Define complex types post-Pass 2
  @prop({ required: true, index: true, type: () => Number })
  public level!: number

  // TODO: Define complex types post-Pass 2 (Resolve reference)
  @prop({ type: () => APIReference })
  public spellcasting_ability!: APIReference
}

@ObjectType({ description: 'Prerequisite for multi-classing' })
export class MultiClassingPrereq {
  @Field(() => AbilityScore, { nullable: true, description: 'The ability score required.' }) // Add Field
  @prop({ type: () => APIReference })
  public ability_score!: APIReference

  @Field(() => Int, { description: 'The minimum score required.' }) // Add Field
  @prop({ required: true, index: true, type: () => Number })
  public minimum_score!: number
}

@ObjectType({ description: 'Multi-classing requirements and features for a class' })
export class MultiClassing {
  @Field(() => [MultiClassingPrereq], {
    nullable: true,
    description: 'Ability score prerequisites for multi-classing.'
  })
  @prop({ type: () => [MultiClassingPrereq], default: undefined })
  public prerequisites?: MultiClassingPrereq[]

  // TODO: Pass 3 - Implement choice resolver
  @prop({ type: () => Choice, default: undefined })
  public prerequisite_options?: Choice

  @Field(() => [Proficiency], {
    nullable: true,
    description: 'Proficiencies gained when multi-classing into this class.'
  })
  @prop({ type: () => [APIReference], default: undefined })
  public proficiencies?: APIReference[]

  // TODO: Pass 3 - Implement choice resolver
  @prop({ type: () => [Choice], default: undefined })
  public proficiency_choices?: Choice[]
}

@ObjectType({ description: 'Represents a character class (e.g., Barbarian, Wizard)' })
@srdModelOptions('2014-classes')
export class Class {
  // TODO: Define complex types post-Pass 2 (Resolve reference to Level type)
  @prop({ required: true, index: true, type: () => String })
  public class_levels!: string

  // TODO: Define complex types post-Pass 2 (Define MultiClassing type)
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

  @Field(() => [Proficiency], {
    nullable: true,
    description: 'Base proficiencies granted by this class.'
  })
  @prop({ type: () => [APIReference] })
  public proficiencies!: APIReference[]

  // TODO: Pass 3 - Choice array
  @prop({ type: () => [Choice] })
  public proficiency_choices!: Choice[]

  @Field(() => [AbilityScore], {
    nullable: true,
    description: 'Saving throw proficiencies granted by this class.'
  })
  @prop({ type: () => [APIReference] })
  public saving_throws!: APIReference[]

  // TODO: Define complex types post-Pass 2 (Define Spellcasting type and resolve nested refs)
  @prop({ type: () => Spellcasting })
  public spellcasting?: Spellcasting

  // TODO: Define complex types post-Pass 2 (Resolve reference to Spell type array)
  @prop({ required: true, index: true, type: () => String })
  public spells!: string

  // TODO: Define complex types post-Pass 2 (Define local starting Equipment type and resolve nested refs)
  @prop({ type: () => [Equipment] })
  public starting_equipment!: Equipment[]

  // TODO: Pass 3 - Choice array
  @prop({ type: () => [Choice] })
  public starting_equipment_options!: Choice[]

  @Field(() => [Subclass], { nullable: true, description: 'Available subclasses for this class.' })
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
