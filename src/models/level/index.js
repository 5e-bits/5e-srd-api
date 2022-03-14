const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { APIReference } = require('../common');

const ClassSpecificCreatingSpellSlot = new Schema({
  _id: false,
  sorcery_point_cost: { type: Number, index: true },
  spell_slot_level: { type: Number, index: true },
});

const ClassSpecificMartialArt = new Schema({
  _id: false,
  dice_count: { type: Number, index: true },
  dice_value: { type: Number, index: true },
});

const ClassSpecificSneakAttack = new Schema({
  _id: false,
  dice_count: { type: Number, index: true },
  dice_value: { type: Number, index: true },
});

const ClassSpecific = new Schema({
  _id: false,
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
});

const Spellcasting = new Schema({
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

const SubclassSpecific = new Schema({
  _id: false,
  additional_magical_secrets_max_lvl: { type: Number, index: true },
  aura_range: { type: Number, index: true },
});

const Level = new Schema({
  _id: { type: String, select: false },
  ability_score_bonuses: { type: Number, index: true },
  class: APIReference,
  class_specific: ClassSpecific,
  features: [APIReference],
  index: { type: String, index: true },
  level: { type: Number, index: true },
  prof_bonus: { type: Number, index: true },
  spellcasting: Spellcasting,
  subclass: APIReference,
  subclass_specific: SubclassSpecific,
  url: { type: String, index: true },
});

module.exports = mongoose.model('Level', Level, 'levels');
