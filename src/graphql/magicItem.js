const MagicItem = require('../models/magicItem');

const typeDef = `
extend type Query {
  magicItem(query: MagicItemQueryInput): MagicItem
  magicItems(query: MagicItemQueryInput, sortBy: MagicItemSortByInput): [MagicItem]!
}

type MagicItem {
  desc: [String]
  equipment_category: MagicItemEquipment_category
  index: String
  name: String
  url: String
}

type MagicItemEquipment_category {
  index: String
  name: String
  url: String
}

input MagicItemEquipment_categoryQueryInput {
  AND: [MagicItemEquipment_categoryQueryInput!]
  url_nin: [String]
  name_gte: String
  url: String
  index_nin: [String]
  url_gte: String
  name_nin: [String]
  url_lte: String
  index_in: [String]
  name_ne: String
  index_lte: String
  name_lte: String
  name: String
  name_gt: String
  url_exists: Boolean
  index_gte: String
  OR: [MagicItemEquipment_categoryQueryInput!]
  name_lt: String
  url_ne: String
  url_lt: String
  index_ne: String
  index_lt: String
  url_in: [String]
  index: String
  index_gt: String
  index_exists: Boolean
  url_gt: String
  name_exists: Boolean
  name_in: [String]
}

input MagicItemQueryInput {
  index_lt: String
  _id_exists: Boolean
  url_in: [String]
  name_exists: Boolean
  name: String
  name_ne: String
  name_nin: [String]
  url_ne: String
  name_lt: String
  equipment_category_exists: Boolean
  name_in: [String]
  desc_nin: [String]
  equipment_category: MagicItemEquipment_categoryQueryInput
  index_ne: String
  url_gte: String
  url_nin: [String]
  url_lte: String
  url_exists: Boolean
  index: String
  desc_in: [String]
  AND: [MagicItemQueryInput!]
  name_gt: String
  index_in: [String]
  desc_exists: Boolean
  index_lte: String
  desc: [String]
  url: String
  name_gte: String
  name_lte: String
  OR: [MagicItemQueryInput!]
  url_lt: String
  index_exists: Boolean
  url_gt: String
  index_nin: [String]
  index_gte: String
  index_gt: String
}

enum MagicItemSortByInput {
  INDEX_ASC
  INDEX_DESC
  NAME_ASC
  NAME_DESC
  URL_ASC
  URL_DESC
  _ID_ASC
  _ID_DESC
}
`;

const resolvers = {
  Query: {
    magicItem: async (_, { query }) => {
      return await MagicItem.findOne(query).exec();
    },
    magicItems: async (_, { query, sortBy }) => {
      return await MagicItem.find(query)
        .sort(sortBy)
        .exec();
    },
  },
};

module.exports = {
  typeDef,
  resolvers,
};
