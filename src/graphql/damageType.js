const DamageType = require('../models/damageType');

const typeDef = `
type DamageType {
  desc: [String]
  index: String
  name: String
  url: String
}

input DamageTypeQueryInput {
  index_in: [String]
  url_in: [String]
  name_lte: String
  index_gt: String
  desc: [String]
  index_gte: String
  index_lt: String
  url_gt: String
  name_exists: Boolean
  name_ne: String
  url_gte: String
  url_nin: [String]
  url: String
  index_exists: Boolean
  url_ne: String
  name_lt: String
  index_lte: String
  url_exists: Boolean
  desc_nin: [String]
  index_nin: [String]
  desc_in: [String]
  name_in: [String]
  name_gt: String
  desc_exists: Boolean
  name: String
  AND: [DamageTypeQueryInput!]
  index: String
  name_gte: String
  url_lte: String
  name_nin: [String]
  _id_exists: Boolean
  index_ne: String
  url_lt: String
  OR: [DamageTypeQueryInput!]
}

enum DamageTypeSortByInput {
  _ID_DESC
  INDEX_ASC
  INDEX_DESC
  NAME_ASC
  NAME_DESC
  URL_ASC
  URL_DESC
  _ID_ASC
}
`;

const resolvers = {
  Query: {
    damageType: async (_, { query }) => {
      return await DamageType.findOne(query).exec();
    },
    damageTypes: async (_, { query, sortBy }) => {
      return await DamageType.find(query)
        .sort(sortBy)
        .exec();
    }
  }
};

module.exports = {
  typeDef,
  resolvers
};
