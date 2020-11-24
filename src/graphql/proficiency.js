const Proficiency = require('../models/proficiency');

const typeDef = `
extend type Query {
  proficiencies(query: ProficiencyQueryInput, sortBy: ProficiencySortByInput): [Proficiency]!
  proficiency(query: ProficiencyQueryInput): Proficiency
}

type Proficiency {
  classes: [ProficiencyClass]
  index: String
  name: String
  races: [ProficiencyRace]
  references: [ProficiencyReference]
  type: String
  url: String
}

type ProficiencyClass {
  index: String
  name: String
  url: String
}

input ProficiencyClassQueryInput {
  name_exists: Boolean
  name_nin: [String]
  url_gt: String
  index_in: [String]
  index_lte: String
  index_exists: Boolean
  url_nin: [String]
  index_lt: String
  index_ne: String
  name_lt: String
  name_ne: String
  url_gte: String
  index_gte: String
  name: String
  name_gte: String
  url_in: [String]
  AND: [ProficiencyClassQueryInput!]
  index: String
  name_lte: String
  name_gt: String
  OR: [ProficiencyClassQueryInput!]
  url_exists: Boolean
  index_gt: String
  url_ne: String
  index_nin: [String]
  url: String
  url_lt: String
  name_in: [String]
  url_lte: String
}

input ProficiencyQueryInput {
  name_gte: String
  url_gt: String
  type_exists: Boolean
  races_nin: [ProficiencyRaceQueryInput]
  type_nin: [String]
  OR: [ProficiencyQueryInput!]
  url_ne: String
  references_in: [ProficiencyReferenceQueryInput]
  name_in: [String]
  type_in: [String]
  url_lte: String
  name_gt: String
  name_lt: String
  url_lt: String
  url_in: [String]
  type: String
  url: String
  classes_exists: Boolean
  races: [ProficiencyRaceQueryInput]
  name_lte: String
  name_exists: Boolean
  classes_nin: [ProficiencyClassQueryInput]
  index_lt: String
  url_nin: [String]
  url_exists: Boolean
  references: [ProficiencyReferenceQueryInput]
  _id_exists: Boolean
  index_gt: String
  index_nin: [String]
  type_gte: String
  name_nin: [String]
  races_in: [ProficiencyRaceQueryInput]
  name: String
  races_exists: Boolean
  type_ne: String
  type_lt: String
  index_in: [String]
  index_exists: Boolean
  classes_in: [ProficiencyClassQueryInput]
  name_ne: String
  index_lte: String
  index_ne: String
  classes: [ProficiencyClassQueryInput]
  index: String
  references_exists: Boolean
  type_lte: String
  type_gt: String
  references_nin: [ProficiencyReferenceQueryInput]
  index_gte: String
  url_gte: String
  AND: [ProficiencyQueryInput!]
}

type ProficiencyRace {
  index: String
  name: String
  url: String
}

input ProficiencyRaceQueryInput {
  index_ne: String
  index_gt: String
  url: String
  url_nin: [String]
  name_lte: String
  name_exists: Boolean
  name_in: [String]
  index_exists: Boolean
  url_gt: String
  name: String
  name_nin: [String]
  index_lt: String
  OR: [ProficiencyRaceQueryInput!]
  name_gt: String
  name_ne: String
  index_lte: String
  url_gte: String
  name_lt: String
  url_in: [String]
  index_in: [String]
  url_exists: Boolean
  index_gte: String
  url_lt: String
  index_nin: [String]
  AND: [ProficiencyRaceQueryInput!]
  url_ne: String
  name_gte: String
  url_lte: String
  index: String
}

type ProficiencyReference {
  index: String
  name: String
  type: String
  url: String
}

input ProficiencyReferenceQueryInput {
  url_in: [String]
  name_gt: String
  index_in: [String]
  index_gte: String
  name: String
  type_gte: String
  url_lte: String
  name_nin: [String]
  AND: [ProficiencyReferenceQueryInput!]
  url_gt: String
  index_gt: String
  url_lt: String
  name_exists: Boolean
  type_lte: String
  index_exists: Boolean
  name_lte: String
  index_ne: String
  type_in: [String]
  index: String
  type_gt: String
  url_gte: String
  index_lt: String
  type_nin: [String]
  url_nin: [String]
  OR: [ProficiencyReferenceQueryInput!]
  type_ne: String
  url: String
  name_gte: String
  index_nin: [String]
  index_lte: String
  url_exists: Boolean
  name_in: [String]
  name_ne: String
  type: String
  type_lt: String
  type_exists: Boolean
  url_ne: String
  name_lt: String
}

enum ProficiencySortByInput {
  NAME_ASC
  TYPE_ASC
  _ID_ASC
  _ID_DESC
  NAME_DESC
  TYPE_DESC
  URL_ASC
  URL_DESC
  INDEX_ASC
  INDEX_DESC
}
`;

const resolvers = {
  Query: {
    proficiencies: async (_, { query, sortBy }) => {
      return await Proficiency.find(query)
        .sort(sortBy)
        .exec();
    },
    proficiency: async (_, { query }) => {
      return await Proficiency.findOne(query).exec();
    }
  }
};

module.exports = {
  typeDef,
  resolvers
};
