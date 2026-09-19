import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, Int, ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { Choice } from '@/models/common/choice'
import { srdModelOptions } from '@/util/modelOptions'

import { AbilityScore } from './abilityScore'
import { Level } from './level'
import { Proficiency } from './proficiency'
import { Spell } from './spell'
import { Subclass } from './subclass'

@ObjectType({ description: 'Starting equipment item for a class' })
export class ClassEquipment {
  // Handled by ClassEquipmentResolver
  @prop({ type: () => APIReference })
  public equipment!: APIReference

  @Field(() => Int, { description: 'Quantity of the equipment item.' })
  @prop({ required: true, index: true, type: () => Number })
  public quantity!: number
}

@ObjectType({ description: "Information about a class's spellcasting ability" })
export class SpellcastingInfo {
  @Field(() => [String], { description: 'Description of the spellcasting ability.' })
  @prop({ required: true, index: true, type: () => [String] })
  public desc!: string[]

  @Field(() => String, { description: 'Name of the spellcasting ability.' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string
}

@ObjectType({ description: 'Spellcasting details for a class' })
export class Spellcasting {
  @Field(() => [SpellcastingInfo], { description: 'Spellcasting details for the class.' })
  @prop({ type: () => [SpellcastingInfo] })
  public info!: SpellcastingInfo[]

  @Field(() => Int, { description: 'Level of the spellcasting ability.' })
  @prop({ required: true, index: true, type: () => Number })
  public level!: number

  @Field(() => AbilityScore, { description: 'Ability score used for spellcasting.' })
  @prop({ type: () => APIReference })
  public spellcasting_ability!: APIReference
}

@ObjectType({ description: 'Prerequisite for multi-classing' })
export class MultiClassingPrereq {
  @Field(() => AbilityScore, { nullable: true, description: 'The ability score required.' })
  @prop({ type: () => APIReference })
  public ability_score!: APIReference

  @Field(() => Int, { description: 'The minimum score required.' })
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

  // Handled by MultiClassingResolver
  @prop({ type: () => Choice, default: undefined })
  public prerequisite_options?: Choice

  @Field(() => [Proficiency], {
    nullable: true,
    description: 'Proficiencies gained when multi-classing into this class.'
  })
  @prop({ type: () => [APIReference], default: undefined })
  public proficiencies?: APIReference[]

  // Handled by MultiClassingResolver
  @prop({ type: () => [Choice], default: undefined })
  public proficiency_choices?: Choice[]
}

@ObjectType({ description: 'Represents a character class (e.g., Barbarian, Wizard)' })
@srdModelOptions('2014-classes')
export class Class {
  @Field(() => [Level], {
    description: 'All levels for this class, detailing features and abilities gained.'
  })
  @prop({ required: true, index: true, type: () => String })
  public class_levels!: string

  @Field(() => MultiClassing, {
    nullable: true,
    description: 'Multi-classing requirements and features for this class.'
  })
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

  // Handled by ClassResolver
  @prop({ type: () => [Choice] })
  public proficiency_choices!: Choice[]

  @Field(() => [AbilityScore], {
    nullable: true,
    description: 'Saving throw proficiencies granted by this class.'
  })
  @prop({ type: () => [APIReference] })
  public saving_throws!: APIReference[]

  @Field(() => Spellcasting, {
    nullable: true,
    description: 'Spellcasting details for the class.'
  })
  @prop({ type: () => Spellcasting })
  public spellcasting?: Spellcasting

  @Field(() => [Spell], { description: 'Spells available to this class.' })
  @prop({ required: true, index: true, type: () => String })
  public spells!: string

  @Field(() => [ClassEquipment], {
    nullable: true,
    description: 'Starting equipment for the class.'
  })
  @prop({ type: () => [ClassEquipment] })
  public starting_equipment!: ClassEquipment[]

  // Handled by ClassResolver
  @prop({ type: () => [Choice] })
  public starting_equipment_options!: Choice[]

  @Field(() => [Subclass], { nullable: true, description: 'Available subclasses for this class.' })
  @prop({ type: () => [APIReference] })
  public subclasses!: APIReference[]

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type ClassDocument = DocumentType<Class>
const ClassModel = getModelForClass(Class)
export default ClassModel
