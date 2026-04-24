import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, Int, ObjectType } from 'type-graphql'

import { AbilityScore2024 } from '@/models/2024/abilityScore'
import { Proficiency2024 } from '@/models/2024/proficiency'
import { Subclass2024 } from '@/models/2024/subclass'
import { APIReference } from '@/models/common/apiReference'
import { Choice } from '@/models/common/choice'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({ description: 'A spellcasting info entry for a 2024 class.' })
export class SpellcastingInfo2024 {
  @Field(() => String, { description: 'The name of the spellcasting info entry.' })
  @prop({ required: true, type: () => String })
  public name!: string

  @Field(() => [String], { description: 'Description of the spellcasting info entry.' })
  @prop({ required: true, type: () => [String] })
  public desc!: string[]
}

@ObjectType({ description: 'Spellcasting details for a 2024 class.' })
export class Spellcasting2024 {
  @Field(() => Int, { description: 'The level at which spellcasting begins.' })
  @prop({ required: true, type: () => Number })
  public level!: number

  @Field(() => AbilityScore2024, { description: 'The ability score used for spellcasting.' })
  @prop({ type: () => APIReference, required: true })
  public spellcasting_ability!: APIReference

  @Field(() => [SpellcastingInfo2024], { description: 'Additional spellcasting info entries.' })
  @prop({ required: true, type: () => [SpellcastingInfo2024] })
  public info!: SpellcastingInfo2024[]
}

@ObjectType({ description: 'A prerequisite for multi-classing into a 2024 class.' })
export class MultiClassingPrereq2024 {
  @Field(() => AbilityScore2024, { nullable: true, description: 'The ability score required.' })
  @prop({ type: () => APIReference })
  public ability_score?: APIReference

  @Field(() => Int, { description: 'The minimum score required.' })
  @prop({ required: true, type: () => Number })
  public minimum_score!: number
}

@ObjectType({ description: 'Multi-classing requirements and proficiencies for a 2024 class.' })
export class MultiClassing2024 {
  @Field(() => [MultiClassingPrereq2024], {
    nullable: true,
    description: 'Ability score prerequisites for multi-classing.'
  })
  @prop({ type: () => [MultiClassingPrereq2024] })
  public prerequisites?: MultiClassingPrereq2024[]

  @prop({ type: () => Choice })
  public prerequisite_options?: Choice

  @Field(() => [Proficiency2024], {
    nullable: true,
    description: 'Proficiencies gained when multi-classing.'
  })
  @prop({ type: () => [APIReference] })
  public proficiencies?: APIReference[]

  @prop({ type: () => [Choice] })
  public proficiency_choices?: Choice[]
}

@ObjectType({ description: 'The primary ability information for a 2024 class.' })
export class PrimaryAbility2024 {
  @Field(() => String, { description: 'Description of the primary ability.' })
  @prop({ required: true, type: () => String })
  public desc!: string

  @Field(() => [AbilityScore2024], {
    nullable: true,
    description: 'All of these ability scores must meet the minimum.'
  })
  @prop({ type: () => [APIReference] })
  public ability_scores?: APIReference[]

  @prop({ type: () => Choice })
  public ability_score_options?: Choice
}

@ObjectType({ description: 'A character class in D&D 5e 2024.' })
@srdModelOptions('2024-classes')
export class Class2024 {
  @Field(() => String, { description: 'The unique identifier for this class.' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'The name of the class.' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => PrimaryAbility2024, { description: 'The primary ability for this class.' })
  @prop({ type: () => PrimaryAbility2024, required: true })
  public primary_ability!: PrimaryAbility2024

  @Field(() => Int, { description: 'The hit die size for this class (e.g., 6, 8, 10, 12).' })
  @prop({ required: true, type: () => Number })
  public hit_die!: number

  @Field(() => String, { description: 'URL path to the class levels resource.' })
  @prop({ required: true, type: () => String })
  public class_levels!: string

  @Field(() => MultiClassing2024, { nullable: true, description: 'Multi-classing requirements.' })
  @prop({ type: () => MultiClassing2024 })
  public multi_classing?: MultiClassing2024

  @Field(() => [Proficiency2024], {
    nullable: true,
    description: 'Base proficiencies granted by this class.'
  })
  @prop({ type: () => [APIReference] })
  public proficiencies?: APIReference[]

  @prop({ type: () => [Choice], required: true })
  public proficiency_choices!: Choice[]

  @Field(() => [AbilityScore2024], {
    nullable: true,
    description: 'Saving throw proficiencies granted by this class.'
  })
  @prop({ type: () => [APIReference] })
  public saving_throws?: APIReference[]

  @prop({ type: () => [Choice], required: true })
  public starting_equipment_options!: Choice[]

  @Field(() => [Subclass2024], { nullable: true, description: 'Available subclasses.' })
  @prop({ type: () => [APIReference] })
  public subclasses?: APIReference[]

  @Field(() => Spellcasting2024, { nullable: true, description: 'Spellcasting details.' })
  @prop({ type: () => Spellcasting2024 })
  public spellcasting?: Spellcasting2024

  @Field(() => String, {
    nullable: true,
    description: 'URL path to the class spells resource.'
  })
  @prop({ type: () => String })
  public spells?: string

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type ClassDocument = DocumentType<Class2024>
const ClassModel = getModelForClass(Class2024)

export default ClassModel
