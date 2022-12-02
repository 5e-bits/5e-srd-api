import * as mongoose from 'mongoose';
import { APIReference } from '../common/types';

type ClassSpecificCreatingSpellSlot = {
  _id?: boolean;
  sorcery_point_cost: number;
  spell_slot_level: number;
};

type ClassSpecificMartialArt = {
  _id?: boolean;
  dice_count: number;
  dice_value: number;
};

type ClassSpecificSneakAttack = {
  _id?: boolean;
  dice_count: number;
  dice_value: number;
};

type ClassSpecific = {
  _id?: boolean;
  action_surges?: number;
  arcane_recovery_levels?: number;
  aura_range?: number;
  bardic_inspiration_die?: number;
  brutal_critical_dice?: number;
  channel_divinity_charges?: number;
  creating_spell_slots?: ClassSpecificCreatingSpellSlot[];
  destroy_undead_cr?: number;
  extra_attacks?: number;
  favored_enemies?: number;
  favored_terrain?: number;
  indomitable_uses?: number;
  invocations_known?: number;
  ki_points?: number;
  magical_secrets_max_5?: number;
  magical_secrets_max_7?: number;
  magical_secrets_max_9?: number;
  martial_arts?: ClassSpecificMartialArt;
  metamagic_known?: number;
  mystic_arcanum_level_6?: number;
  mystic_arcanum_level_7?: number;
  mystic_arcanum_level_8?: number;
  mystic_arcanum_level_9?: number;
  rage_count?: number;
  rage_damage_bonus?: number;
  sneak_attack?: ClassSpecificSneakAttack;
  song_of_rest_die?: number;
  sorcery_points?: number;
  unarmored_movement?: number;
  wild_shape_fly?: boolean;
  wild_shape_max_cr?: number;
  wild_shape_swim?: boolean;
};

type Spellcasting = {
  _id?: boolean;
  cantrips_known?: number;
  spell_slots_level_1: number;
  spell_slots_level_2: number;
  spell_slots_level_3: number;
  spell_slots_level_4: number;
  spell_slots_level_5: number;
  spell_slots_level_6?: number;
  spell_slots_level_7?: number;
  spell_slots_level_8?: number;
  spell_slots_level_9?: number;
  spells_known?: number;
};

type SubclassSpecific = {
  _id?: boolean;
  additional_magical_secrets_max_lvl?: number;
  aura_range?: number;
};

export type Level = {
  _id?: mongoose.Types.ObjectId;
  ability_score_bonuses?: number;
  class: APIReference;
  class_specific?: ClassSpecific;
  features?: APIReference[];
  index: string;
  level: number;
  prof_bonus?: number;
  spellcasting?: Spellcasting;
  subclass?: APIReference;
  subclass_specific?: SubclassSpecific;
  url: string;
};
