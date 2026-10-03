import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

import { Class } from './class'
import { Feature } from './feature'
import { Subclass } from './subclass'

// Export nested classes
@ObjectType({ description: 'Spell slot creation details for Sorcerer levels' })
export class ClassSpecificCreatingSpellSlot {
  @field(T.Int, { description: 'Cost in sorcery points.', required: true, index: true })
  public sorcery_point_cost!: number

  @field(T.Int, { description: 'Level of the spell slot created.', required: true, index: true })
  public spell_slot_level!: number
}

@ObjectType({ description: 'Martial arts details for Monk levels' })
export class ClassSpecificMartialArt {
  @field(T.Int, {
    description: 'Number of dice for martial arts damage.',
    required: true,
    index: true
  })
  public dice_count!: number

  @field(T.Int, {
    description: 'Value of the dice used (e.g., 4 for d4).',
    required: true,
    index: true
  })
  public dice_value!: number
}

@ObjectType({ description: 'Sneak attack details for Rogue levels' })
export class ClassSpecificSneakAttack {
  @field(T.Int, {
    description: 'Number of dice for sneak attack damage.',
    required: true,
    index: true
  })
  public dice_count!: number

  @field(T.Int, {
    description: 'Value of the dice used (e.g., 6 for d6).',
    required: true,
    index: true
  })
  public dice_value!: number
}

@ObjectType({ description: 'Class-specific features and values gained at a level' })
export class ClassSpecific {
  @field(T.Int, {
    description: 'Number of Action Surges available.',
    index: true,
    gql: { nullable: true }
  })
  public action_surges?: number

  @field(T.Int, {
    description: 'Maximum spell level recoverable via Arcane Recovery.',
    index: true,
    gql: { nullable: true }
  })
  public arcane_recovery_levels?: number

  @field(T.Int, {
    description: 'Range of Paladin auras in feet.',
    index: true,
    gql: { nullable: true }
  })
  public aura_range?: number

  @field(T.Int, {
    description: 'Die size for Bardic Inspiration (e.g., 6 for d6).',
    index: true,
    gql: { nullable: true }
  })
  public bardic_inspiration_die?: number

  @field(T.Int, {
    description: "Number of extra damage dice for Barbarian's Brutal Critical.",
    index: true,
    gql: { nullable: true }
  })
  public brutal_critical_dice?: number

  @field(T.Int, {
    description: 'Number of uses for Channel Divinity.',
    index: true,
    gql: { nullable: true }
  })
  public channel_divinity_charges?: number

  @field(T.List(() => ClassSpecificCreatingSpellSlot), {
    description: 'Sorcerer spell slot creation options.',
    gql: { nullable: true },
    db: { default: undefined }
  })
  public creating_spell_slots?: ClassSpecificCreatingSpellSlot[]

  @field(T.Float, {
    description: 'Maximum Challenge Rating of undead that can be destroyed by Channel Divinity.',
    index: true,
    gql: { nullable: true }
  })
  public destroy_undead_cr?: number

  @field(T.Int, {
    description: 'Number of extra attacks granted.',
    index: true,
    gql: { nullable: true }
  })
  public extra_attacks?: number

  @field(T.Int, {
    description: 'Number of favored enemies known by Ranger.',
    index: true,
    gql: { nullable: true }
  })
  public favored_enemies?: number

  @field(T.Int, {
    description: 'Number of favored terrains known by Ranger.',
    index: true,
    gql: { nullable: true }
  })
  public favored_terrain?: number

  @field(T.Int, {
    description: "Number of uses for Fighter's Indomitable feature.",
    index: true,
    gql: { nullable: true }
  })
  public indomitable_uses?: number

  @field(T.Int, {
    description: 'Number of Warlock invocations known.',
    index: true,
    gql: { nullable: true }
  })
  public invocations_known?: number

  @field(T.Int, { description: 'Number of Monk ki points.', index: true, gql: { nullable: true } })
  public ki_points?: number

  @field(T.Int, {
    description: "Maximum level of spells gained via Bard's Magical Secrets (up to level 5).",
    index: true,
    gql: { nullable: true }
  })
  public magical_secrets_max_5?: number

  @field(T.Int, {
    description: "Maximum level of spells gained via Bard's Magical Secrets (up to level 7).",
    index: true,
    gql: { nullable: true }
  })
  public magical_secrets_max_7?: number

  @field(T.Int, {
    description: "Maximum level of spells gained via Bard's Magical Secrets (up to level 9).",
    index: true,
    gql: { nullable: true }
  })
  public magical_secrets_max_9?: number

  @field(T.Model(() => ClassSpecificMartialArt), {
    description: 'Monk martial arts damage progression.',
    gql: { nullable: true }
  })
  public martial_arts?: ClassSpecificMartialArt

  @field(T.Int, {
    description: 'Number of Sorcerer metamagic options known.',
    index: true,
    gql: { nullable: true }
  })
  public metamagic_known?: number

  @field(T.Int, {
    description: 'Indicates if Warlock gained level 6 Mystic Arcanum (1 = yes).',
    index: true,
    gql: { nullable: true }
  })
  public mystic_arcanum_level_6?: number

  @field(T.Int, {
    description: 'Indicates if Warlock gained level 7 Mystic Arcanum (1 = yes).',
    index: true,
    gql: { nullable: true }
  })
  public mystic_arcanum_level_7?: number

  @field(T.Int, {
    description: 'Indicates if Warlock gained level 8 Mystic Arcanum (1 = yes).',
    index: true,
    gql: { nullable: true }
  })
  public mystic_arcanum_level_8?: number

  @field(T.Int, {
    description: 'Indicates if Warlock gained level 9 Mystic Arcanum (1 = yes).',
    index: true,
    gql: { nullable: true }
  })
  public mystic_arcanum_level_9?: number

  @field(T.Int, {
    description: 'Number of Barbarian rages per long rest.',
    index: true,
    gql: { nullable: true }
  })
  public rage_count?: number

  @field(T.Int, {
    description: 'Damage bonus added to Barbarian rage attacks.',
    index: true,
    gql: { nullable: true }
  })
  public rage_damage_bonus?: number

  @field(T.Model(() => ClassSpecificSneakAttack), {
    description: 'Rogue sneak attack damage progression.',
    gql: { nullable: true }
  })
  public sneak_attack?: ClassSpecificSneakAttack

  @field(T.Int, {
    description: "Die size for Bard's Song of Rest (e.g., 6 for d6).",
    index: true,
    gql: { nullable: true }
  })
  public song_of_rest_die?: number

  @field(T.Int, {
    description: 'Number of Sorcerer sorcery points.',
    index: true,
    gql: { nullable: true }
  })
  public sorcery_points?: number

  @field(T.Int, {
    description: "Bonus speed for Monk's Unarmored Movement in feet.",
    index: true,
    gql: { nullable: true }
  })
  public unarmored_movement?: number

  @field(T.Bool, {
    description: "Indicates if Druid's Wild Shape allows flying.",
    index: true,
    gql: { nullable: true }
  })
  public wild_shape_fly?: boolean

  @field(T.Float, {
    description: "Maximum Challenge Rating for Druid's Wild Shape form.",
    index: true,
    gql: { nullable: true }
  })
  public wild_shape_max_cr?: number

  @field(T.Bool, {
    description: "Indicates if Druid's Wild Shape allows swimming.",
    index: true,
    gql: { nullable: true }
  })
  public wild_shape_swim?: boolean
}

@ObjectType({ description: 'Spellcasting details for a class at a specific level' })
export class LevelSpellcasting {
  @field(T.Int, { description: 'Number of cantrips known.', index: true, gql: { nullable: true } })
  public cantrips_known?: number

  @field(T.Int, { description: 'Number of level 1 spell slots.', required: true, index: true })
  public spell_slots_level_1!: number

  @field(T.Int, { description: 'Number of level 2 spell slots.', required: true, index: true })
  public spell_slots_level_2!: number

  @field(T.Int, { description: 'Number of level 3 spell slots.', required: true, index: true })
  public spell_slots_level_3!: number

  @field(T.Int, { description: 'Number of level 4 spell slots.', required: true, index: true })
  public spell_slots_level_4!: number

  @field(T.Int, { description: 'Number of level 5 spell slots.', required: true, index: true })
  public spell_slots_level_5!: number

  @field(T.Int, {
    description: 'Number of level 6 spell slots.',
    index: true,
    gql: { nullable: true }
  })
  public spell_slots_level_6?: number

  @field(T.Int, {
    description: 'Number of level 7 spell slots.',
    index: true,
    gql: { nullable: true }
  })
  public spell_slots_level_7?: number

  @field(T.Int, {
    description: 'Number of level 8 spell slots.',
    index: true,
    gql: { nullable: true }
  })
  public spell_slots_level_8?: number

  @field(T.Int, {
    description: 'Number of level 9 spell slots.',
    index: true,
    gql: { nullable: true }
  })
  public spell_slots_level_9?: number

  @field(T.Int, {
    description: 'Total number of spells known (for certain classes like Sorcerer).',
    index: true,
    gql: { nullable: true }
  })
  public spells_known?: number
}

@ObjectType({ description: 'Subclass-specific features and values gained at a level' })
export class SubclassSpecific {
  @field(T.Int, {
    description: "Maximum level of spells gained via Bard's Additional Magical Secrets.",
    index: true,
    gql: { nullable: true }
  })
  public additional_magical_secrets_max_lvl?: number

  @field(T.Int, {
    description: 'Range of subclass-specific auras (e.g., Paladin) in feet.',
    index: true,
    gql: { nullable: true }
  })
  public aura_range?: number
}

@ObjectType({
  description: 'Represents the features and abilities gained at a specific class level'
})
@srdModelOptions('2014-levels')
export class Level {
  @field(T.Int, {
    description: 'Number of ability score bonuses gained at this level',
    index: true,
    gql: { nullable: true }
  })
  public ability_score_bonuses?: number

  @field(T.Ref(() => Class), {
    description: 'The class this level belongs to.',
    gql: { nullable: true }
  })
  public class!: APIReference

  @field(T.Model(() => ClassSpecific), {
    description: 'Class-specific details for this level.',
    gql: { nullable: true }
  })
  public class_specific?: ClassSpecific

  @field(T.RefList(() => Feature), {
    description: 'Features gained at this level.',
    gql: { nullable: true }
  })
  public features?: APIReference[]

  @field(T.String, {
    description: 'Unique identifier for this level (e.g., barbarian-1, rogue-20)',
    required: true,
    index: true
  })
  public index!: string

  @field(T.Int, { description: 'The class level (1-20)', required: true, index: true })
  public level!: number

  @field(T.Int, {
    description: 'Proficiency bonus gained at this level',
    index: true,
    gql: { nullable: true }
  })
  public prof_bonus?: number

  @field(T.Model(() => LevelSpellcasting), {
    description: 'Spellcasting progression details for this level.',
    gql: { nullable: true }
  })
  public spellcasting?: LevelSpellcasting

  @field(T.Ref(() => Subclass), {
    description: 'The subclass this level relates to, if applicable.',
    gql: { nullable: true }
  })
  public subclass?: APIReference

  @field(T.Model(() => SubclassSpecific), {
    description: 'Subclass-specific details for this level.',
    gql: { nullable: true }
  })
  public subclass_specific?: SubclassSpecific

  // url field is not exposed via GraphQL
  @field(T.String, { required: true, index: true, gql: false })
  public url!: string

  @field(T.String, { description: 'Timestamp of the last update', required: true, index: true })
  public updated_at!: string
}

export type LevelDocument = DocumentType<Level>
const LevelModel = getModelForClass(Level)

export default LevelModel
