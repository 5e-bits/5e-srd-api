import { getModelForClass, prop } from '@typegoose/typegoose';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { APIReference } from '@/models/2014/common/index.js';

class ClassSpecificCreatingSpellSlot {
  @prop({ required: true, index: true })
  public sorcery_point_cost!: number;

  @prop({ required: true, index: true })
  public spell_slot_level!: number;
}

class ClassSpecificMartialArt {
  @prop({ required: true, index: true })
  public dice_count!: number;

  @prop({ required: true, index: true })
  public dice_value!: number;
}

class ClassSpecificSneakAttack {
  @prop({ required: true, index: true })
  public dice_count!: number;

  @prop({ required: true, index: true })
  public dice_value!: number;
}

export class ClassSpecific {
  @prop({ index: true })
  public action_surges?: number;

  @prop({ index: true })
  public arcane_recovery_levels?: number;

  @prop({ index: true })
  public aura_range?: number;

  @prop({ index: true })
  public bardic_inspiration_die?: number;

  @prop({ index: true })
  public brutal_critical_dice?: number;

  @prop({ index: true })
  public channel_divinity_charges?: number;

  @prop({ type: () => [ClassSpecificCreatingSpellSlot], default: undefined })
  public creating_spell_slots?: ClassSpecificCreatingSpellSlot[];

  @prop({ index: true })
  public destroy_undead_cr?: number;

  @prop({ index: true })
  public extra_attacks?: number;

  @prop({ index: true })
  public favored_enemies?: number;

  @prop({ index: true })
  public favored_terrain?: number;

  @prop({ index: true })
  public indomitable_uses?: number;

  @prop({ index: true })
  public invocations_known?: number;

  @prop({ index: true })
  public ki_points?: number;

  @prop({ index: true })
  public magical_secrets_max_5?: number;

  @prop({ index: true })
  public magical_secrets_max_7?: number;

  @prop({ index: true })
  public magical_secrets_max_9?: number;

  @prop({ type: () => ClassSpecificMartialArt })
  public martial_arts?: ClassSpecificMartialArt;

  @prop({ index: true })
  public metamagic_known?: number;

  @prop({ index: true })
  public mystic_arcanum_level_6?: number;

  @prop({ index: true })
  public mystic_arcanum_level_7?: number;

  @prop({ index: true })
  public mystic_arcanum_level_8?: number;

  @prop({ index: true })
  public mystic_arcanum_level_9?: number;

  @prop({ index: true })
  public rage_count?: number;

  @prop({ index: true })
  public rage_damage_bonus?: number;

  @prop({ type: () => ClassSpecificSneakAttack })
  public sneak_attack?: ClassSpecificSneakAttack;

  @prop({ index: true })
  public song_of_rest_die?: number;

  @prop({ index: true })
  public sorcery_points?: number;

  @prop({ index: true })
  public unarmored_movement?: number;

  @prop({ index: true })
  public wild_shape_fly?: boolean;

  @prop({ index: true })
  public wild_shape_max_cr?: number;

  @prop({ index: true })
  public wild_shape_swim?: boolean;
}

class Spellcasting {
  @prop({ index: true })
  public cantrips_known?: number;

  @prop({ required: true, index: true })
  public spell_slots_level_1!: number;

  @prop({ required: true, index: true })
  public spell_slots_level_2!: number;

  @prop({ required: true, index: true })
  public spell_slots_level_3!: number;

  @prop({ required: true, index: true })
  public spell_slots_level_4!: number;

  @prop({ required: true, index: true })
  public spell_slots_level_5!: number;

  @prop({ index: true })
  public spell_slots_level_6?: number;

  @prop({ index: true })
  public spell_slots_level_7?: number;

  @prop({ index: true })
  public spell_slots_level_8?: number;

  @prop({ index: true })
  public spell_slots_level_9?: number;

  @prop({ index: true })
  public spells_known?: number;
}

export class SubclassSpecific {
  @prop({ index: true })
  public additional_magical_secrets_max_lvl?: number;

  @prop({ index: true })
  public aura_range?: number;
}

export class Level {
  @prop({ index: true })
  public ability_score_bonuses?: number;

  @prop({ type: () => APIReference })
  public class!: APIReference;

  @prop({ type: () => ClassSpecific })
  public class_specific?: ClassSpecific;

  @prop({ type: () => [APIReference] })
  public features?: APIReference[];

  @prop({ required: true, index: true })
  public index!: string;

  @prop({ required: true, index: true })
  public level!: number;

  @prop({ index: true })
  public prof_bonus?: number;

  @prop({ type: () => Spellcasting })
  public spellcasting?: Spellcasting;

  @prop({ type: () => APIReference })
  public subclass?: APIReference;

  @prop({ type: () => SubclassSpecific })
  public subclass_specific?: SubclassSpecific;

  @prop({ required: true, index: true })
  public url!: string;

  @prop({ required: true, index: true })
  public updated_at!: string;
}

export type LevelDocument = DocumentType<Level>;
const LevelModel = getModelForClass(Level, {
  schemaOptions: { collection: '2014-levels' },
});

export default LevelModel;
