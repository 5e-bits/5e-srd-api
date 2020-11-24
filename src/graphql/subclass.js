const Subclass = require('../models/subclass');

const typeDef = `
type Subclass {
  class: SubclassClass
  desc: [String]
  index: String
  name: String
  spells: [SubclassSpell]
  subclass_flavor: String
  subclass_levels: String
  url: String
}

type SubclassClass {
  index: String
  name: String
  url: String
}

input SubclassClassQueryInput {
  AND: [SubclassClassQueryInput!]
  index_gt: String
  index_in: [String]
  url_exists: Boolean
  name: String
  index_nin: [String]
  name_ne: String
  url_lte: String
  index: String
  url_in: [String]
  name_gt: String
  OR: [SubclassClassQueryInput!]
  name_in: [String]
  index_lte: String
  name_nin: [String]
  name_exists: Boolean
  name_lte: String
  name_gte: String
  index_lt: String
  url: String
  name_lt: String
  url_nin: [String]
  index_gte: String
  url_gt: String
  index_exists: Boolean
  url_ne: String
  url_lt: String
  index_ne: String
  url_gte: String
}

input SubclassQueryInput {
  index_nin: [String]
  subclass_flavor: String
  _id_exists: Boolean
  index_lte: String
  url_exists: Boolean
  subclass_flavor_in: [String]
  subclass_flavor_lte: String
  subclass_flavor_gte: String
  index_gte: String
  url_nin: [String]
  index_lt: String
  index_ne: String
  subclass_levels_in: [String]
  url_lt: String
  subclass_flavor_lt: String
  index: String
  name_exists: Boolean
  subclass_levels_exists: Boolean
  subclass_levels_gt: String
  spells: [SubclassSpellQueryInput]
  url_lte: String
  subclass_levels_nin: [String]
  url_in: [String]
  subclass_levels_lt: String
  OR: [SubclassQueryInput!]
  url_ne: String
  url_gte: String
  name_in: [String]
  subclass_flavor_ne: String
  name_gt: String
  name_nin: [String]
  subclass_levels: String
  name_gte: String
  name_lte: String
  index_exists: Boolean
  class_exists: Boolean
  desc_exists: Boolean
  AND: [SubclassQueryInput!]
  class: SubclassClassQueryInput
  subclass_levels_ne: String
  spells_in: [SubclassSpellQueryInput]
  index_in: [String]
  desc_nin: [String]
  desc: [String]
  index_gt: String
  spells_exists: Boolean
  name_lt: String
  subclass_flavor_nin: [String]
  url: String
  subclass_levels_lte: String
  name_ne: String
  subclass_flavor_gt: String
  desc_in: [String]
  subclass_levels_gte: String
  name: String
  subclass_flavor_exists: Boolean
  url_gt: String
  spells_nin: [SubclassSpellQueryInput]
}

enum SubclassSortByInput {
  URL_DESC
  INDEX_ASC
  _ID_ASC
  NAME_ASC
  NAME_DESC
  SUBCLASS_FLAVOR_ASC
  SUBCLASS_LEVELS_DESC
  URL_ASC
  INDEX_DESC
  _ID_DESC
  SUBCLASS_FLAVOR_DESC
  SUBCLASS_LEVELS_ASC
}

type SubclassSpell {
  prerequisites: [SubclassSpellPrerequisite]
  spell: SubclassSpellSpell
}

type SubclassSpellPrerequisite {
  index: String
  name: String
  type: String
  url: String
}

input SubclassSpellPrerequisiteQueryInput {
  type_in: [String]
  type_ne: String
  index_exists: Boolean
  index_nin: [String]
  name_ne: String
  name_exists: Boolean
  index_in: [String]
  index: String
  name_gt: String
  url_in: [String]
  url_gt: String
  url_lt: String
  name_lt: String
  index_lt: String
  type_gt: String
  name_nin: [String]
  name_gte: String
  type_exists: Boolean
  url: String
  url_nin: [String]
  index_gt: String
  OR: [SubclassSpellPrerequisiteQueryInput!]
  name: String
  name_lte: String
  type_gte: String
  type_lte: String
  type: String
  index_gte: String
  name_in: [String]
  AND: [SubclassSpellPrerequisiteQueryInput!]
  url_gte: String
  index_ne: String
  type_lt: String
  type_nin: [String]
  url_exists: Boolean
  url_ne: String
  index_lte: String
  url_lte: String
}

input SubclassSpellQueryInput {
  prerequisites: [SubclassSpellPrerequisiteQueryInput]
  prerequisites_in: [SubclassSpellPrerequisiteQueryInput]
  prerequisites_nin: [SubclassSpellPrerequisiteQueryInput]
  prerequisites_exists: Boolean
  AND: [SubclassSpellQueryInput!]
  OR: [SubclassSpellQueryInput!]
  spell: SubclassSpellSpellQueryInput
  spell_exists: Boolean
}

type SubclassSpellSpell {
  index: String
  name: String
  url: String
}

input SubclassSpellSpellQueryInput {
  index_nin: [String]
  OR: [SubclassSpellSpellQueryInput!]
  name_gt: String
  name_in: [String]
  name_lt: String
  index: String
  url_exists: Boolean
  url_lte: String
  name_gte: String
  index_ne: String
  name_lte: String
  url_nin: [String]
  index_lte: String
  url_ne: String
  index_exists: Boolean
  index_lt: String
  index_in: [String]
  url_lt: String
  url_gt: String
  url_in: [String]
  name_exists: Boolean
  AND: [SubclassSpellSpellQueryInput!]
  name: String
  index_gte: String
  name_nin: [String]
  url: String
  name_ne: String
  url_gte: String
  index_gt: String
}
`;

const resolvers = {
  Query: {
    subclass: async (_, { query }) => {
      return await Subclass.findOne(query).exec();
    },
    subclasses: async (_, { query, sortBy }) => {
      return await Subclass.find(query)
        .sort(sortBy)
        .exec();
    }
  }
};

module.exports = {
  typeDef,
  resolvers
};
