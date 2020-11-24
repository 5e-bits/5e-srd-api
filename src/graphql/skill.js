const Skill = require('../models/skill');

const typeDef = `
type Skill {
  ability_score: SkillAbility_score
  desc: [String]
  index: String
  name: String
  url: String
}

type SkillAbility_score {
  index: String
  name: String
  url: String
}

input SkillAbility_scoreQueryInput {
  name: String
  url_lt: String
  url: String
  name_ne: String
  url_ne: String
  url_gte: String
  url_lte: String
  index_lt: String
  index_exists: Boolean
  index_ne: String
  index: String
  url_nin: [String]
  url_exists: Boolean
  index_lte: String
  OR: [SkillAbility_scoreQueryInput!]
  name_lt: String
  AND: [SkillAbility_scoreQueryInput!]
  name_nin: [String]
  name_exists: Boolean
  name_gt: String
  index_in: [String]
  url_gt: String
  url_in: [String]
  index_gt: String
  name_gte: String
  index_nin: [String]
  index_gte: String
  name_in: [String]
  name_lte: String
}

input SkillQueryInput {
  index_gte: String
  desc_nin: [String]
  url_ne: String
  ability_score: SkillAbility_scoreQueryInput
  url_exists: Boolean
  url: String
  url_in: [String]
  name_nin: [String]
  url_nin: [String]
  index_exists: Boolean
  index_lte: String
  ability_score_exists: Boolean
  url_lt: String
  index_gt: String
  index: String
  _id_exists: Boolean
  name_gte: String
  name_ne: String
  desc: [String]
  desc_in: [String]
  name_lte: String
  name_lt: String
  index_ne: String
  name_in: [String]
  OR: [SkillQueryInput!]
  url_gte: String
  index_nin: [String]
  index_in: [String]
  name: String
  url_gt: String
  url_lte: String
  name_gt: String
  index_lt: String
  desc_exists: Boolean
  AND: [SkillQueryInput!]
  name_exists: Boolean
}

enum SkillSortByInput {
  NAME_ASC
  NAME_DESC
  URL_ASC
  URL_DESC
  _ID_ASC
  _ID_DESC
  INDEX_ASC
  INDEX_DESC
}
`;

const resolvers = {
  Query: {
    skill: async (_, { query }) => {
      return await Skill.findOne(query).exec();
    },
    skills: async (_, { query, sortBy }) => {
      return await Skill.find(query)
        .sort(sortBy)
        .exec();
    }
  }
};

module.exports = {
  typeDef,
  resolvers
};
