import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { APIReference } from '@/models/2014/common'
import { srdModelOptions } from '@/util/modelOptions'
import { ObjectType, Field, Int } from 'type-graphql'

// Export nested classes
@ObjectType({ description: 'Spell slot creation details for Sorcerer levels' })
export class ClassSpecificCreatingSpellSlot {
  @prop({ required: true, index: true, type: () => Number })
  public sorcery_point_cost!: number

  @prop({ required: true, index: true, type: () => Number })
  public spell_slot_level!: number
}

@ObjectType({ description: 'Martial arts details for Monk levels' })
export class ClassSpecificMartialArt {
  @prop({ required: true, index: true, type: () => Number })
  public dice_count!: number

  @prop({ required: true, index: true, type: () => Number })
  public dice_value!: number
}

@ObjectType({ description: 'Sneak attack details for Rogue levels' })
export class ClassSpecificSneakAttack {
  @prop({ required: true, index: true, type: () => Number })
  public dice_count!: number

  @prop({ required: true, index: true, type: () => Number })
  public dice_value!: number
}

@ObjectType({ description: 'Class-specific features and values gained at a level' })
export class ClassSpecific {
  @prop({ index: true, type: () => Number })
  public action_surges?: number

  @prop({ index: true, type: () => Number })
  public arcane_recovery_levels?: number

  @prop({ index: true, type: () => Number })
  public aura_range?: number

  @prop({ index: true, type: () => Number })
  public bardic_inspiration_die?: number

  @prop({ index: true, type: () => Number })
  public brutal_critical_dice?: number

  @prop({ index: true, type: () => Number })
  public channel_divinity_charges?: number

  @prop({ type: () => [ClassSpecificCreatingSpellSlot], default: undefined })
  public creating_spell_slots?: ClassSpecificCreatingSpellSlot[]

  @prop({ index: true, type: () => Number })
  public destroy_undead_cr?: number

  @prop({ index: true, type: () => Number })
  public extra_attacks?: number

  @prop({ index: true, type: () => Number })
  public favored_enemies?: number

  @prop({ index: true, type: () => Number })
  public favored_terrain?: number

  @prop({ index: true, type: () => Number })
  public indomitable_uses?: number

  @prop({ index: true, type: () => Number })
  public invocations_known?: number

  @prop({ index: true, type: () => Number })
  public ki_points?: number

  @prop({ index: true, type: () => Number })
  public magical_secrets_max_5?: number

  @prop({ index: true, type: () => Number })
  public magical_secrets_max_7?: number

  @prop({ index: true, type: () => Number })
  public magical_secrets_max_9?: number

  @prop({ type: () => ClassSpecificMartialArt })
  public martial_arts?: ClassSpecificMartialArt

  @prop({ index: true, type: () => Number })
  public metamagic_known?: number

  @prop({ index: true, type: () => Number })
  public mystic_arcanum_level_6?: number

  @prop({ index: true, type: () => Number })
  public mystic_arcanum_level_7?: number

  @prop({ index: true, type: () => Number })
  public mystic_arcanum_level_8?: number

  @prop({ index: true, type: () => Number })
  public mystic_arcanum_level_9?: number

  @prop({ index: true, type: () => Number })
  public rage_count?: number

  @prop({ index: true, type: () => Number })
  public rage_damage_bonus?: number

  @prop({ type: () => ClassSpecificSneakAttack })
  public sneak_attack?: ClassSpecificSneakAttack

  @prop({ index: true, type: () => Number })
  public song_of_rest_die?: number

  @prop({ index: true, type: () => Number })
  public sorcery_points?: number

  @prop({ index: true, type: () => Number })
  public unarmored_movement?: number

  @prop({ index: true, type: () => Boolean })
  public wild_shape_fly?: boolean

  @prop({ index: true, type: () => Number })
  public wild_shape_max_cr?: number

  @prop({ index: true, type: () => Boolean })
  public wild_shape_swim?: boolean
}

@ObjectType({ description: 'Spellcasting details for a class at a specific level' })
export class LevelSpellcasting {
  @prop({ index: true, type: () => Number })
  public cantrips_known?: number

  @prop({ required: true, index: true, type: () => Number })
  public spell_slots_level_1!: number

  @prop({ required: true, index: true, type: () => Number })
  public spell_slots_level_2!: number

  @prop({ required: true, index: true, type: () => Number })
  public spell_slots_level_3!: number

  @prop({ required: true, index: true, type: () => Number })
  public spell_slots_level_4!: number

  @prop({ required: true, index: true, type: () => Number })
  public spell_slots_level_5!: number

  @prop({ index: true, type: () => Number })
  public spell_slots_level_6?: number

  @prop({ index: true, type: () => Number })
  public spell_slots_level_7?: number

  @prop({ index: true, type: () => Number })
  public spell_slots_level_8?: number

  @prop({ index: true, type: () => Number })
  public spell_slots_level_9?: number

  @prop({ index: true, type: () => Number })
  public spells_known?: number
}

@ObjectType({ description: 'Subclass-specific features and values gained at a level' })
export class SubclassSpecific {
  @prop({ index: true, type: () => Number })
  public additional_magical_secrets_max_lvl?: number

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

  // TODO: Pass 2 - API Reference
  @prop({ type: () => APIReference })
  public class!: APIReference

  // TODO: Pass 2/3 - Complex nested type (ClassSpecific)
  @prop({ type: () => ClassSpecific })
  public class_specific?: ClassSpecific

  // TODO: Pass 2 - API Reference array
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

  // TODO: Pass 2/3 - Complex nested type (LevelSpellcasting)
  @prop({ type: () => LevelSpellcasting })
  public spellcasting?: LevelSpellcasting

  // TODO: Pass 2 - API Reference (Optional)
  @prop({ type: () => APIReference })
  public subclass?: APIReference

  // TODO: Pass 2/3 - Complex nested type (SubclassSpecific)
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
