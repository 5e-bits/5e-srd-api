const AbilityScore = require('../models/abilityScore');

const typeDef = `
extend type Query {
  abilityScore(query: AbilityScoreQueryInput): AbilityScore
  abilityScores(query: AbilityScoreQueryInput, sortBy: AbilityScoreSortByInput): [AbilityScore]!
}

type AbilityScore {
  desc: [String]
  full_name: String
  index: String
  name: String
  skills: [AbilityScoreSkill]
  url: String
}

input AbilityScoreQueryInput {
  name_gt: String
  full_name_ne: String
  full_name_lte: String
  name: String
  name_lt: String
  skills_nin: [AbilityScoreSkillQueryInput]
  full_name: String
  name_exists: Boolean
  full_name_gt: String
  skills_exists: Boolean
  full_name_exists: Boolean
  index_gt: String
  url_exists: Boolean
  index_exists: Boolean
  skills_in: [AbilityScoreSkillQueryInput]
  index_nin: [String]
  url: String
  url_in: [String]
  url_lte: String
  url_nin: [String]
  index_in: [String]
  name_ne: String
  index_gte: String
  index_lt: String
  full_name_gte: String
  skills: [AbilityScoreSkillQueryInput]
  OR: [AbilityScoreQueryInput!]
  desc_nin: [String]
  name_gte: String
  desc_in: [String]
  url_gte: String
  full_name_lt: String
  AND: [AbilityScoreQueryInput!]
  name_in: [String]
  full_name_nin: [String]
  name_nin: [String]
  _id_exists: Boolean
  index_lte: String
  url_lt: String
  index_ne: String
  url_ne: String
  name_lte: String
  desc_exists: Boolean
  index: String
  full_name_in: [String]
  desc: [String]
  url_gt: String
}

type AbilityScoreSkill {
  index: String
  name: String
  url: String
}

input AbilityScoreSkillQueryInput {
  url_nin: [String]
  url_in: [String]
  index_lt: String
  url_gte: String
  index_in: [String]
  url_ne: String
  index: String
  url_exists: Boolean
  index_lte: String
  index_ne: String
  name: String
  name_lte: String
  name_exists: Boolean
  name_in: [String]
  index_gt: String
  name_lt: String
  AND: [AbilityScoreSkillQueryInput!]
  name_ne: String
  url_lte: String
  index_exists: Boolean
  OR: [AbilityScoreSkillQueryInput!]
  index_gte: String
  name_nin: [String]
  index_nin: [String]
  name_gt: String
  url_lt: String
  url: String
  url_gt: String
  name_gte: String
}

enum AbilityScoreSortByInput {
  FULL_NAME_ASC
  FULL_NAME_DESC
  INDEX_ASC
  INDEX_DESC
  URL_ASC
  _ID_ASC
  NAME_ASC
  NAME_DESC
  URL_DESC
  _ID_DESC
}
`;

const resolvers = {
  Query: {
    abilityScore: async (_, { query }) => {
      return await AbilityScore.findOne(query).exec();
    },
    abilityScores: async (_, { query, sortBy }) => {
      return await AbilityScore.find(query)
        .sort(sortBy)
        .exec();
    }
  }
};

module.exports = {
  typeDef,
  resolvers
};
