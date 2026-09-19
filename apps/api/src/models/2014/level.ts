import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, Float, Int, ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { srdModelOptions } from '@/util/modelOptions'

import { Class } from './class'
import { Feature } from './feature'
import { Subclass } from './subclass'

// Export nested classes
@ObjectType({ description: 'Spell slot creation details for Sorcerer levels' })
export class ClassSpecificCreatingSpellSlot {
  @Field(() => Int, { description: 'Cost in sorcery points.' })
  @prop({ required: true, index: true, type: () => Number })
  public sorcery_point_cost!: number

  @Field(() => Int, { description: 'Level of the spell slot created.' })
  @prop({ required: true, index: true, type: () => Number })
  public spell_slot_level!: number
}

@ObjectType({ description: 'Martial arts details for Monk levels' })
export class ClassSpecificMartialArt {
  @Field(() => Int, { description: 'Number of dice for martial arts damage.' })
  @prop({ required: true, index: true, type: () => Number })
  public dice_count!: number

  @Field(() => Int, { description: 'Value of the dice used (e.g., 4 for d4).' })
  @prop({ required: true, index: true, type: () => Number })
  public dice_value!: number
}

@ObjectType({ description: 'Sneak attack details for Rogue levels' })
export class ClassSpecificSneakAttack {
  @Field(() => Int, { description: 'Number of dice for sneak attack damage.' })
  @prop({ required: true, index: true, type: () => Number })
  public dice_count!: number

  @Field(() => Int, { description: 'Value of the dice used (e.g., 6 for d6).' })
  @prop({ required: true, index: true, type: () => Number })
  public dice_value!: number
}

@ObjectType({ description: 'Class-specific features and values gained at a level' })
export class ClassSpecific {
  @Field(() => Int, { nullable: true, description: 'Number of Action Surges available.' })
  @prop({ index: true, type: () => Number })
  public action_surges?: number

  @Field(() => Int, {
    nullable: true,
    description: 'Maximum spell level recoverable via Arcane Recovery.'
  })
  @prop({ index: true, type: () => Number })
  public arcane_recovery_levels?: number

  @Field(() => Int, { nullable: true, description: 'Range of Paladin auras in feet.' })
  @prop({ index: true, type: () => Number })
  public aura_range?: number

  @Field(() => Int, {
    nullable: true,
    description: 'Die size for Bardic Inspiration (e.g., 6 for d6).'
  })
  @prop({ index: true, type: () => Number })
  public bardic_inspiration_die?: number

  @Field(() => Int, {
    nullable: true,
    description: "Number of extra damage dice for Barbarian's Brutal Critical."
  })
  @prop({ index: true, type: () => Number })
  public brutal_critical_dice?: number

  @Field(() => Int, { nullable: true, description: 'Number of uses for Channel Divinity.' })
  @prop({ index: true, type: () => Number })
  public channel_divinity_charges?: number

  @Field(() => [ClassSpecificCreatingSpellSlot], {
    nullable: true,
    description: 'Sorcerer spell slot creation options.'
  })
  @prop({ type: () => [ClassSpecificCreatingSpellSlot], default: undefined })
  public creating_spell_slots?: ClassSpecificCreatingSpellSlot[]

  @Field(() => Float, {
    nullable: true,
    description: 'Maximum Challenge Rating of undead that can be destroyed by Channel Divinity.'
  })
  @prop({ index: true, type: () => Number })
  public destroy_undead_cr?: number

  @Field(() => Int, { nullable: true, description: 'Number of extra attacks granted.' })
  @prop({ index: true, type: () => Number })
  public extra_attacks?: number

  @Field(() => Int, { nullable: true, description: 'Number of favored enemies known by Ranger.' })
  @prop({ index: true, type: () => Number })
  public favored_enemies?: number

  @Field(() => Int, { nullable: true, description: 'Number of favored terrains known by Ranger.' })
  @prop({ index: true, type: () => Number })
  public favored_terrain?: number

  @Field(() => Int, {
    nullable: true,
    description: "Number of uses for Fighter's Indomitable feature."
  })
  @prop({ index: true, type: () => Number })
  public indomitable_uses?: number

  @Field(() => Int, { nullable: true, description: 'Number of Warlock invocations known.' })
  @prop({ index: true, type: () => Number })
  public invocations_known?: number

  @Field(() => Int, { nullable: true, description: 'Number of Monk ki points.' })
  @prop({ index: true, type: () => Number })
  public ki_points?: number

  @Field(() => Int, {
    nullable: true,
    description: "Maximum level of spells gained via Bard's Magical Secrets (up to level 5)."
  })
  @prop({ index: true, type: () => Number })
  public magical_secrets_max_5?: number

  @Field(() => Int, {
    nullable: true,
    description: "Maximum level of spells gained via Bard's Magical Secrets (up to level 7)."
  })
  @prop({ index: true, type: () => Number })
  public magical_secrets_max_7?: number

  @Field(() => Int, {
    nullable: true,
    description: "Maximum level of spells gained via Bard's Magical Secrets (up to level 9)."
  })
  @prop({ index: true, type: () => Number })
  public magical_secrets_max_9?: number

  @Field(() => ClassSpecificMartialArt, {
    nullable: true,
    description: 'Monk martial arts damage progression.'
  })
  @prop({ type: () => ClassSpecificMartialArt })
  public martial_arts?: ClassSpecificMartialArt

  @Field(() => Int, { nullable: true, description: 'Number of Sorcerer metamagic options known.' })
  @prop({ index: true, type: () => Number })
  public metamagic_known?: number

  @Field(() => Int, {
    nullable: true,
    description: 'Indicates if Warlock gained level 6 Mystic Arcanum (1 = yes).'
  })
  @prop({ index: true, type: () => Number })
  public mystic_arcanum_level_6?: number

  @Field(() => Int, {
    nullable: true,
    description: 'Indicates if Warlock gained level 7 Mystic Arcanum (1 = yes).'
  })
  @prop({ index: true, type: () => Number })
  public mystic_arcanum_level_7?: number

  @Field(() => Int, {
    nullable: true,
    description: 'Indicates if Warlock gained level 8 Mystic Arcanum (1 = yes).'
  })
  @prop({ index: true, type: () => Number })
  public mystic_arcanum_level_8?: number

  @Field(() => Int, {
    nullable: true,
    description: 'Indicates if Warlock gained level 9 Mystic Arcanum (1 = yes).'
  })
  @prop({ index: true, type: () => Number })
  public mystic_arcanum_level_9?: number

  @Field(() => Int, { nullable: true, description: 'Number of Barbarian rages per long rest.' })
  @prop({ index: true, type: () => Number })
  public rage_count?: number

  @Field(() => Int, {
    nullable: true,
    description: 'Damage bonus added to Barbarian rage attacks.'
  })
  @prop({ index: true, type: () => Number })
  public rage_damage_bonus?: number

  @Field(() => ClassSpecificSneakAttack, {
    nullable: true,
    description: 'Rogue sneak attack damage progression.'
  })
  @prop({ type: () => ClassSpecificSneakAttack })
  public sneak_attack?: ClassSpecificSneakAttack

  @Field(() => Int, {
    nullable: true,
    description: "Die size for Bard's Song of Rest (e.g., 6 for d6)."
  })
  @prop({ index: true, type: () => Number })
  public song_of_rest_die?: number

  @Field(() => Int, { nullable: true, description: 'Number of Sorcerer sorcery points.' })
  @prop({ index: true, type: () => Number })
  public sorcery_points?: number

  @Field(() => Int, {
    nullable: true,
    description: "Bonus speed for Monk's Unarmored Movement in feet."
  })
  @prop({ index: true, type: () => Number })
  public unarmored_movement?: number

  @Field(() => Boolean, {
    nullable: true,
    description: "Indicates if Druid's Wild Shape allows flying."
  })
  @prop({ index: true, type: () => Boolean })
  public wild_shape_fly?: boolean

  @Field(() => Float, {
    nullable: true,
    description: "Maximum Challenge Rating for Druid's Wild Shape form."
  })
  @prop({ index: true, type: () => Number })
  public wild_shape_max_cr?: number

  @Field(() => Boolean, {
    nullable: true,
    description: "Indicates if Druid's Wild Shape allows swimming."
  })
  @prop({ index: true, type: () => Boolean })
  public wild_shape_swim?: boolean
}

@ObjectType({ description: 'Spellcasting details for a class at a specific level' })
export class LevelSpellcasting {
  @Field(() => Int, { nullable: true, description: 'Number of cantrips known.' })
  @prop({ index: true, type: () => Number })
  public cantrips_known?: number

  @Field(() => Int, { description: 'Number of level 1 spell slots.' })
  @prop({ required: true, index: true, type: () => Number })
  public spell_slots_level_1!: number

  @Field(() => Int, { description: 'Number of level 2 spell slots.' })
  @prop({ required: true, index: true, type: () => Number })
  public spell_slots_level_2!: number

  @Field(() => Int, { description: 'Number of level 3 spell slots.' })
  @prop({ required: true, index: true, type: () => Number })
  public spell_slots_level_3!: number

  @Field(() => Int, { description: 'Number of level 4 spell slots.' })
  @prop({ required: true, index: true, type: () => Number })
  public spell_slots_level_4!: number

  @Field(() => Int, { description: 'Number of level 5 spell slots.' })
  @prop({ required: true, index: true, type: () => Number })
  public spell_slots_level_5!: number

  @Field(() => Int, { nullable: true, description: 'Number of level 6 spell slots.' })
  @prop({ index: true, type: () => Number })
  public spell_slots_level_6?: number

  @Field(() => Int, { nullable: true, description: 'Number of level 7 spell slots.' })
  @prop({ index: true, type: () => Number })
  public spell_slots_level_7?: number

  @Field(() => Int, { nullable: true, description: 'Number of level 8 spell slots.' })
  @prop({ index: true, type: () => Number })
  public spell_slots_level_8?: number

  @Field(() => Int, { nullable: true, description: 'Number of level 9 spell slots.' })
  @prop({ index: true, type: () => Number })
  public spell_slots_level_9?: number

  @Field(() => Int, {
    nullable: true,
    description: 'Total number of spells known (for certain classes like Sorcerer).'
  })
  @prop({ index: true, type: () => Number })
  public spells_known?: number
}

@ObjectType({ description: 'Subclass-specific features and values gained at a level' })
export class SubclassSpecific {
  @Field(() => Int, {
    nullable: true,
    description: "Maximum level of spells gained via Bard's Additional Magical Secrets."
  })
  @prop({ index: true, type: () => Number })
  public additional_magical_secrets_max_lvl?: number

  @Field(() => Int, {
    nullable: true,
    description: 'Range of subclass-specific auras (e.g., Paladin) in feet.'
  })
  @prop({ index: true, type: () => Number })
  public aura_range?: number
}

@ObjectType({
  description: 'Represents the features and abilities gained at a specific class level'
})
@srdModelOptions('2014-levels')
export class Level {
  @Field(() => Int, {
    nullable: true,
    description: 'Number of ability score bonuses gained at this level'
  })
  @prop({ index: true, type: () => Number })
  public ability_score_bonuses?: number

  @Field(() => Class, { nullable: true, description: 'The class this level belongs to.' })
  @prop({ type: () => APIReference })
  public class!: APIReference

  @Field(() => ClassSpecific, {
    nullable: true,
    description: 'Class-specific details for this level.'
  })
  @prop({ type: () => ClassSpecific })
  public class_specific?: ClassSpecific

  @Field(() => [Feature], { nullable: true, description: 'Features gained at this level.' })
  @prop({ type: () => [APIReference] })
  public features?: APIReference[]

  @Field(() => String, {
    description: 'Unique identifier for this level (e.g., barbarian-1, rogue-20)'
  })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => Int, { description: 'The class level (1-20)' })
  @prop({ required: true, index: true, type: () => Number })
  public level!: number

  @Field(() => Int, { nullable: true, description: 'Proficiency bonus gained at this level' })
  @prop({ index: true, type: () => Number })
  public prof_bonus?: number

  @Field(() => LevelSpellcasting, {
    nullable: true,
    description: 'Spellcasting progression details for this level.'
  })
  @prop({ type: () => LevelSpellcasting })
  public spellcasting?: LevelSpellcasting

  @Field(() => Subclass, {
    nullable: true,
    description: 'The subclass this level relates to, if applicable.'
  })
  @prop({ type: () => APIReference })
  public subclass?: APIReference

  @Field(() => SubclassSpecific, {
    nullable: true,
    description: 'Subclass-specific details for this level.'
  })
  @prop({ type: () => SubclassSpecific })
  public subclass_specific?: SubclassSpecific

  // url field is not exposed via GraphQL
  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type LevelDocument = DocumentType<Level>
const LevelModel = getModelForClass(Level)

export default LevelModel
