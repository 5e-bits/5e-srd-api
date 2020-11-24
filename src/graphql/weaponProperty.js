const WeaponProperty = require('../models/weaponProperty');

const typeDef = `
extend type Query {
  weaponProperties(query: WeaponPropertyQueryInput, sortBy: WeaponPropertySortByInput): [WeaponProperty]!
  weaponProperty(query: WeaponPropertyQueryInput): WeaponProperty
}

type WeaponProperty {
  desc: [String]
  index: String
  name: String
  url: String
}

input WeaponPropertyQueryInput {
  desc_in: [String]
  name_exists: Boolean
  index_exists: Boolean
  name: String
  url_gte: String
  url_lt: String
  index_nin: [String]
  url: String
  AND: [WeaponPropertyQueryInput!]
  name_in: [String]
  index_gt: String
  desc_nin: [String]
  index_gte: String
  _id_exists: Boolean
  name_gt: String
  url_lte: String
  url_exists: Boolean
  desc_exists: Boolean
  name_nin: [String]
  url_ne: String
  url_gt: String
  index_in: [String]
  index_lte: String
  OR: [WeaponPropertyQueryInput!]
  url_in: [String]
  name_lt: String
  name_ne: String
  name_gte: String
  url_nin: [String]
  index_ne: String
  name_lte: String
  desc: [String]
  index: String
  index_lt: String
}

enum WeaponPropertySortByInput {
  _ID_ASC
  _ID_DESC
  INDEX_ASC
  INDEX_DESC
  NAME_ASC
  NAME_DESC
  URL_ASC
  URL_DESC
}

input WeaponPropertyUpdateInput {
  desc: [String]
  name: String
  name_unset: Boolean
  url: String
  url_unset: Boolean
  desc_unset: Boolean
  index_unset: Boolean
  _id_unset: Boolean
  index: String
}
`;

const resolvers = {
  Query: {
    weaponProperties: async (_, { query, sortBy }) => {
      return await WeaponProperty.find(query)
        .sort(sortBy)
        .exec();
    },
    weaponProperty: async (_, { query }) => {
      return await WeaponProperty.findOne(query).exec();
    }
  }
};

module.exports = {
  typeDef,
  resolvers
};
