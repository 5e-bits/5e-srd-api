const RuleSection = require('../models/ruleSection');

const typeDef = `
type RuleSection {
  desc: String
  index: String
  name: String
  url: String
}

input RuleSectionQueryInput {
  name_lte: String
  index_nin: [String]
  name_nin: [String]
  url_lt: String
  desc_gt: String
  index_gt: String
  index_exists: Boolean
  desc: String
  index_in: [String]
  index_gte: String
  name_ne: String
  index: String
  url_lte: String
  url_ne: String
  url_gte: String
  desc_lt: String
  name_gte: String
  url_nin: [String]
  url_gt: String
  url: String
  desc_in: [String]
  desc_nin: [String]
  index_ne: String
  name: String
  desc_gte: String
  url_exists: Boolean
  name_exists: Boolean
  desc_exists: Boolean
  url_in: [String]
  desc_ne: String
  index_lte: String
  AND: [RuleSectionQueryInput!]
  _id_exists: Boolean
  OR: [RuleSectionQueryInput!]
  name_gt: String
  desc_lte: String
  index_lt: String
  name_in: [String]
  name_lt: String
}

enum RuleSectionSortByInput {
  NAME_DESC
  URL_ASC
  _ID_ASC
  DESC_ASC
  DESC_DESC
  INDEX_ASC
  NAME_ASC
  _ID_DESC
  INDEX_DESC
  URL_DESC
}
`;

const resolvers = {
  Query: {
    ruleSection: async (_, { query }) => {
      return await RuleSection.findOne(query).exec();
    },
    ruleSections: async (_, { query, sortBy }) => {
      return await RuleSection.find(query)
        .sort(sortBy)
        .exec();
    }
  }
};

module.exports = {
  typeDef,
  resolvers
};
