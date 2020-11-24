const EquipmentCategory = require('../models/equipmentCategory');

const typeDef = `
extend type Query {
  equipmentCategories(query: EquipmentCategoryQueryInput, sortBy: EquipmentCategorySortByInput): [EquipmentCategory]!
  equipmentCategory(query: EquipmentCategoryQueryInput): EquipmentCategory
}

type EquipmentCategory {
  equipment: [EquipmentCategoryEquipment]
  index: String
  name: String
  url: String
}

type EquipmentCategoryEquipment {
  index: String
  name: String
  url: String
}

input EquipmentCategoryEquipmentQueryInput {
  url_gte: String
  url_lte: String
  index_in: [String]
  url_ne: String
  index_ne: String
  name_in: [String]
  url_lt: String
  url_gt: String
  AND: [EquipmentCategoryEquipmentQueryInput!]
  url_nin: [String]
  index_lt: String
  index_gt: String
  url: String
  name_gt: String
  name_nin: [String]
  name_exists: Boolean
  index: String
  name: String
  name_gte: String
  index_nin: [String]
  name_lte: String
  url_in: [String]
  index_lte: String
  url_exists: Boolean
  OR: [EquipmentCategoryEquipmentQueryInput!]
  name_ne: String
  index_exists: Boolean
  index_gte: String
  name_lt: String
}

input EquipmentCategoryQueryInput {
  url_gt: String
  name_in: [String]
  index_exists: Boolean
  _id_exists: Boolean
  url_lt: String
  name_gte: String
  equipment: [EquipmentCategoryEquipmentQueryInput]
  index_ne: String
  index_gt: String
  name: String
  index_gte: String
  index_lte: String
  equipment_exists: Boolean
  url_gte: String
  OR: [EquipmentCategoryQueryInput!]
  index: String
  name_gt: String
  url: String
  url_in: [String]
  index_lt: String
  name_lt: String
  url_exists: Boolean
  url_nin: [String]
  name_nin: [String]
  equipment_in: [EquipmentCategoryEquipmentQueryInput]
  name_lte: String
  url_ne: String
  AND: [EquipmentCategoryQueryInput!]
  name_ne: String
  equipment_nin: [EquipmentCategoryEquipmentQueryInput]
  url_lte: String
  index_nin: [String]
  index_in: [String]
  name_exists: Boolean
}

enum EquipmentCategorySortByInput {
  INDEX_DESC
  NAME_ASC
  NAME_DESC
  URL_ASC
  URL_DESC
  _ID_ASC
  _ID_DESC
  INDEX_ASC
}
`;

const resolvers = {
  Query: {
    equipmentCategories: async (_, { query, sortBy }) => {
      return await EquipmentCategory.find(query)
        .sort(sortBy)
        .exec();
    },
    equipmentCategory: async (_, { query }) => {
      return await EquipmentCategory.findOne(query).exec();
    }
  }
};

module.exports = {
  typeDef,
  resolvers
};
