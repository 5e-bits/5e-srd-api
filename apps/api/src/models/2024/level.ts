import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, Int, ObjectType } from 'type-graphql'

import { Class2024 } from '@/models/2024/class'
import { Feature2024 } from '@/models/2024/feature'
import { Subclass2024 } from '@/models/2024/subclass'
import { APIReference } from '@/models/common/apiReference'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({ description: 'Sneak Attack dice progression for a 2024 Rogue level.' })
export class ClassSpecificSneakAttack2024 {
  @Field(() => Int, { description: 'Number of dice for sneak attack damage.' })
  @prop({ required: true, type: () => Number })
  public dice_count!: number

  @Field(() => Int, { description: 'Value of the dice used (e.g., 6 for d6).' })
  @prop({ required: true, type: () => Number })
  public dice_value!: number
}

@ObjectType({ description: 'Class-specific features and values gained at a 2024 level.' })
export class ClassSpecific2024 {
  @Field(() => Int, { nullable: true, description: 'Die size for Bardic Inspiration.' })
  @prop({ type: () => Number })
  public bardic_inspiration_die?: number

  @Field(() => Int, { nullable: true, description: 'Number of uses for Channel Divinity.' })
  @prop({ type: () => Number })
  public channel_divinity_charges?: number

  @Field(() => Int, {
    nullable: true,
    description: 'Number of Warlock Eldritch Invocations known.'
  })
  @prop({ type: () => Number })
  public eldritch_invocations?: number

  @Field(() => Int, { nullable: true, description: 'Number of favored enemies known by Ranger.' })
  @prop({ type: () => Number })
  public favored_enemies?: number

  @Field(() => Int, { nullable: true, description: 'Number of Monk Focus points.' })
  @prop({ type: () => Number })
  public focus_points?: number

  @Field(() => Int, { nullable: true, description: 'Die size for Monk martial arts damage.' })
  @prop({ type: () => Number })
  public martial_arts_die?: number

  @Field(() => Int, { nullable: true, description: 'Number of Barbarian rages per long rest.' })
  @prop({ type: () => Number })
  public rage_count?: number

  @Field(() => Int, {
    nullable: true,
    description: 'Damage bonus added to Barbarian rage attacks.'
  })
  @prop({ type: () => Number })
  public rage_damage_bonus?: number

  @Field(() => Int, { nullable: true, description: "Number of uses for Fighter's Second Wind." })
  @prop({ type: () => Number })
  public second_wind_uses?: number

  @Field(() => ClassSpecificSneakAttack2024, {
    nullable: true,
    description: 'Rogue sneak attack damage progression.'
  })
  @prop({ type: () => ClassSpecificSneakAttack2024 })
  public sneak_attack?: ClassSpecificSneakAttack2024

  @Field(() => Int, { nullable: true, description: 'Number of Sorcerer sorcery points.' })
  @prop({ type: () => Number })
  public sorcery_points?: number

  @Field(() => Int, {
    nullable: true,
    description: "Bonus speed for Monk's Unarmored Movement in feet."
  })
  @prop({ type: () => Number })
  public unarmored_movement_bonus?: number

  @Field(() => Int, { nullable: true, description: 'Number of Weapon Mastery properties known.' })
  @prop({ type: () => Number })
  public weapon_mastery?: number

  @Field(() => Int, { nullable: true, description: "Number of uses for Druid's Wild Shape." })
  @prop({ type: () => Number })
  public wild_shape_uses?: number
}

@ObjectType({ description: 'Spellcasting details for a 2024 class at a specific level.' })
export class LevelSpellcasting2024 {
  @Field(() => Int, { nullable: true, description: 'Number of cantrips known.' })
  @prop({ type: () => Number })
  public cantrips_known?: number

  @Field(() => Int, { nullable: true, description: 'Number of prepared spells.' })
  @prop({ type: () => Number })
  public prepared_spells?: number

  @Field(() => Int, { description: 'Number of level 1 spell slots.' })
  @prop({ required: true, type: () => Number })
  public spell_slots_level_1!: number

  @Field(() => Int, { description: 'Number of level 2 spell slots.' })
  @prop({ required: true, type: () => Number })
  public spell_slots_level_2!: number

  @Field(() => Int, { description: 'Number of level 3 spell slots.' })
  @prop({ required: true, type: () => Number })
  public spell_slots_level_3!: number

  @Field(() => Int, { description: 'Number of level 4 spell slots.' })
  @prop({ required: true, type: () => Number })
  public spell_slots_level_4!: number

  @Field(() => Int, { description: 'Number of level 5 spell slots.' })
  @prop({ required: true, type: () => Number })
  public spell_slots_level_5!: number

  @Field(() => Int, { nullable: true, description: 'Number of level 6 spell slots.' })
  @prop({ type: () => Number })
  public spell_slots_level_6?: number

  @Field(() => Int, { nullable: true, description: 'Number of level 7 spell slots.' })
  @prop({ type: () => Number })
  public spell_slots_level_7?: number

  @Field(() => Int, { nullable: true, description: 'Number of level 8 spell slots.' })
  @prop({ type: () => Number })
  public spell_slots_level_8?: number

  @Field(() => Int, { nullable: true, description: 'Number of level 9 spell slots.' })
  @prop({ type: () => Number })
  public spell_slots_level_9?: number
}

@ObjectType({
  description: 'Represents the features and abilities gained at a specific 2024 class level.'
})
@srdModelOptions('2024-levels')
export class Level2024 {
  @Field(() => String, {
    description: 'Unique identifier for this level (e.g., barbarian-1, berserker-3).'
  })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'The name of this level.' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => Int, { description: 'The class level (1-20).' })
  @prop({ required: true, index: true, type: () => Number })
  public level!: number

  @Field(() => Int, { nullable: true, description: 'Proficiency bonus gained at this level.' })
  @prop({ index: true, type: () => Number })
  public prof_bonus?: number

  @Field(() => [Feature2024], { nullable: true, description: 'Features gained at this level.' })
  @prop({ type: () => [APIReference] })
  public features?: APIReference[]

  @Field(() => Class2024, { description: 'The class this level belongs to.' })
  @prop({ type: () => APIReference, required: true })
  public class!: APIReference

  @Field(() => Subclass2024, {
    nullable: true,
    description: 'The subclass this level relates to, if applicable.'
  })
  @prop({ type: () => APIReference })
  public subclass?: APIReference

  @Field(() => ClassSpecific2024, {
    nullable: true,
    description: 'Class-specific details for this level.'
  })
  @prop({ type: () => ClassSpecific2024 })
  public class_specific?: ClassSpecific2024

  @Field(() => LevelSpellcasting2024, {
    nullable: true,
    description: 'Spellcasting progression details for this level.'
  })
  @prop({ type: () => LevelSpellcasting2024 })
  public spellcasting?: LevelSpellcasting2024

  // url field is not exposed via GraphQL
  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type Level2024Document = DocumentType<Level2024>
const Level2024Model = getModelForClass(Level2024)

export default Level2024Model
