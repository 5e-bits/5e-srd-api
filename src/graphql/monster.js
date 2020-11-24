const Monster = require('../models/monster');

const typeDef = `
type Monster {
  actions: [MonsterAction]
  alignment: String
  armor_class: Int
  challenge_rating: Float
  charisma: Int
  condition_immunities: [MonsterCondition_immunity]
  constitution: Int
  damage_immunities: [String]
  damage_resistances: [String]
  damage_vulnerabilities: [String]
  dexterity: Int
  hit_dice: String
  hit_points: Int
  index: String
  intelligence: Int
  languages: String
  legendary_actions: [MonsterLegendary_action]
  name: String
  other_speeds: [MonsterOther_speed]
  proficiencies: [MonsterProficiency]
  reactions: [MonsterReaction]
  senses: MonsterSense
  size: String
  special_abilities: [MonsterSpecial_ability]
  speed: MonsterSpeed
  strength: Int
  subtype: String
  type: String
  url: String
  wisdom: Int
  xp: Int
}

type MonsterAction {
  attack_bonus: Int
  damage: [MonsterActionDamage]
  desc: String
  name: String
}

type MonsterActionDamage {
  damage_dice: String
  damage_type: MonsterActionDamageDamage_type
}

type MonsterActionDamageDamage_type {
  index: String
  name: String
  url: String
}

input MonsterActionDamageDamage_typeQueryInput {
  url_in: [String]
  index_lt: String
  index_gte: String
  name_exists: Boolean
  url_exists: Boolean
  url_gt: String
  url_gte: String
  OR: [MonsterActionDamageDamage_typeQueryInput!]
  index_exists: Boolean
  index_in: [String]
  name_gte: String
  url_ne: String
  AND: [MonsterActionDamageDamage_typeQueryInput!]
  name_lt: String
  name_gt: String
  index_lte: String
  name_lte: String
  url_lt: String
  url_lte: String
  name_nin: [String]
  index: String
  index_nin: [String]
  url_nin: [String]
  name_ne: String
  index_ne: String
  name: String
  url: String
  index_gt: String
  name_in: [String]
}

input MonsterActionDamageQueryInput {
  damage_dice: String
  damage_dice_nin: [String]
  damage_type_exists: Boolean
  OR: [MonsterActionDamageQueryInput!]
  damage_dice_gte: String
  damage_dice_gt: String
  damage_dice_lt: String
  AND: [MonsterActionDamageQueryInput!]
  damage_dice_lte: String
  damage_type: MonsterActionDamageDamage_typeQueryInput
  damage_dice_ne: String
  damage_dice_exists: Boolean
  damage_dice_in: [String]
}

input MonsterActionQueryInput {
  AND: [MonsterActionQueryInput!]
  damage_nin: [MonsterActionDamageQueryInput]
  attack_bonus_in: [Int]
  name_ne: String
  name: String
  name_gte: String
  desc_gte: String
  desc_in: [String]
  attack_bonus_ne: Int
  attack_bonus: Int
  name_in: [String]
  damage: [MonsterActionDamageQueryInput]
  name_exists: Boolean
  desc_lt: String
  attack_bonus_exists: Boolean
  damage_exists: Boolean
  desc_ne: String
  OR: [MonsterActionQueryInput!]
  name_nin: [String]
  desc_gt: String
  attack_bonus_gte: Int
  name_gt: String
  attack_bonus_lt: Int
  desc_lte: String
  name_lte: String
  attack_bonus_lte: Int
  desc_nin: [String]
  name_lt: String
  desc: String
  desc_exists: Boolean
  attack_bonus_gt: Int
  attack_bonus_nin: [Int]
  damage_in: [MonsterActionDamageQueryInput]
}

type MonsterCondition_immunity {
  index: String
  name: String
  url: String
}

input MonsterCondition_immunityQueryInput {
  index_nin: [String]
  index_gt: String
  name_lt: String
  url_gte: String
  index_gte: String
  url_lte: String
  index_in: [String]
  url_nin: [String]
  url_exists: Boolean
  index_exists: Boolean
  url_gt: String
  name_exists: Boolean
  url_ne: String
  url: String
  OR: [MonsterCondition_immunityQueryInput!]
  index_ne: String
  name_gt: String
  url_lt: String
  name_in: [String]
  index_lt: String
  name_ne: String
  name_lte: String
  name: String
  url_in: [String]
  name_gte: String
  AND: [MonsterCondition_immunityQueryInput!]
  index: String
  index_lte: String
  name_nin: [String]
}


type MonsterLegendary_action {
  attack_bonus: Int
  desc: String
  name: String
}

input MonsterLegendary_actionQueryInput {
  attack_bonus_nin: [Int]
  name_ne: String
  attack_bonus: Int
  attack_bonus_lt: Int
  desc_gte: String
  desc_nin: [String]
  name_lte: String
  attack_bonus_ne: Int
  desc_exists: Boolean
  name_in: [String]
  name_gt: String
  desc_lt: String
  name_nin: [String]
  name_lt: String
  attack_bonus_gt: Int
  desc_ne: String
  attack_bonus_gte: Int
  name_gte: String
  name_exists: Boolean
  attack_bonus_in: [Int]
  desc_in: [String]
  OR: [MonsterLegendary_actionQueryInput!]
  desc: String
  attack_bonus_exists: Boolean
  AND: [MonsterLegendary_actionQueryInput!]
  desc_gt: String
  attack_bonus_lte: Int
  name: String
  desc_lte: String
}

type MonsterOther_speed {
  form: String
  speed: MonsterOther_speedSpeed
}

input MonsterOther_speedQueryInput {
  form_gt: String
  form_gte: String
  OR: [MonsterOther_speedQueryInput!]
  form_nin: [String]
  form_exists: Boolean
  AND: [MonsterOther_speedQueryInput!]
  form_ne: String
  form_in: [String]
  form: String
  form_lte: String
  speed_exists: Boolean
  speed: MonsterOther_speedSpeedQueryInput
  form_lt: String
}

type MonsterOther_speedSpeed {
  walk: String
}

input MonsterOther_speedSpeedQueryInput {
  OR: [MonsterOther_speedSpeedQueryInput!]
  walk_gt: String
  walk_nin: [String]
  AND: [MonsterOther_speedSpeedQueryInput!]
  walk_lt: String
  walk_gte: String
  walk_lte: String
  walk_exists: Boolean
  walk_ne: String
  walk_in: [String]
  walk: String
}

type MonsterProficiency {
  proficiency: MonsterProficiencyProficiency
  value: Int
}

type MonsterProficiencyProficiency {
  index: String
  name: String
  url: String
}

input MonsterProficiencyProficiencyQueryInput {
  AND: [MonsterProficiencyProficiencyQueryInput!]
  url_ne: String
  index_gte: String
  name_lt: String
  url_gte: String
  name_gt: String
  url_lt: String
  name_in: [String]
  url_lte: String
  index_exists: Boolean
  index_lte: String
  name_gte: String
  url_in: [String]
  name: String
  name_exists: Boolean
  index_in: [String]
  name_ne: String
  url: String
  url_exists: Boolean
  index_nin: [String]
  index: String
  OR: [MonsterProficiencyProficiencyQueryInput!]
  name_lte: String
  index_gt: String
  url_gt: String
  url_nin: [String]
  index_ne: String
  index_lt: String
  name_nin: [String]
}

input MonsterProficiencyQueryInput {
  value_ne: Int
  OR: [MonsterProficiencyQueryInput!]
  value_in: [Int]
  proficiency_exists: Boolean
  value_lte: Int
  value_exists: Boolean
  proficiency: MonsterProficiencyProficiencyQueryInput
  value: Int
  value_gte: Int
  value_gt: Int
  AND: [MonsterProficiencyQueryInput!]
  value_lt: Int
  value_nin: [Int]
}

input MonsterQueryInput {
  other_speeds_in: [MonsterOther_speedQueryInput]
  name_nin: [String]
  charisma_exists: Boolean
  intelligence_exists: Boolean
  condition_immunities_in: [MonsterCondition_immunityQueryInput]
  type_ne: String
  xp_in: [Int]
  dexterity_lte: Int
  hit_points_lte: Int
  index_in: [String]
  size_gt: String
  legendary_actions_nin: [MonsterLegendary_actionQueryInput]
  wisdom_exists: Boolean
  challenge_rating_lte: Float
  hit_dice_ne: String
  languages_gt: String
  charisma_gte: Int
  url_lt: String
  speed_exists: Boolean
  strength_in: [Int]
  strength_gte: Int
  index_lte: String
  proficiencies: [MonsterProficiencyQueryInput]
  charisma_lte: Int
  size_ne: String
  challenge_rating_nin: [Float]
  challenge_rating_gt: Float
  hit_dice_lt: String
  intelligence_lt: Int
  dexterity_exists: Boolean
  reactions: [MonsterReactionQueryInput]
  damage_vulnerabilities_in: [String]
  armor_class_ne: Int
  languages_in: [String]
  challenge_rating_gte: Float
  type_gte: String
  wisdom_gt: Int
  xp_ne: Int
  other_speeds_exists: Boolean
  _id_exists: Boolean
  dexterity_in: [Int]
  damage_vulnerabilities: [String]
  strength: Int
  alignment_lte: String
  proficiencies_nin: [MonsterProficiencyQueryInput]
  xp: Int
  wisdom_nin: [Int]
  languages_lte: String
  xp_lt: Int
  other_speeds: [MonsterOther_speedQueryInput]
  OR: [MonsterQueryInput!]
  damage_resistances_in: [String]
  constitution_nin: [Int]
  dexterity_gte: Int
  strength_nin: [Int]
  hit_dice_nin: [String]
  armor_class_gt: Int
  hit_dice_gte: String
  damage_resistances: [String]
  constitution_ne: Int
  armor_class_gte: Int
  alignment: String
  alignment_in: [String]
  special_abilities_exists: Boolean
  armor_class_exists: Boolean
  type_in: [String]
  name_lt: String
  damage_immunities_in: [String]
  url_in: [String]
  index_lt: String
  wisdom_ne: Int
  challenge_rating: Float
  armor_class_in: [Int]
  size: String
  charisma: Int
  hit_points_in: [Int]
  subtype_lt: String
  url_ne: String
  intelligence_gt: Int
  dexterity_nin: [Int]
  languages: String
  wisdom_lte: Int
  alignment_nin: [String]
  dexterity: Int
  charisma_gt: Int
  damage_immunities: [String]
  constitution_lt: Int
  proficiencies_exists: Boolean
  name_gte: String
  intelligence_in: [Int]
  url_exists: Boolean
  armor_class_lte: Int
  name_ne: String
  size_nin: [String]
  intelligence_nin: [Int]
  damage_vulnerabilities_nin: [String]
  type_lte: String
  strength_ne: Int
  challenge_rating_exists: Boolean
  strength_lt: Int
  proficiencies_in: [MonsterProficiencyQueryInput]
  hit_dice: String
  reactions_nin: [MonsterReactionQueryInput]
  charisma_lt: Int
  subtype_exists: Boolean
  constitution: Int
  hit_points_exists: Boolean
  damage_immunities_nin: [String]
  damage_vulnerabilities_exists: Boolean
  dexterity_lt: Int
  xp_nin: [Int]
  index: String
  subtype_ne: String
  strength_exists: Boolean
  reactions_in: [MonsterReactionQueryInput]
  condition_immunities_exists: Boolean
  languages_ne: String
  speed: MonsterSpeedQueryInput
  hit_points_ne: Int
  alignment_lt: String
  special_abilities: [MonsterSpecial_abilityQueryInput]
  index_exists: Boolean
  alignment_gt: String
  alignment_ne: String
  url: String
  actions: [MonsterActionQueryInput]
  url_nin: [String]
  hit_points_gt: Int
  AND: [MonsterQueryInput!]
  damage_resistances_exists: Boolean
  hit_points: Int
  intelligence_lte: Int
  type_nin: [String]
  xp_gt: Int
  senses: MonsterSenseQueryInput
  type_exists: Boolean
  actions_in: [MonsterActionQueryInput]
  special_abilities_in: [MonsterSpecial_abilityQueryInput]
  size_lte: String
  languages_nin: [String]
  type_lt: String
  challenge_rating_ne: Float
  strength_gt: Int
  size_lt: String
  strength_lte: Int
  hit_dice_in: [String]
  legendary_actions_exists: Boolean
  index_nin: [String]
  reactions_exists: Boolean
  charisma_in: [Int]
  damage_resistances_nin: [String]
  wisdom_lt: Int
  charisma_ne: Int
  armor_class: Int
  armor_class_nin: [Int]
  legendary_actions: [MonsterLegendary_actionQueryInput]
  challenge_rating_in: [Float]
  hit_dice_exists: Boolean
  type_gt: String
  url_lte: String
  legendary_actions_in: [MonsterLegendary_actionQueryInput]
  wisdom_gte: Int
  wisdom_in: [Int]
  armor_class_lt: Int
  hit_points_lt: Int
  xp_gte: Int
  languages_lt: String
  subtype_lte: String
  charisma_nin: [Int]
  senses_exists: Boolean
  subtype: String
  index_gt: String
  alignment_gte: String
  challenge_rating_lt: Float
  hit_dice_gt: String
  url_gt: String
  languages_exists: Boolean
  size_gte: String
  actions_nin: [MonsterActionQueryInput]
  index_gte: String
  damage_immunities_exists: Boolean
  hit_points_gte: Int
  name_lte: String
  wisdom: Int
  languages_gte: String
  intelligence_gte: Int
  constitution_lte: Int
  condition_immunities_nin: [MonsterCondition_immunityQueryInput]
  index_ne: String
  type: String
  xp_lte: Int
  intelligence: Int
  xp_exists: Boolean
  hit_points_nin: [Int]
  subtype_gt: String
  dexterity_ne: Int
  other_speeds_nin: [MonsterOther_speedQueryInput]
  subtype_gte: String
  subtype_nin: [String]
  subtype_in: [String]
  hit_dice_lte: String
  size_exists: Boolean
  constitution_exists: Boolean
  intelligence_ne: Int
  url_gte: String
  alignment_exists: Boolean
  name: String
  constitution_gte: Int
  special_abilities_nin: [MonsterSpecial_abilityQueryInput]
  dexterity_gt: Int
  size_in: [String]
  actions_exists: Boolean
  name_in: [String]
  constitution_in: [Int]
  name_gt: String
  condition_immunities: [MonsterCondition_immunityQueryInput]
  name_exists: Boolean
  constitution_gt: Int
}

type MonsterReaction {
  desc: String
  name: String
}

input MonsterReactionQueryInput {
  OR: [MonsterReactionQueryInput!]
  name_in: [String]
  desc_gt: String
  name_gte: String
  name: String
  name_exists: Boolean
  desc_gte: String
  name_gt: String
  name_lt: String
  name_lte: String
  desc_ne: String
  desc_exists: Boolean
  name_nin: [String]
  desc_lte: String
  name_ne: String
  desc_lt: String
  desc_in: [String]
  desc_nin: [String]
  AND: [MonsterReactionQueryInput!]
  desc: String
}

type MonsterSense {
  blindsight: String
  darkvision: String
  passive_perception: Int
  tremorsense: String
  truesight: String
}

input MonsterSenseQueryInput {
  blindsight_lt: String
  passive_perception_lte: Int
  truesight_in: [String]
  blindsight_gt: String
  darkvision_gt: String
  blindsight_exists: Boolean
  blindsight: String
  passive_perception_exists: Boolean
  truesight_nin: [String]
  tremorsense_nin: [String]
  darkvision_exists: Boolean
  blindsight_in: [String]
  darkvision_in: [String]
  darkvision_lte: String
  blindsight_nin: [String]
  tremorsense_lt: String
  truesight_ne: String
  blindsight_lte: String
  darkvision_nin: [String]
  OR: [MonsterSenseQueryInput!]
  passive_perception_ne: Int
  AND: [MonsterSenseQueryInput!]
  tremorsense_in: [String]
  passive_perception: Int
  tremorsense_gte: String
  truesight_exists: Boolean
  truesight_lte: String
  tremorsense_gt: String
  truesight_gt: String
  blindsight_gte: String
  passive_perception_in: [Int]
  truesight: String
  passive_perception_gte: Int
  truesight_lt: String
  darkvision_lt: String
  blindsight_ne: String
  tremorsense_exists: Boolean
  darkvision_gte: String
  tremorsense_lte: String
  tremorsense_ne: String
  passive_perception_nin: [Int]
  darkvision_ne: String
  passive_perception_gt: Int
  darkvision: String
  truesight_gte: String
  passive_perception_lt: Int
  tremorsense: String
}

enum MonsterSortByInput {
  WISDOM_ASC
  ARMOR_CLASS_ASC
  NAME_ASC
  ALIGNMENT_ASC
  SUBTYPE_DESC
  DEXTERITY_ASC
  WISDOM_DESC
  _ID_DESC
  INDEX_DESC
  NAME_DESC
  CHARISMA_ASC
  TYPE_DESC
  URL_ASC
  HIT_POINTS_ASC
  DEXTERITY_DESC
  CONSTITUTION_DESC
  LANGUAGES_ASC
  XP_DESC
  HIT_DICE_DESC
  CONSTITUTION_ASC
  STRENGTH_DESC
  LANGUAGES_DESC
  TYPE_ASC
  CHALLENGE_RATING_ASC
  CHALLENGE_RATING_DESC
  HIT_DICE_ASC
  INDEX_ASC
  HIT_POINTS_DESC
  CHARISMA_DESC
  SUBTYPE_ASC
  INTELLIGENCE_DESC
  SIZE_ASC
  SIZE_DESC
  STRENGTH_ASC
  URL_DESC
  INTELLIGENCE_ASC
  ALIGNMENT_DESC
  XP_ASC
  _ID_ASC
  ARMOR_CLASS_DESC
}

type MonsterSpecial_ability {
  desc: String
  name: String
}

input MonsterSpecial_abilityQueryInput {
  desc_exists: Boolean
  desc_ne: String
  desc: String
  OR: [MonsterSpecial_abilityQueryInput!]
  desc_in: [String]
  name_nin: [String]
  desc_lte: String
  name: String
  name_lt: String
  name_gte: String
  desc_gt: String
  name_lte: String
  name_exists: Boolean
  desc_lt: String
  name_gt: String
  AND: [MonsterSpecial_abilityQueryInput!]
  name_ne: String
  name_in: [String]
  desc_nin: [String]
  desc_gte: String
}

type MonsterSpeed {
  burrow: String
  climb: String
  fly: String
  hover: Boolean
  swim: String
  walk: String
}

input MonsterSpeedQueryInput {
  climb_lt: String
  hover: Boolean
  swim_nin: [String]
  burrow_ne: String
  fly_ne: String
  fly_lte: String
  walk_gte: String
  walk_ne: String
  walk_gt: String
  fly_gt: String
  climb_in: [String]
  burrow_in: [String]
  climb_ne: String
  burrow_exists: Boolean
  burrow: String
  walk_nin: [String]
  climb_gt: String
  swim_lte: String
  hover_exists: Boolean
  hover_ne: Boolean
  burrow_gte: String
  burrow_lte: String
  fly_gte: String
  walk_lte: String
  burrow_lt: String
  climb_exists: Boolean
  swim_gt: String
  climb_gte: String
  fly_in: [String]
  walk_lt: String
  burrow_gt: String
  fly_lt: String
  swim_exists: Boolean
  swim_gte: String
  walk_in: [String]
  burrow_nin: [String]
  fly_exists: Boolean
  fly: String
  swim_lt: String
  swim_in: [String]
  swim_ne: String
  walk: String
  climb_nin: [String]
  OR: [MonsterSpeedQueryInput!]
  walk_exists: Boolean
  climb_lte: String
  AND: [MonsterSpeedQueryInput!]
  climb: String
  fly_nin: [String]
  swim: String
}
`;

const resolvers = {
  Query: {
    monster: async (_, { query }) => {
      return await Monster.findOne(query).exec();
    },
    monsters: async (_, { query, sortBy }) => {
      return await Monster.find(query)
        .sort(sortBy)
        .exec();
    }
  }
};

module.exports = {
  typeDef,
  resolvers
};
