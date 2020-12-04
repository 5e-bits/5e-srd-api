const Level = require('../models/level');

const typeDef = `
extend type Query {
  level(query: LevelQueryInput): Level
  levels(query: LevelQueryInput, sortBy: LevelSortByInput): [Level]!
}

type Level {
  ability_score_bonuses: Int
  class: LevelClass
  class_specific: LevelClass_specific
  feature_choices: [LevelFeature_choice]
  features: [LevelFeature]
  index: String
  level: Int
  prof_bonus: Int
  spellcasting: LevelSpellcasting
  subclass: LevelSubclass
  subclass_specific: LevelSubclass_specific
  url: String
}

type LevelClass {
  index: String
  name: String
  url: String
}

type LevelClass_specific {
  action_surges: Int
  arcane_recovery_levels: Int
  aura_range: Int
  bardic_inspiration_die: Int
  brutal_critical_dice: Int
  channel_divinity_charges: Int
  creating_spell_slots: [LevelClass_specificCreating_spell_slot]
  destroy_undead_cr: Int
  extra_attacks: Int
  favored_enemies: Int
  favored_terrain: Int
  indomitable_uses: Int
  invocations_known: Int
  ki_points: Int
  magical_secrets_max_5: Int
  magical_secrets_max_7: Int
  magical_secrets_max_9: Int
  martial_arts: LevelClass_specificMartial_art
  metamagic_known: Int
  mystic_arcanum_level_6: Int
  mystic_arcanum_level_7: Int
  mystic_arcanum_level_8: Int
  mystic_arcanum_level_9: Int
  rage_count: Int
  rage_damage_bonus: Int
  sneak_attack: LevelClass_specificSneak_attack
  song_of_rest_die: Int
  sorcery_points: Int
  unarmored_movement: Int
  wild_shape_fly: Boolean
  wild_shape_max_cr: Int
  wild_shape_swim: Boolean
}

type LevelClass_specificCreating_spell_slot {
  sorcery_point_cost: Int
  spell_slot_level: Int
}

input LevelClass_specificCreating_spell_slotQueryInput {
  spell_slot_level_nin: [Int]
  spell_slot_level_lte: Int
  sorcery_point_cost_ne: Int
  spell_slot_level_ne: Int
  AND: [LevelClass_specificCreating_spell_slotQueryInput!]
  OR: [LevelClass_specificCreating_spell_slotQueryInput!]
  spell_slot_level_lt: Int
  sorcery_point_cost: Int
  spell_slot_level_in: [Int]
  sorcery_point_cost_nin: [Int]
  spell_slot_level_exists: Boolean
  sorcery_point_cost_lt: Int
  sorcery_point_cost_gt: Int
  spell_slot_level_gte: Int
  sorcery_point_cost_lte: Int
  spell_slot_level: Int
  sorcery_point_cost_exists: Boolean
  sorcery_point_cost_gte: Int
  spell_slot_level_gt: Int
  sorcery_point_cost_in: [Int]
}

type LevelClass_specificMartial_art {
  dice_count: Int
  dice_value: Int
}

input LevelClass_specificMartial_artQueryInput {
  dice_count_gte: Int
  dice_value_lte: Int
  dice_count_gt: Int
  OR: [LevelClass_specificMartial_artQueryInput!]
  dice_value_exists: Boolean
  dice_value_ne: Int
  dice_count_lt: Int
  dice_value: Int
  dice_value_in: [Int]
  dice_count: Int
  dice_count_lte: Int
  dice_count_nin: [Int]
  dice_count_in: [Int]
  dice_value_gte: Int
  dice_count_ne: Int
  AND: [LevelClass_specificMartial_artQueryInput!]
  dice_value_nin: [Int]
  dice_count_exists: Boolean
  dice_value_lt: Int
  dice_value_gt: Int
}

input LevelClass_specificQueryInput {
  wild_shape_fly_ne: Boolean
  bardic_inspiration_die_gt: Int
  metamagic_known_in: [Int]
  favored_terrain_lt: Int
  mystic_arcanum_level_9_gte: Int
  invocations_known_in: [Int]
  rage_damage_bonus_in: [Int]
  ki_points_gte: Int
  unarmored_movement_nin: [Int]
  channel_divinity_charges_gte: Int
  rage_count_gt: Int
  channel_divinity_charges_exists: Boolean
  rage_damage_bonus_lt: Int
  magical_secrets_max_9_nin: [Int]
  invocations_known_gte: Int
  wild_shape_max_cr_lte: Int
  invocations_known_ne: Int
  mystic_arcanum_level_7_lte: Int
  indomitable_uses_gte: Int
  destroy_undead_cr_lt: Int
  favored_enemies_ne: Int
  sneak_attack: LevelClass_specificSneak_attackQueryInput
  song_of_rest_die_gte: Int
  mystic_arcanum_level_8_in: [Int]
  mystic_arcanum_level_8_ne: Int
  mystic_arcanum_level_8_nin: [Int]
  creating_spell_slots_nin: [LevelClass_specificCreating_spell_slotQueryInput]
  magical_secrets_max_7_nin: [Int]
  channel_divinity_charges_in: [Int]
  bardic_inspiration_die_ne: Int
  rage_count_ne: Int
  rage_damage_bonus_lte: Int
  ki_points_nin: [Int]
  mystic_arcanum_level_7_gt: Int
  extra_attacks_in: [Int]
  indomitable_uses_lte: Int
  magical_secrets_max_5_lt: Int
  magical_secrets_max_5_lte: Int
  aura_range_gte: Int
  creating_spell_slots_in: [LevelClass_specificCreating_spell_slotQueryInput]
  sneak_attack_exists: Boolean
  favored_terrain_exists: Boolean
  sorcery_points_exists: Boolean
  bardic_inspiration_die_gte: Int
  rage_count_lt: Int
  aura_range_ne: Int
  mystic_arcanum_level_7_in: [Int]
  bardic_inspiration_die: Int
  mystic_arcanum_level_9_exists: Boolean
  song_of_rest_die_in: [Int]
  action_surges_exists: Boolean
  mystic_arcanum_level_7_nin: [Int]
  brutal_critical_dice_lte: Int
  destroy_undead_cr: Int
  indomitable_uses_lt: Int
  mystic_arcanum_level_7_exists: Boolean
  bardic_inspiration_die_in: [Int]
  mystic_arcanum_level_6_gt: Int
  mystic_arcanum_level_9: Int
  channel_divinity_charges_lte: Int
  aura_range_lt: Int
  wild_shape_fly_exists: Boolean
  metamagic_known_lt: Int
  AND: [LevelClass_specificQueryInput!]
  brutal_critical_dice_exists: Boolean
  indomitable_uses_nin: [Int]
  bardic_inspiration_die_exists: Boolean
  brutal_critical_dice_gte: Int
  metamagic_known_lte: Int
  brutal_critical_dice_ne: Int
  indomitable_uses_exists: Boolean
  wild_shape_swim_exists: Boolean
  favored_enemies: Int
  arcane_recovery_levels: Int
  ki_points_in: [Int]
  mystic_arcanum_level_9_in: [Int]
  indomitable_uses: Int
  action_surges_gte: Int
  invocations_known_lte: Int
  wild_shape_max_cr_nin: [Int]
  rage_count_lte: Int
  wild_shape_max_cr_lt: Int
  channel_divinity_charges_gt: Int
  aura_range_exists: Boolean
  magical_secrets_max_7_ne: Int
  magical_secrets_max_5_gte: Int
  song_of_rest_die_gt: Int
  unarmored_movement_gt: Int
  magical_secrets_max_5_gt: Int
  mystic_arcanum_level_6: Int
  ki_points_exists: Boolean
  favored_enemies_lte: Int
  magical_secrets_max_7_in: [Int]
  arcane_recovery_levels_lte: Int
  wild_shape_swim: Boolean
  song_of_rest_die_exists: Boolean
  aura_range_lte: Int
  magical_secrets_max_9_gte: Int
  martial_arts: LevelClass_specificMartial_artQueryInput
  favored_terrain_lte: Int
  brutal_critical_dice_in: [Int]
  sorcery_points_gt: Int
  ki_points_lt: Int
  extra_attacks_exists: Boolean
  ki_points_ne: Int
  invocations_known: Int
  mystic_arcanum_level_8: Int
  song_of_rest_die_lt: Int
  mystic_arcanum_level_6_gte: Int
  extra_attacks_gt: Int
  magical_secrets_max_7_gte: Int
  unarmored_movement_gte: Int
  metamagic_known_nin: [Int]
  action_surges_in: [Int]
  mystic_arcanum_level_7_ne: Int
  extra_attacks_nin: [Int]
  mystic_arcanum_level_8_lt: Int
  ki_points_gt: Int
  mystic_arcanum_level_8_gte: Int
  rage_count_nin: [Int]
  song_of_rest_die_ne: Int
  arcane_recovery_levels_nin: [Int]
  aura_range_gt: Int
  action_surges_lt: Int
  favored_terrain_gt: Int
  brutal_critical_dice: Int
  favored_enemies_nin: [Int]
  martial_arts_exists: Boolean
  metamagic_known_ne: Int
  action_surges_gt: Int
  magical_secrets_max_7_lt: Int
  mystic_arcanum_level_9_gt: Int
  unarmored_movement_exists: Boolean
  destroy_undead_cr_lte: Int
  mystic_arcanum_level_6_nin: [Int]
  wild_shape_max_cr_gt: Int
  channel_divinity_charges_ne: Int
  arcane_recovery_levels_gt: Int
  favored_terrain_ne: Int
  brutal_critical_dice_nin: [Int]
  ki_points: Int
  favored_enemies_in: [Int]
  sorcery_points_lte: Int
  mystic_arcanum_level_6_exists: Boolean
  favored_enemies_gt: Int
  favored_enemies_gte: Int
  magical_secrets_max_9_in: [Int]
  mystic_arcanum_level_9_ne: Int
  unarmored_movement_ne: Int
  indomitable_uses_in: [Int]
  arcane_recovery_levels_lt: Int
  extra_attacks_lte: Int
  magical_secrets_max_5_ne: Int
  wild_shape_max_cr_in: [Int]
  destroy_undead_cr_ne: Int
  favored_terrain: Int
  indomitable_uses_gt: Int
  magical_secrets_max_9_lt: Int
  creating_spell_slots: [LevelClass_specificCreating_spell_slotQueryInput]
  unarmored_movement: Int
  destroy_undead_cr_gte: Int
  magical_secrets_max_7: Int
  creating_spell_slots_exists: Boolean
  bardic_inspiration_die_nin: [Int]
  magical_secrets_max_7_gt: Int
  magical_secrets_max_9_gt: Int
  magical_secrets_max_5: Int
  magical_secrets_max_9_lte: Int
  extra_attacks_lt: Int
  arcane_recovery_levels_in: [Int]
  mystic_arcanum_level_6_ne: Int
  rage_damage_bonus_nin: [Int]
  extra_attacks_gte: Int
  rage_damage_bonus_gt: Int
  action_surges: Int
  aura_range: Int
  destroy_undead_cr_nin: [Int]
  action_surges_lte: Int
  mystic_arcanum_level_8_exists: Boolean
  channel_divinity_charges: Int
  rage_damage_bonus_gte: Int
  favored_enemies_exists: Boolean
  mystic_arcanum_level_8_gt: Int
  mystic_arcanum_level_6_in: [Int]
  sorcery_points: Int
  channel_divinity_charges_lt: Int
  action_surges_nin: [Int]
  wild_shape_max_cr_exists: Boolean
  wild_shape_swim_ne: Boolean
  magical_secrets_max_7_lte: Int
  song_of_rest_die: Int
  invocations_known_lt: Int
  destroy_undead_cr_in: [Int]
  metamagic_known_gt: Int
  ki_points_lte: Int
  indomitable_uses_ne: Int
  sorcery_points_nin: [Int]
  unarmored_movement_in: [Int]
  arcane_recovery_levels_ne: Int
  extra_attacks: Int
  unarmored_movement_lt: Int
  destroy_undead_cr_exists: Boolean
  bardic_inspiration_die_lt: Int
  magical_secrets_max_5_exists: Boolean
  invocations_known_gt: Int
  magical_secrets_max_9_ne: Int
  brutal_critical_dice_gt: Int
  channel_divinity_charges_nin: [Int]
  mystic_arcanum_level_9_lte: Int
  mystic_arcanum_level_7_lt: Int
  invocations_known_exists: Boolean
  magical_secrets_max_9_exists: Boolean
  rage_damage_bonus_exists: Boolean
  mystic_arcanum_level_8_lte: Int
  extra_attacks_ne: Int
  favored_terrain_nin: [Int]
  magical_secrets_max_9: Int
  mystic_arcanum_level_7_gte: Int
  sorcery_points_in: [Int]
  aura_range_nin: [Int]
  magical_secrets_max_7_exists: Boolean
  sorcery_points_gte: Int
  mystic_arcanum_level_7: Int
  arcane_recovery_levels_gte: Int
  action_surges_ne: Int
  song_of_rest_die_lte: Int
  invocations_known_nin: [Int]
  rage_count_gte: Int
  rage_count_exists: Boolean
  wild_shape_max_cr_gte: Int
  rage_damage_bonus: Int
  metamagic_known: Int
  favored_enemies_lt: Int
  brutal_critical_dice_lt: Int
  magical_secrets_max_5_nin: [Int]
  arcane_recovery_levels_exists: Boolean
  aura_range_in: [Int]
  rage_damage_bonus_ne: Int
  sorcery_points_ne: Int
  sorcery_points_lt: Int
  mystic_arcanum_level_6_lt: Int
  metamagic_known_exists: Boolean
  rage_count_in: [Int]
  destroy_undead_cr_gt: Int
  wild_shape_fly: Boolean
  mystic_arcanum_level_9_lt: Int
  wild_shape_max_cr: Int
  wild_shape_max_cr_ne: Int
  mystic_arcanum_level_6_lte: Int
  song_of_rest_die_nin: [Int]
  metamagic_known_gte: Int
  favored_terrain_gte: Int
  rage_count: Int
  OR: [LevelClass_specificQueryInput!]
  bardic_inspiration_die_lte: Int
  unarmored_movement_lte: Int
  magical_secrets_max_5_in: [Int]
  mystic_arcanum_level_9_nin: [Int]
  favored_terrain_in: [Int]
}

type LevelClass_specificSneak_attack {
  dice_count: Int
  dice_value: Int
}

input LevelClass_specificSneak_attackQueryInput {
  dice_value_in: [Int]
  dice_count_lt: Int
  dice_count_gte: Int
  dice_count_ne: Int
  dice_value_gte: Int
  OR: [LevelClass_specificSneak_attackQueryInput!]
  dice_count_gt: Int
  dice_value: Int
  dice_value_nin: [Int]
  AND: [LevelClass_specificSneak_attackQueryInput!]
  dice_value_gt: Int
  dice_value_lte: Int
  dice_count_in: [Int]
  dice_value_lt: Int
  dice_value_ne: Int
  dice_count: Int
  dice_count_exists: Boolean
  dice_value_exists: Boolean
  dice_count_lte: Int
  dice_count_nin: [Int]
}

input LevelClassQueryInput {
  index_exists: Boolean
  name_exists: Boolean
  name_lt: String
  index_gt: String
  index_in: [String]
  name_nin: [String]
  index_nin: [String]
  AND: [LevelClassQueryInput!]
  url_ne: String
  url_nin: [String]
  OR: [LevelClassQueryInput!]
  url_in: [String]
  index: String
  name_lte: String
  index_lte: String
  url_gte: String
  name_ne: String
  name_in: [String]
  index_ne: String
  index_gte: String
  url_exists: Boolean
  url: String
  name: String
  index_lt: String
  url_lt: String
  name_gt: String
  url_lte: String
  url_gt: String
  name_gte: String
}

type LevelFeature {
  index: String
  name: String
  url: String
}

type LevelFeature_choice {
  index: String
  name: String
  url: String
}

input LevelFeature_choiceQueryInput {
  index_exists: Boolean
  AND: [LevelFeature_choiceQueryInput!]
  index: String
  name_gt: String
  url_in: [String]
  index_ne: String
  name_exists: Boolean
  name_ne: String
  index_lte: String
  index_gt: String
  name: String
  url_gte: String
  index_nin: [String]
  name_lt: String
  name_lte: String
  url_gt: String
  url_lte: String
  name_nin: [String]
  name_in: [String]
  name_gte: String
  url_ne: String
  index_in: [String]
  url_exists: Boolean
  OR: [LevelFeature_choiceQueryInput!]
  index_lt: String
  url: String
  url_nin: [String]
  index_gte: String
  url_lt: String
}

input LevelFeatureQueryInput {
  url: String
  index_gte: String
  name_nin: [String]
  url_in: [String]
  url_exists: Boolean
  index_gt: String
  url_nin: [String]
  index_ne: String
  name_lte: String
  url_gt: String
  name_exists: Boolean
  url_lt: String
  name_in: [String]
  name_gte: String
  name: String
  url_gte: String
  index_in: [String]
  name_gt: String
  AND: [LevelFeatureQueryInput!]
  url_lte: String
  index_exists: Boolean
  index_lt: String
  index_nin: [String]
  index_lte: String
  url_ne: String
  name_ne: String
  index: String
  name_lt: String
  OR: [LevelFeatureQueryInput!]
}

input LevelQueryInput {
  level_gt: Int
  url_gte: String
  url_in: [String]
  level_exists: Boolean
  feature_choices_in: [LevelFeature_choiceQueryInput]
  url_nin: [String]
  index_nin: [String]
  ability_score_bonuses: Int
  prof_bonus_exists: Boolean
  features_in: [LevelFeatureQueryInput]
  feature_choices_nin: [LevelFeature_choiceQueryInput]
  url_gt: String
  prof_bonus_gt: Int
  url_exists: Boolean
  ability_score_bonuses_exists: Boolean
  prof_bonus_in: [Int]
  feature_choices_exists: Boolean
  url_lt: String
  AND: [LevelQueryInput!]
  spellcasting_exists: Boolean
  class_specific: LevelClass_specificQueryInput
  level_lt: Int
  feature_choices: [LevelFeature_choiceQueryInput]
  prof_bonus_lt: Int
  class_specific_exists: Boolean
  ability_score_bonuses_gt: Int
  prof_bonus_ne: Int
  ability_score_bonuses_lt: Int
  level_lte: Int
  ability_score_bonuses_lte: Int
  index_lt: String
  level: Int
  features: [LevelFeatureQueryInput]
  level_ne: Int
  prof_bonus: Int
  index_gt: String
  subclass: LevelSubclassQueryInput
  subclass_specific_exists: Boolean
  ability_score_bonuses_ne: Int
  prof_bonus_lte: Int
  prof_bonus_gte: Int
  class_exists: Boolean
  prof_bonus_nin: [Int]
  level_gte: Int
  url_ne: String
  _id_exists: Boolean
  level_in: [Int]
  index_ne: String
  url: String
  ability_score_bonuses_in: [Int]
  url_lte: String
  level_nin: [Int]
  index_exists: Boolean
  subclass_specific: LevelSubclass_specificQueryInput
  ability_score_bonuses_nin: [Int]
  index: String
  class: LevelClassQueryInput
  index_in: [String]
  subclass_exists: Boolean
  OR: [LevelQueryInput!]
  index_lte: String
  ability_score_bonuses_gte: Int
  spellcasting: LevelSpellcastingQueryInput
  features_nin: [LevelFeatureQueryInput]
  index_gte: String
  features_exists: Boolean
}

enum LevelSortByInput {
  LEVEL_DESC
  URL_ASC
  URL_DESC
  PROF_BONUS_DESC
  _ID_ASC
  LEVEL_ASC
  ABILITY_SCORE_BONUSES_ASC
  ABILITY_SCORE_BONUSES_DESC
  INDEX_ASC
  INDEX_DESC
  PROF_BONUS_ASC
  _ID_DESC
}

type LevelSpellcasting {
  cantrips_known: Int
  spell_slots_level_1: Int
  spell_slots_level_2: Int
  spell_slots_level_3: Int
  spell_slots_level_4: Int
  spell_slots_level_5: Int
  spell_slots_level_6: Int
  spell_slots_level_7: Int
  spell_slots_level_8: Int
  spell_slots_level_9: Int
  spells_known: Int
}

input LevelSpellcastingQueryInput {
  spell_slots_level_1_lte: Int
  spell_slots_level_8: Int
  spell_slots_level_6_exists: Boolean
  spell_slots_level_9: Int
  spell_slots_level_9_in: [Int]
  spell_slots_level_6_gt: Int
  cantrips_known_lt: Int
  spell_slots_level_2_nin: [Int]
  spell_slots_level_5_lte: Int
  spell_slots_level_3_lte: Int
  spell_slots_level_4_gte: Int
  spell_slots_level_4_exists: Boolean
  cantrips_known_gte: Int
  spell_slots_level_2_lte: Int
  spell_slots_level_3_in: [Int]
  spell_slots_level_7_ne: Int
  spells_known_nin: [Int]
  spell_slots_level_4_lt: Int
  spell_slots_level_1_gt: Int
  spells_known_exists: Boolean
  spell_slots_level_8_gt: Int
  spell_slots_level_7: Int
  spell_slots_level_6_lte: Int
  spell_slots_level_1_nin: [Int]
  spell_slots_level_7_gt: Int
  spell_slots_level_8_gte: Int
  spell_slots_level_1_ne: Int
  spell_slots_level_8_in: [Int]
  spell_slots_level_1_in: [Int]
  spell_slots_level_7_lte: Int
  spell_slots_level_9_exists: Boolean
  spell_slots_level_6_in: [Int]
  spell_slots_level_9_nin: [Int]
  spell_slots_level_4: Int
  spell_slots_level_9_lte: Int
  spell_slots_level_1_gte: Int
  spell_slots_level_7_nin: [Int]
  spell_slots_level_4_nin: [Int]
  spell_slots_level_3_exists: Boolean
  cantrips_known: Int
  spell_slots_level_2_gte: Int
  spell_slots_level_2_ne: Int
  spell_slots_level_5_gt: Int
  spell_slots_level_3_lt: Int
  spell_slots_level_3_gte: Int
  spell_slots_level_8_exists: Boolean
  spell_slots_level_2_exists: Boolean
  spell_slots_level_2_lt: Int
  spell_slots_level_9_gte: Int
  spell_slots_level_6_nin: [Int]
  spell_slots_level_8_lte: Int
  spell_slots_level_2_in: [Int]
  spell_slots_level_7_exists: Boolean
  spell_slots_level_8_ne: Int
  spell_slots_level_2_gt: Int
  spell_slots_level_5_gte: Int
  spells_known_gt: Int
  spell_slots_level_4_ne: Int
  spell_slots_level_1: Int
  spell_slots_level_3_nin: [Int]
  spell_slots_level_7_gte: Int
  spell_slots_level_2: Int
  spell_slots_level_5_lt: Int
  spell_slots_level_5_in: [Int]
  spells_known_lt: Int
  spell_slots_level_3: Int
  spells_known: Int
  cantrips_known_nin: [Int]
  spell_slots_level_9_gt: Int
  spell_slots_level_4_gt: Int
  spell_slots_level_8_nin: [Int]
  spell_slots_level_4_lte: Int
  spell_slots_level_8_lt: Int
  spell_slots_level_3_ne: Int
  spells_known_in: [Int]
  spells_known_ne: Int
  AND: [LevelSpellcastingQueryInput!]
  spell_slots_level_1_lt: Int
  spell_slots_level_9_ne: Int
  spell_slots_level_4_in: [Int]
  spell_slots_level_1_exists: Boolean
  cantrips_known_lte: Int
  spell_slots_level_5: Int
  spell_slots_level_6_ne: Int
  spell_slots_level_6_gte: Int
  spell_slots_level_5_exists: Boolean
  spell_slots_level_5_nin: [Int]
  spell_slots_level_6: Int
  spells_known_lte: Int
  spell_slots_level_3_gt: Int
  cantrips_known_exists: Boolean
  spell_slots_level_7_in: [Int]
  cantrips_known_gt: Int
  cantrips_known_in: [Int]
  spell_slots_level_5_ne: Int
  spell_slots_level_7_lt: Int
  spell_slots_level_9_lt: Int
  spell_slots_level_6_lt: Int
  spells_known_gte: Int
  cantrips_known_ne: Int
  OR: [LevelSpellcastingQueryInput!]
}

type LevelSubclass {
  index: String
  name: String
  url: String
}

type LevelSubclass_specific {
  additional_magical_secrets_max_lvl: Int
  aura_range: Int
}

input LevelSubclass_specificQueryInput {
  AND: [LevelSubclass_specificQueryInput!]
  aura_range_gte: Int
  additional_magical_secrets_max_lvl_ne: Int
  additional_magical_secrets_max_lvl_gt: Int
  additional_magical_secrets_max_lvl_lte: Int
  aura_range: Int
  aura_range_nin: [Int]
  aura_range_lte: Int
  aura_range_gt: Int
  aura_range_lt: Int
  additional_magical_secrets_max_lvl_in: [Int]
  OR: [LevelSubclass_specificQueryInput!]
  aura_range_in: [Int]
  aura_range_exists: Boolean
  additional_magical_secrets_max_lvl_nin: [Int]
  additional_magical_secrets_max_lvl_lt: Int
  aura_range_ne: Int
  additional_magical_secrets_max_lvl_gte: Int
  additional_magical_secrets_max_lvl: Int
  additional_magical_secrets_max_lvl_exists: Boolean
}

input LevelSubclassQueryInput {
  index_gte: String
  url_nin: [String]
  url_gt: String
  index_lt: String
  index: String
  url_gte: String
  name_gt: String
  name: String
  name_nin: [String]
  url_ne: String
  url_lt: String
  name_gte: String
  url_exists: Boolean
  name_lte: String
  OR: [LevelSubclassQueryInput!]
  index_lte: String
  name_in: [String]
  name_exists: Boolean
  index_ne: String
  index_nin: [String]
  name_lt: String
  name_ne: String
  url: String
  index_in: [String]
  AND: [LevelSubclassQueryInput!]
  index_exists: Boolean
  url_in: [String]
  index_gt: String
  url_lte: String
}
`;

const resolvers = {
  Query: {
    level: async (_, { query }) => {
      return await Level.findOne(query).exec();
    },
    levels: async (_, { query, sortBy }) => {
      return await Level.find(query)
        .sort(sortBy)
        .exec();
    },
  },
};

module.exports = {
  typeDef,
  resolvers,
};
