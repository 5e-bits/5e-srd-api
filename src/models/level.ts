import * as mongoose from 'mongoose';
import { APIReference, APIReferenceSchema } from './common';

interface ClassSpecificCreatingSpellSlot {
  sorcery_point_cost: number;
  spell_slot_level: number;
}

const ClassSpecificCreatingSpellSlot = {
  sorcery_point_cost: { type: Number, index: true },
  spell_slot_level: { type: Number, index: true },
};

interface ClassSpecificMartialArt {
  dice_count: number;
  dice_value: number;
}

const ClassSpecificMartialArt = {
  dice_count: { type: Number, index: true },
  dice_value: { type: Number, index: true },
};

interface ClassSpecificSneakAttack {
  dice_count: number;
  dice_value: number;
}

const ClassSpecificSneakAttack = {
  dice_count: { type: Number, index: true },
  dice_value: { type: Number, index: true },
};

interface ClassSpecific {
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
}

const ClassSpecific = {
  action_surges: { type: Number, index: true },
  arcane_recovery_levels: { type: Number, index: true },
  aura_range: { type: Number, index: true },
  bardic_inspiration_die: { type: Number, index: true },
  brutal_critical_dice: { type: Number, index: true },
  channel_divinity_charges: { type: Number, index: true },
  creating_spell_slots: [ClassSpecificCreatingSpellSlot],
  destroy_undead_cr: { type: Number, index: true },
  extra_attacks: { type: Number, index: true },
  favored_enemies: { type: Number, index: true },
  favored_terrain: { type: Number, index: true },
  indomitable_uses: { type: Number, index: true },
  invocations_known: { type: Number, index: true },
  ki_points: { type: Number, index: true },
  magical_secrets_max_5: { type: Number, index: true },
  magical_secrets_max_7: { type: Number, index: true },
  magical_secrets_max_9: { type: Number, index: true },
  martial_arts: ClassSpecificMartialArt,
  metamagic_known: { type: Number, index: true },
  mystic_arcanum_level_6: { type: Number, index: true },
  mystic_arcanum_level_7: { type: Number, index: true },
  mystic_arcanum_level_8: { type: Number, index: true },
  mystic_arcanum_level_9: { type: Number, index: true },
  rage_count: { type: Number, index: true },
  rage_damage_bonus: { type: Number, index: true },
  sneak_attack: ClassSpecificSneakAttack,
  song_of_rest_die: { type: Number, index: true },
  sorcery_points: { type: Number, index: true },
  unarmored_movement: { type: Number, index: true },
  wild_shape_fly: { type: Boolean, index: true },
  wild_shape_max_cr: { type: Number, index: true },
  wild_shape_swim: { type: Boolean, index: true },
};

interface Spellcasting {
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
}

const Spellcasting = {
  cantrips_known: { type: Number, index: true },
  spell_slots_level_1: { type: Number, index: true },
  spell_slots_level_2: { type: Number, index: true },
  spell_slots_level_3: { type: Number, index: true },
  spell_slots_level_4: { type: Number, index: true },
  spell_slots_level_5: { type: Number, index: true },
  spell_slots_level_6: { type: Number, index: true },
  spell_slots_level_7: { type: Number, index: true },
  spell_slots_level_8: { type: Number, index: true },
  spell_slots_level_9: { type: Number, index: true },
  spells_known: { type: Number, index: true },
};

interface SubclassSpecific {
  additional_magical_secrets_max_lvl?: number;
  aura_range?: number;
}

const SubclassSpecific = {
  additional_magical_secrets_max_lvl: { type: Number, index: true },
  aura_range: { type: Number, index: true },
};

interface Level {
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
}

const Level = new mongoose.Schema<Level>({
  _id: { type: String, select: false },
  ability_score_bonuses: { type: Number, index: true },
  class: APIReferenceSchema,
  class_specific: ClassSpecific,
  features: [APIReferenceSchema],
  index: { type: String, index: true },
  level: { type: Number, index: true },
  prof_bonus: { type: Number, index: true },
  spellcasting: Spellcasting,
  subclass: APIReferenceSchema,
  subclass_specific: SubclassSpecific,
  url: { type: String, index: true },
});

export default mongoose.model<Level>('Level', Level, 'levels');
