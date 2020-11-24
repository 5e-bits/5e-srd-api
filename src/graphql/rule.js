const Rule = require('../models/rule');

const typeDef = `
type Rule {
  desc: String
  index: String
  name: String
  subsections: [RuleSubsection]
  url: String
}

input RuleQueryInput {
  index_ne: String
  desc_in: [String]
  subsections_nin: [RuleSubsectionQueryInput]
  index_exists: Boolean
  url_lte: String
  url_exists: Boolean
  desc_ne: String
  desc_gte: String
  index_gt: String
  url_gt: String
  name_ne: String
  url_nin: [String]
  desc: String
  index: String
  name_nin: [String]
  desc_gt: String
  index_in: [String]
  index_nin: [String]
  index_gte: String
  OR: [RuleQueryInput!]
  url_in: [String]
  url_lt: String
  desc_lte: String
  url_ne: String
  url: String
  index_lt: String
  name_in: [String]
  name_exists: Boolean
  name_lte: String
  desc_exists: Boolean
  desc_lt: String
  name: String
  desc_nin: [String]
  subsections: [RuleSubsectionQueryInput]
  _id_exists: Boolean
  name_gte: String
  AND: [RuleQueryInput!]
  url_gte: String
  subsections_exists: Boolean
  subsections_in: [RuleSubsectionQueryInput]
  name_lt: String
  index_lte: String
  name_gt: String
}

enum RuleSortByInput {
  _ID_ASC
  DESC_ASC
  INDEX_ASC
  NAME_DESC
  URL_DESC
  _ID_DESC
  DESC_DESC
  INDEX_DESC
  NAME_ASC
  URL_ASC
}

type RuleSubsection {
  index: String
  name: String
  url: String
}

input RuleSubsectionQueryInput {
  index_gte: String
  name_ne: String
  url_gt: String
  name_exists: Boolean
  index_ne: String
  url_lt: String
  name: String
  name_gte: String
  name_lte: String
  url_nin: [String]
  url_ne: String
  OR: [RuleSubsectionQueryInput!]
  url: String
  name_nin: [String]
  index_nin: [String]
  index_in: [String]
  name_lt: String
  index: String
  index_exists: Boolean
  index_lte: String
  name_in: [String]
  url_lte: String
  url_gte: String
  name_gt: String
  url_in: [String]
  url_exists: Boolean
  AND: [RuleSubsectionQueryInput!]
  index_gt: String
  index_lt: String
}
`;

const resolvers = {
  Query: {
    rule: async (_, { query }) => {
      return await Rule.findOne(query).exec();
    },
    rules: async (_, { query, sortBy }) => {
      return await Rule.find(query)
        .sort(sortBy)
        .exec();
    }
  }
};

module.exports = {
  typeDef,
  resolvers
};
