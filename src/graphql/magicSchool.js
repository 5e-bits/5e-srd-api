const MagicSchool = require('../models/magicSchool');

const typeDef = `
extend type Query {
  magicSchool(query: MagicSchoolQueryInput): MagicSchool
  magicSchools(query: MagicSchoolQueryInput, sortBy: MagicSchoolSortByInput): [MagicSchool]!
}

type MagicSchool {
  desc: String
  index: String
  name: String
  url: String
}

input MagicSchoolQueryInput {
  index_lt: String
  desc_in: [String]
  desc_nin: [String]
  desc_gt: String
  name_in: [String]
  name_lte: String
  index_exists: Boolean
  index_ne: String
  desc_lt: String
  url_lt: String
  index_in: [String]
  url_nin: [String]
  url_lte: String
  index: String
  name_gte: String
  desc_ne: String
  name_exists: Boolean
  _id_exists: Boolean
  url_exists: Boolean
  index_lte: String
  url_in: [String]
  OR: [MagicSchoolQueryInput!]
  index_nin: [String]
  AND: [MagicSchoolQueryInput!]
  desc_exists: Boolean
  url_gte: String
  name_ne: String
  name_gt: String
  desc_lte: String
  index_gte: String
  desc_gte: String
  name_nin: [String]
  url: String
  url_ne: String
  name: String
  url_gt: String
  index_gt: String
  name_lt: String
  desc: String
}

enum MagicSchoolSortByInput {
  DESC_DESC
  INDEX_ASC
  INDEX_DESC
  NAME_ASC
  NAME_DESC
  _ID_DESC
  DESC_ASC
  URL_DESC
  _ID_ASC
  URL_ASC
}
`;

const resolvers = {
  Query: {
    magicSchool: async (_, { query }) => {
      return await MagicSchool.findOne(query).exec();
    },
    magicSchools: async (_, { query, sortBy }) => {
      return await MagicSchool.find(query)
        .sort(sortBy)
        .exec();
    },
  },
};

module.exports = {
  typeDef,
  resolvers,
};
