import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { Class2024 } from '@/models/2024/class'
import { Feature2024 } from '@/models/2024/feature'
import { Subclass2024 } from '@/models/2024/subclass'
import { APIReference } from '@/models/common/apiReference'
import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({ description: 'Sneak Attack dice progression for a 2024 Rogue level.' })
export class ClassSpecificSneakAttack2024 {
  @field(T.Int, { description: 'Number of dice for sneak attack damage.', required: true })
  public dice_count!: number

  @field(T.Int, { description: 'Value of the dice used (e.g., 6 for d6).', required: true })
  public dice_value!: number
}

@ObjectType({ description: 'Class-specific features and values gained at a 2024 level.' })
export class ClassSpecific2024 {
  @field(T.Int, { description: 'Die size for Bardic Inspiration.', gql: { nullable: true } })
  public bardic_inspiration_die?: number

  @field(T.Int, { description: 'Number of uses for Channel Divinity.', gql: { nullable: true } })
  public channel_divinity_charges?: number

  @field(T.Int, {
    description: 'Number of Warlock Eldritch Invocations known.',
    gql: { nullable: true }
  })
  public eldritch_invocations?: number

  @field(T.Int, {
    description: 'Number of favored enemies known by Ranger.',
    gql: { nullable: true }
  })
  public favored_enemies?: number

  @field(T.Int, { description: 'Number of Monk Focus points.', gql: { nullable: true } })
  public focus_points?: number

  @field(T.Int, { description: 'Die size for Monk martial arts damage.', gql: { nullable: true } })
  public martial_arts_die?: number

  @field(T.Int, {
    description: 'Number of Barbarian rages per long rest.',
    gql: { nullable: true }
  })
  public rage_count?: number

  @field(T.Int, {
    description: 'Damage bonus added to Barbarian rage attacks.',
    gql: { nullable: true }
  })
  public rage_damage_bonus?: number

  @field(T.Int, {
    description: "Number of uses for Fighter's Second Wind.",
    gql: { nullable: true }
  })
  public second_wind_uses?: number

  @field(T.Model(() => ClassSpecificSneakAttack2024), {
    description: 'Rogue sneak attack damage progression.',
    gql: { nullable: true }
  })
  public sneak_attack?: ClassSpecificSneakAttack2024

  @field(T.Int, { description: 'Number of Sorcerer sorcery points.', gql: { nullable: true } })
  public sorcery_points?: number

  @field(T.Int, {
    description: "Bonus speed for Monk's Unarmored Movement in feet.",
    gql: { nullable: true }
  })
  public unarmored_movement_bonus?: number

  @field(T.Int, {
    description: 'Number of Weapon Mastery properties known.',
    gql: { nullable: true }
  })
  public weapon_mastery?: number

  @field(T.Int, { description: "Number of uses for Druid's Wild Shape.", gql: { nullable: true } })
  public wild_shape_uses?: number
}

@ObjectType({ description: 'Spellcasting details for a 2024 class at a specific level.' })
export class LevelSpellcasting2024 {
  @field(T.Int, { description: 'Number of cantrips known.', gql: { nullable: true } })
  public cantrips_known?: number

  @field(T.Int, { description: 'Number of prepared spells.', gql: { nullable: true } })
  public prepared_spells?: number

  @field(T.Int, { description: 'Number of level 1 spell slots.', required: true })
  public spell_slots_level_1!: number

  @field(T.Int, { description: 'Number of level 2 spell slots.', required: true })
  public spell_slots_level_2!: number

  @field(T.Int, { description: 'Number of level 3 spell slots.', required: true })
  public spell_slots_level_3!: number

  @field(T.Int, { description: 'Number of level 4 spell slots.', required: true })
  public spell_slots_level_4!: number

  @field(T.Int, { description: 'Number of level 5 spell slots.', required: true })
  public spell_slots_level_5!: number

  @field(T.Int, { description: 'Number of level 6 spell slots.', gql: { nullable: true } })
  public spell_slots_level_6?: number

  @field(T.Int, { description: 'Number of level 7 spell slots.', gql: { nullable: true } })
  public spell_slots_level_7?: number

  @field(T.Int, { description: 'Number of level 8 spell slots.', gql: { nullable: true } })
  public spell_slots_level_8?: number

  @field(T.Int, { description: 'Number of level 9 spell slots.', gql: { nullable: true } })
  public spell_slots_level_9?: number
}

@ObjectType({
  description: 'Represents the features and abilities gained at a specific 2024 class level.'
})
@srdModelOptions('2024-levels')
export class Level2024 {
  @field(T.String, {
    description: 'Unique identifier for this level (e.g., barbarian-1, berserker-3).',
    required: true,
    index: true
  })
  public index!: string

  @field(T.String, { description: 'The name of this level.', required: true, index: true })
  public name!: string

  @field(T.Int, { description: 'The class level (1-20).', required: true, index: true })
  public level!: number

  @field(T.Int, {
    description: 'Proficiency bonus gained at this level.',
    index: true,
    gql: { nullable: true }
  })
  public prof_bonus?: number

  @field(T.RefList(() => Feature2024), {
    description: 'Features gained at this level.',
    gql: { nullable: true }
  })
  public features?: APIReference[]

  @field(T.Ref(() => Class2024), {
    description: 'The class this level belongs to.',
    required: true
  })
  public class!: APIReference

  @field(T.Ref(() => Subclass2024), {
    description: 'The subclass this level relates to, if applicable.',
    gql: { nullable: true }
  })
  public subclass?: APIReference

  @field(T.Model(() => ClassSpecific2024), {
    description: 'Class-specific details for this level.',
    gql: { nullable: true }
  })
  public class_specific?: ClassSpecific2024

  @field(T.Model(() => LevelSpellcasting2024), {
    description: 'Spellcasting progression details for this level.',
    gql: { nullable: true }
  })
  public spellcasting?: LevelSpellcasting2024

  // url field is not exposed via GraphQL
  @field(T.String, { required: true, index: true, gql: false })
  public url!: string

  @field(T.String, { description: 'Timestamp of the last update.', required: true, index: true })
  public updated_at!: string
}

export type Level2024Document = DocumentType<Level2024>
const Level2024Model = getModelForClass(Level2024)

export default Level2024Model
