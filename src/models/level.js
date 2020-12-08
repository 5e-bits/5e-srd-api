const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LevelClass = new Schema({
  index: String,
  name: String,
  url: String,
});

const LevelClassSpecificCreatingSpellSlot = new Schema({
  sorcery_point_cost: Number,
  spell_slot_level: Number,
});

const LevelClassSpecificMartialArt = new Schema({
  dice_count: Number,
  dice_value: Number,
});

const LevelClassSpecificSneakAttack = new Schema({
  dice_count: Number,
  dice_value: Number,
});

const LevelClassSpecific = new Schema({
  action_surges: Number,
  arcane_recovery_levels: Number,
  aura_range: Number,
  bardic_inspiration_die: Number,
  brutal_critical_dice: Number,
  channel_divinity_charges: Number,
  creating_spell_slots: [LevelClassSpecificCreatingSpellSlot],
  destroy_undead_cr: Number,
  extra_attacks: Number,
  favored_enemies: Number,
  favored_terrain: Number,
  indomitable_uses: Number,
  invocations_known: Number,
  ki_points: Number,
  magical_secrets_max_5: Number,
  magical_secrets_max_7: Number,
  magical_secrets_max_9: Number,
  martial_arts: LevelClassSpecificMartialArt,
  metamagic_known: Number,
  mystic_arcanum_level_6: Number,
  mystic_arcanum_level_7: Number,
  mystic_arcanum_level_8: Number,
  mystic_arcanum_level_9: Number,
  rage_count: Number,
  rage_damage_bonus: Number,
  sneak_attack: LevelClassSpecificSneakAttack,
  song_of_rest_die: Number,
  sorcery_points: Number,
  unarmored_movement: Number,
  wild_shape_fly: Boolean,
  wild_shape_max_cr: Number,
  wild_shape_swim: Boolean,
});

const LevelFeature = new Schema({
  index: String,
  name: String,
  url: String,
});

const LevelFeatureChoice = new Schema({
  index: String,
  name: String,
  url: String,
});

const LevelSpellcasting = new Schema({
  cantrips_known: Number,
  spell_slots_level_1: Number,
  spell_slots_level_2: Number,
  spell_slots_level_3: Number,
  spell_slots_level_4: Number,
  spell_slots_level_5: Number,
  spell_slots_level_6: Number,
  spell_slots_level_7: Number,
  spell_slots_level_8: Number,
  spell_slots_level_9: Number,
  spells_known: Number,
});

const LevelSubclass = new Schema({
  index: String,
  name: String,
  url: String,
});

const LevelSubclassSpecific = new Schema({
  additional_magical_secrets_max_lvl: Number,
  aura_range: Number,
});

const Level = new Schema({
  _id: {
    type: String,
    select: false,
  },
  ability_score_bonuses: Number,
  class: LevelClass,
  class_specific: LevelClassSpecific,
  feature_choices: [LevelFeatureChoice],
  features: [LevelFeature],
  index: String,
  level: Number,
  prof_bonus: Number,
  spellcasting: LevelSpellcasting,
  subclass: LevelSubclass,
  subclass_specific: LevelSubclassSpecific,
  url: String,
});

module.exports = mongoose.model('Level', Level, 'levels');
