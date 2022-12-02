import { Schema, model } from 'mongoose';
import { APIReferenceSchema } from '../common/index.js';
import {
  ClassSpecificCreatingSpellSlot,
  ClassSpecificMartialArt,
  ClassSpecificSneakAttack,
  ClassSpecific,
  Level,
  Spellcasting,
  SubclassSpecific,
} from './types';

const ClassSpecificCreatingSpellSlotSchema = new Schema<ClassSpecificCreatingSpellSlot>({
  _id: false,
  sorcery_point_cost: { type: Number, index: true },
  spell_slot_level: { type: Number, index: true },
});

const ClassSpecificMartialArtSchema = new Schema<ClassSpecificMartialArt>({
  _id: false,
  dice_count: { type: Number, index: true },
  dice_value: { type: Number, index: true },
});

const ClassSpecificSneakAttackSchema = new Schema<ClassSpecificSneakAttack>({
  _id: false,
  dice_count: { type: Number, index: true },
  dice_value: { type: Number, index: true },
});

const ClassSpecificSchema = new Schema<ClassSpecific>({
  _id: false,
  action_surges: { type: Number, index: true },
  arcane_recovery_levels: { type: Number, index: true },
  aura_range: { type: Number, index: true },
  bardic_inspiration_die: { type: Number, index: true },
  brutal_critical_dice: { type: Number, index: true },
  channel_divinity_charges: { type: Number, index: true },
  creating_spell_slots: {
    type: [ClassSpecificCreatingSpellSlotSchema],
    default: undefined,
  },
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
  martial_arts: ClassSpecificMartialArtSchema,
  metamagic_known: { type: Number, index: true },
  mystic_arcanum_level_6: { type: Number, index: true },
  mystic_arcanum_level_7: { type: Number, index: true },
  mystic_arcanum_level_8: { type: Number, index: true },
  mystic_arcanum_level_9: { type: Number, index: true },
  rage_count: { type: Number, index: true },
  rage_damage_bonus: { type: Number, index: true },
  sneak_attack: ClassSpecificSneakAttackSchema,
  song_of_rest_die: { type: Number, index: true },
  sorcery_points: { type: Number, index: true },
  unarmored_movement: { type: Number, index: true },
  wild_shape_fly: { type: Boolean, index: true },
  wild_shape_max_cr: { type: Number, index: true },
  wild_shape_swim: { type: Boolean, index: true },
});

const SpellcastingSchema = new Schema<Spellcasting>({
  _id: false,
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
});

const SubclassSpecificSchema = new Schema<SubclassSpecific>({
  _id: false,
  additional_magical_secrets_max_lvl: { type: Number, index: true },
  aura_range: { type: Number, index: true },
});

const LevelSchema = new Schema<Level>({
  _id: { type: String, select: false },
  ability_score_bonuses: { type: Number, index: true },
  class: APIReferenceSchema,
  class_specific: ClassSpecificSchema,
  features: [APIReferenceSchema],
  index: { type: String, index: true },
  level: { type: Number, index: true },
  prof_bonus: { type: Number, index: true },
  spellcasting: SpellcastingSchema,
  subclass: APIReferenceSchema,
  subclass_specific: SubclassSpecificSchema,
  url: { type: String, index: true },
});

export default model('Level', LevelSchema, 'levels');
