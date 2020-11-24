const Condition = require('../models/condition');

const typeDef = `
extend type Query {
  condition(query: ConditionQueryInput): Condition
  conditions(query: ConditionQueryInput, sortBy: ConditionSortByInput): [Condition]!
}

type Condition {
  desc: [String]
  index: String
  name: String
  url: String
}

input ConditionQueryInput {
  url_nin: [String]
  desc: [String]
  index_in: [String]
  index_exists: Boolean
  url_lt: String
  url_exists: Boolean
  name_ne: String
  _id_exists: Boolean
  url_gte: String
  name: String
  desc_exists: Boolean
  AND: [ConditionQueryInput!]
  name_in: [String]
  name_gte: String
  name_exists: Boolean
  url_ne: String
  url_gt: String
  desc_nin: [String]
  index_lte: String
  name_gt: String
  index_ne: String
  index_gte: String
  url_lte: String
  url: String
  index_gt: String
  desc_in: [String]
  index_nin: [String]
  name_lt: String
  index: String
  url_in: [String]
  name_nin: [String]
  index_lt: String
  OR: [ConditionQueryInput!]
  name_lte: String
}

enum ConditionSortByInput {
  URL_ASC
  URL_DESC
  _ID_ASC
  _ID_DESC
  INDEX_ASC
  INDEX_DESC
  NAME_ASC
  NAME_DESC
}
`;

const resolvers = {
  Query: {
    condition: async (_, { query }) => {
      return await Condition.findOne(query).exec();
    },
    conditions: async (_, { query, sortBy }) => {
      return await Condition.find(query)
        .sort(sortBy)
        .exec();
    }
  }
};

module.exports = {
  typeDef,
  resolvers
};
