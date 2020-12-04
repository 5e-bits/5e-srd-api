const Class = require('../models/class');

const typeDef = `
extend type Query {
  class(query: ClassQueryInput): Class
  classes(query: ClassQueryInput, sortBy: ClassSortByInput): [Class]!
}

type Class {
  class_levels: String
  hit_die: Int
  index: String
  name: String
  proficiencies: [ClassProficiency]
  proficiency_choices: [ClassProficiency_choice]
  saving_throws: [ClassSaving_throw]
  spellcasting: ClassSpellcasting
  spells: String
  starting_equipment: String
  subclasses: [ClassSubclass]
  url: String
}

type ClassProficiency {
  index: String
  name: String
  url: String
}

type ClassProficiency_choice {
  choose: Int
  from: [ClassProficiency_choiceFrom]
  type: String
}

type ClassProficiency_choiceFrom {
  index: String
  name: String
  url: String
}

input ClassProficiency_choiceFromQueryInput {
  name_ne: String
  index_lte: String
  name_lte: String
  index_gte: String
  name_lt: String
  url: String
  url_ne: String
  index_exists: Boolean
  index_gt: String
  url_lt: String
  index_nin: [String]
  name_gt: String
  url_gte: String
  url_exists: Boolean
  url_nin: [String]
  index: String
  url_gt: String
  AND: [ClassProficiency_choiceFromQueryInput!]
  url_in: [String]
  name_gte: String
  index_ne: String
  index_lt: String
  OR: [ClassProficiency_choiceFromQueryInput!]
  name: String
  url_lte: String
  name_exists: Boolean
  index_in: [String]
  name_nin: [String]
  name_in: [String]
}

input ClassProficiency_choiceQueryInput {
  type: String
  type_nin: [String]
  choose_in: [Int]
  choose_gte: Int
  AND: [ClassProficiency_choiceQueryInput!]
  from: [ClassProficiency_choiceFromQueryInput]
  type_exists: Boolean
  choose_exists: Boolean
  type_lt: String
  type_lte: String
  choose: Int
  choose_lte: Int
  from_in: [ClassProficiency_choiceFromQueryInput]
  OR: [ClassProficiency_choiceQueryInput!]
  choose_nin: [Int]
  from_nin: [ClassProficiency_choiceFromQueryInput]
  choose_lt: Int
  type_gte: String
  type_ne: String
  from_exists: Boolean
  choose_ne: Int
  choose_gt: Int
  type_in: [String]
  type_gt: String
}

input ClassProficiencyQueryInput {
  url_lt: String
  OR: [ClassProficiencyQueryInput!]
  index_gte: String
  url_gt: String
  index_nin: [String]
  index_gt: String
  name_nin: [String]
  index_exists: Boolean
  url_nin: [String]
  index_lte: String
  name_ne: String
  name_gte: String
  url_gte: String
  AND: [ClassProficiencyQueryInput!]
  name_lt: String
  index_in: [String]
  name_gt: String
  index: String
  index_lt: String
  name: String
  url_ne: String
  url_in: [String]
  url_lte: String
  url: String
  name_exists: Boolean
  name_in: [String]
  name_lte: String
  index_ne: String
  url_exists: Boolean
}

input ClassQueryInput {
  class_levels_lte: String
  proficiency_choices_nin: [ClassProficiency_choiceQueryInput]
  index: String
  class_levels_in: [String]
  index_gt: String
  starting_equipment_lte: String
  url_lte: String
  OR: [ClassQueryInput!]
  starting_equipment_in: [String]
  proficiencies_in: [ClassProficiencyQueryInput]
  proficiencies_nin: [ClassProficiencyQueryInput]
  name_exists: Boolean
  saving_throws_nin: [ClassSaving_throwQueryInput]
  spells_nin: [String]
  proficiency_choices: [ClassProficiency_choiceQueryInput]
  spells_in: [String]
  class_levels_nin: [String]
  starting_equipment_ne: String
  proficiencies_exists: Boolean
  AND: [ClassQueryInput!]
  name: String
  url_in: [String]
  url_lt: String
  class_levels_gt: String
  index_lte: String
  index_gte: String
  class_levels_exists: Boolean
  proficiencies: [ClassProficiencyQueryInput]
  hit_die_nin: [Int]
  hit_die_in: [Int]
  starting_equipment_gt: String
  class_levels_ne: String
  spells_ne: String
  spells: String
  url_ne: String
  saving_throws_exists: Boolean
  starting_equipment_lt: String
  name_gte: String
  starting_equipment_nin: [String]
  name_lt: String
  url_exists: Boolean
  hit_die: Int
  subclasses_nin: [ClassSubclassQueryInput]
  index_in: [String]
  spells_gt: String
  index_lt: String
  spells_gte: String
  spells_lt: String
  hit_die_ne: Int
  starting_equipment_exists: Boolean
  starting_equipment_gte: String
  url: String
  class_levels_lt: String
  name_nin: [String]
  index_exists: Boolean
  hit_die_gte: Int
  spellcasting_exists: Boolean
  class_levels_gte: String
  subclasses_in: [ClassSubclassQueryInput]
  subclasses: [ClassSubclassQueryInput]
  saving_throws: [ClassSaving_throwQueryInput]
  proficiency_choices_in: [ClassProficiency_choiceQueryInput]
  hit_die_lte: Int
  name_ne: String
  saving_throws_in: [ClassSaving_throwQueryInput]
  name_lte: String
  url_nin: [String]
  url_gte: String
  index_nin: [String]
  name_in: [String]
  hit_die_lt: Int
  name_gt: String
  subclasses_exists: Boolean
  hit_die_gt: Int
  starting_equipment: String
  proficiency_choices_exists: Boolean
  _id_exists: Boolean
  class_levels: String
  spells_lte: String
  index_ne: String
  url_gt: String
  hit_die_exists: Boolean
  spellcasting: ClassSpellcastingQueryInput
  spells_exists: Boolean
}

type ClassSaving_throw {
  index: String
  name: String
  url: String
}

input ClassSaving_throwQueryInput {
  index_lt: String
  name_gte: String
  url: String
  index_nin: [String]
  index_gte: String
  url_ne: String
  name_exists: Boolean
  url_nin: [String]
  url_in: [String]
  url_gte: String
  name_lte: String
  name_nin: [String]
  index_lte: String
  index_ne: String
  index: String
  OR: [ClassSaving_throwQueryInput!]
  url_lte: String
  name_lt: String
  AND: [ClassSaving_throwQueryInput!]
  index_exists: Boolean
  name_in: [String]
  index_gt: String
  url_gt: String
  index_in: [String]
  url_lt: String
  name: String
  name_ne: String
  url_exists: Boolean
  name_gt: String
}

enum ClassSortByInput {
  SPELLS_DESC
  STARTING_EQUIPMENT_DESC
  NAME_DESC
  _ID_ASC
  HIT_DIE_ASC
  CLASS_LEVELS_DESC
  INDEX_ASC
  INDEX_DESC
  NAME_ASC
  URL_ASC
  URL_DESC
  CLASS_LEVELS_ASC
  _ID_DESC
  HIT_DIE_DESC
  SPELLS_ASC
  STARTING_EQUIPMENT_ASC
}

type ClassSpellcasting {
  info: [ClassSpellcastingInfo]
  level: Int
  spellcasting_ability: ClassSpellcastingSpellcasting_ability
}

type ClassSpellcastingInfo {
  desc: [String]
  name: String
}

input ClassSpellcastingInfoQueryInput {
  name_in: [String]
  OR: [ClassSpellcastingInfoQueryInput!]
  name_gt: String
  name_ne: String
  desc_in: [String]
  name_lt: String
  AND: [ClassSpellcastingInfoQueryInput!]
  name_gte: String
  name_lte: String
  desc: [String]
  name_exists: Boolean
  desc_exists: Boolean
  name: String
  desc_nin: [String]
  name_nin: [String]
}

input ClassSpellcastingQueryInput {
  info_exists: Boolean
  level_gt: Int
  AND: [ClassSpellcastingQueryInput!]
  level: Int
  level_in: [Int]
  spellcasting_ability_exists: Boolean
  level_lte: Int
  info_in: [ClassSpellcastingInfoQueryInput]
  spellcasting_ability: ClassSpellcastingSpellcasting_abilityQueryInput
  info: [ClassSpellcastingInfoQueryInput]
  level_lt: Int
  level_nin: [Int]
  info_nin: [ClassSpellcastingInfoQueryInput]
  level_exists: Boolean
  level_ne: Int
  level_gte: Int
  OR: [ClassSpellcastingQueryInput!]
}

type ClassSpellcastingSpellcasting_ability {
  index: String
  name: String
  url: String
}

input ClassSpellcastingSpellcasting_abilityQueryInput {
  name_lt: String
  name: String
  url_nin: [String]
  AND: [ClassSpellcastingSpellcasting_abilityQueryInput!]
  index_gt: String
  index_lte: String
  url_ne: String
  name_gte: String
  url: String
  index_exists: Boolean
  name_gt: String
  name_exists: Boolean
  index_gte: String
  name_ne: String
  url_exists: Boolean
  index_nin: [String]
  index_ne: String
  name_lte: String
  OR: [ClassSpellcastingSpellcasting_abilityQueryInput!]
  index: String
  url_gte: String
  url_gt: String
  name_nin: [String]
  url_in: [String]
  index_lt: String
  index_in: [String]
  url_lte: String
  name_in: [String]
  url_lt: String
}

type ClassSubclass {
  index: String
  name: String
  url: String
}

input ClassSubclassQueryInput {
  name_lte: String
  name_gt: String
  AND: [ClassSubclassQueryInput!]
  index_in: [String]
  name_nin: [String]
  name_gte: String
  url_lte: String
  url_gte: String
  name_ne: String
  url: String
  OR: [ClassSubclassQueryInput!]
  url_in: [String]
  name_lt: String
  index_gte: String
  url_exists: Boolean
  index_gt: String
  index_ne: String
  url_nin: [String]
  index_exists: Boolean
  name: String
  index_nin: [String]
  name_in: [String]
  url_lt: String
  name_exists: Boolean
  index_lt: String
  url_gt: String
  url_ne: String
  index: String
  index_lte: String
}
`;

const resolvers = {
  Query: {
    class: async (_, { query }) => {
      return await Class.findOne(query).exec();
    },
    classes: async (_, { query, sortBy }) => {
      return await Class.find(query)
        .sort(sortBy)
        .exec();
    },
  },
};

module.exports = {
  typeDef,
  resolvers,
};
