const Spell = require('../models/spell');

const typeDef = `
extend type Query {
  spell(query: SpellQueryInput): Spell
  spells(query: SpellQueryInput, sortBy: SpellSortByInput): [Spell]!
}

type Spell {
  area_of_effect: SpellArea_of_effect
  attack_type: String
  casting_time: String
  classes: [SpellClass]
  components: [String]
  concentration: Boolean
  damage: SpellDamage
  dc: SpellDc
  desc: [String]
  duration: String
  higher_level: [String]
  index: String
  level: Int
  material: String
  name: String
  range: String
  ritual: Boolean
  school: SpellSchool
  subclasses: [SpellSubclass]
  url: String
}

type SpellArea_of_effect {
  size: Int
  type: String
}

input SpellArea_of_effectQueryInput {
  type: String
  type_exists: Boolean
  OR: [SpellArea_of_effectQueryInput!]
  type_gte: String
  size_gt: Int
  size_gte: Int
  size_in: [Int]
  type_gt: String
  size_ne: Int
  type_lt: String
  type_nin: [String]
  AND: [SpellArea_of_effectQueryInput!]
  size_lt: Int
  type_ne: String
  size: Int
  size_exists: Boolean
  size_nin: [Int]
  type_lte: String
  type_in: [String]
  size_lte: Int
}

type SpellClass {
  index: String
  name: String
  url: String
}

input SpellClassQueryInput {
  url_ne: String
  url_nin: [String]
  index: String
  name_in: [String]
  index_in: [String]
  name_ne: String
  url_in: [String]
  index_gte: String
  name: String
  index_lt: String
  name_lt: String
  name_lte: String
  OR: [SpellClassQueryInput!]
  index_ne: String
  url_gte: String
  name_gt: String
  url: String
  index_exists: Boolean
  index_lte: String
  url_gt: String
  name_nin: [String]
  url_exists: Boolean
  index_nin: [String]
  name_exists: Boolean
  url_lte: String
  index_gt: String
  name_gte: String
  url_lt: String
  AND: [SpellClassQueryInput!]
}

type SpellDamage {
  damage_type: SpellDamageDamage_type
}

type SpellDamageDamage_type {
  index: String
  name: String
  url: String
}

input SpellDamageDamage_typeQueryInput {
  name_in: [String]
  index_lt: String
  index_nin: [String]
  url_gt: String
  name_lt: String
  url_exists: Boolean
  index_gt: String
  index_exists: Boolean
  name_gt: String
  url_ne: String
  index_in: [String]
  url_lte: String
  name_gte: String
  OR: [SpellDamageDamage_typeQueryInput!]
  name_exists: Boolean
  url_gte: String
  name: String
  name_lte: String
  index_lte: String
  name_ne: String
  index_ne: String
  name_nin: [String]
  index_gte: String
  url_nin: [String]
  AND: [SpellDamageDamage_typeQueryInput!]
  index: String
  url: String
  url_in: [String]
  url_lt: String
}

input SpellDamageQueryInput {
  damage_type: SpellDamageDamage_typeQueryInput
  damage_type_exists: Boolean
  AND: [SpellDamageQueryInput!]
  OR: [SpellDamageQueryInput!]
}

type SpellDc {
  dc_success: String
  dc_type: SpellDcDc_type
  desc: String
}

type SpellDcDc_type {
  index: String
  name: String
  url: String
}

input SpellDcDc_typeQueryInput {
  index_gte: String
  name_nin: [String]
  url_gt: String
  name_gt: String
  url_lt: String
  index_exists: Boolean
  url: String
  index_in: [String]
  name_lt: String
  name_exists: Boolean
  index_lte: String
  url_exists: Boolean
  url_gte: String
  OR: [SpellDcDc_typeQueryInput!]
  index_gt: String
  url_in: [String]
  name_ne: String
  url_ne: String
  index_lt: String
  index_ne: String
  url_nin: [String]
  url_lte: String
  index_nin: [String]
  AND: [SpellDcDc_typeQueryInput!]
  name: String
  index: String
  name_lte: String
  name_in: [String]
  name_gte: String
}

input SpellDcQueryInput {
  AND: [SpellDcQueryInput!]
  desc_exists: Boolean
  desc: String
  dc_success_gte: String
  desc_ne: String
  dc_success_ne: String
  desc_nin: [String]
  desc_gt: String
  dc_type: SpellDcDc_typeQueryInput
  dc_success_gt: String
  desc_lt: String
  desc_gte: String
  dc_success: String
  dc_success_exists: Boolean
  dc_success_lt: String
  dc_success_nin: [String]
  desc_lte: String
  OR: [SpellDcQueryInput!]
  dc_type_exists: Boolean
  dc_success_in: [String]
  dc_success_lte: String
  desc_in: [String]
}

input SpellQueryInput {
  damage: SpellDamageQueryInput
  dc: SpellDcQueryInput
  attack_type_gte: String
  duration: String
  index: String
  url: String
  duration_gt: String
  subclasses_exists: Boolean
  index_nin: [String]
  material_exists: Boolean
  url_gt: String
  range_lte: String
  AND: [SpellQueryInput!]
  duration_lt: String
  range_gte: String
  components_exists: Boolean
  range_exists: Boolean
  casting_time_gt: String
  attack_type_in: [String]
  material_lte: String
  url_exists: Boolean
  casting_time: String
  attack_type_lt: String
  name_lt: String
  casting_time_ne: String
  level_ne: Int
  name_in: [String]
  components_nin: [String]
  attack_type: String
  area_of_effect_exists: Boolean
  classes: [SpellClassQueryInput]
  material: String
  name_lte: String
  ritual: Boolean
  classes_exists: Boolean
  subclasses: [SpellSubclassQueryInput]
  level_in: [Int]
  school: SpellSchoolQueryInput
  url_nin: [String]
  name_gte: String
  ritual_ne: Boolean
  subclasses_in: [SpellSubclassQueryInput]
  damage_exists: Boolean
  desc_nin: [String]
  casting_time_nin: [String]
  index_exists: Boolean
  attack_type_gt: String
  duration_gte: String
  attack_type_exists: Boolean
  desc: [String]
  material_lt: String
  level_gte: Int
  level_exists: Boolean
  desc_in: [String]
  concentration_exists: Boolean
  classes_nin: [SpellClassQueryInput]
  classes_in: [SpellClassQueryInput]
  url_lt: String
  casting_time_lte: String
  index_gt: String
  school_exists: Boolean
  range_lt: String
  url_ne: String
  range_nin: [String]
  url_gte: String
  dc_exists: Boolean
  OR: [SpellQueryInput!]
  duration_exists: Boolean
  concentration_ne: Boolean
  duration_nin: [String]
  name_nin: [String]
  range_gt: String
  attack_type_ne: String
  level_lte: Int
  material_gt: String
  material_in: [String]
  attack_type_nin: [String]
  range: String
  higher_level_in: [String]
  index_gte: String
  url_in: [String]
  higher_level: [String]
  attack_type_lte: String
  name_gt: String
  index_in: [String]
  ritual_exists: Boolean
  components: [String]
  subclasses_nin: [SpellSubclassQueryInput]
  desc_exists: Boolean
  range_ne: String
  higher_level_nin: [String]
  index_lt: String
  duration_ne: String
  name_ne: String
  casting_time_lt: String
  level_lt: Int
  level_gt: Int
  name: String
  range_in: [String]
  level_nin: [Int]
  casting_time_gte: String
  _id_exists: Boolean
  url_lte: String
  level: Int
  material_ne: String
  material_nin: [String]
  material_gte: String
  duration_in: [String]
  casting_time_exists: Boolean
  name_exists: Boolean
  higher_level_exists: Boolean
  components_in: [String]
  concentration: Boolean
  area_of_effect: SpellArea_of_effectQueryInput
  casting_time_in: [String]
  index_lte: String
  index_ne: String
  duration_lte: String
}

type SpellSchool {
  index: String
  name: String
  url: String
}

input SpellSchoolQueryInput {
  name_nin: [String]
  name_gt: String
  url_in: [String]
  url_gte: String
  index_nin: [String]
  name: String
  name_ne: String
  index_ne: String
  url_lt: String
  index_gt: String
  url: String
  index_lte: String
  index_exists: Boolean
  url_nin: [String]
  index_gte: String
  name_in: [String]
  name_exists: Boolean
  url_gt: String
  OR: [SpellSchoolQueryInput!]
  AND: [SpellSchoolQueryInput!]
  index_in: [String]
  index: String
  url_exists: Boolean
  name_lt: String
  url_ne: String
  name_gte: String
  name_lte: String
  index_lt: String
  url_lte: String
}

enum SpellSortByInput {
  RANGE_ASC
  CASTING_TIME_ASC
  CASTING_TIME_DESC
  LEVEL_ASC
  LEVEL_DESC
  URL_ASC
  URL_DESC
  NAME_ASC
  NAME_DESC
  MATERIAL_ASC
  _ID_ASC
  DURATION_ASC
  INDEX_ASC
  INDEX_DESC
  _ID_DESC
  DURATION_DESC
  ATTACK_TYPE_DESC
  MATERIAL_DESC
  RANGE_DESC
  ATTACK_TYPE_ASC
}

type SpellSubclass {
  index: String
  name: String
  url: String
}

input SpellSubclassQueryInput {
  index: String
  name_lt: String
  url_nin: [String]
  name_nin: [String]
  url: String
  index_gt: String
  index_gte: String
  name_ne: String
  AND: [SpellSubclassQueryInput!]
  url_in: [String]
  url_lte: String
  url_lt: String
  index_ne: String
  name_in: [String]
  OR: [SpellSubclassQueryInput!]
  name_lte: String
  url_ne: String
  name_gt: String
  index_lte: String
  name_exists: Boolean
  index_exists: Boolean
  url_gte: String
  index_lt: String
  index_nin: [String]
  name: String
  index_in: [String]
  url_gt: String
  name_gte: String
  url_exists: Boolean
}
`;

const resolvers = {
  Query: {
    spell: async (_, { query }) => {
      return await Spell.findOne(query).exec();
    },
    spells: async (_, { query, sortBy }) => {
      return await Spell.find(query)
        .sort(sortBy)
        .exec();
    }
  }
};

module.exports = {
  typeDef,
  resolvers
};
