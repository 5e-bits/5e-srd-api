const Startingequipment = require('../models/startingEquipment');

const typeDef = `
type Startingequipment {
  class: StartingequipmentClass
  index: String
  starting_equipment: [StartingequipmentStarting_equipment]
  starting_equipment_options: [StartingequipmentStarting_equipment_option]
  url: String
}

type StartingequipmentClass {
  index: String
  name: String
  url: String
}

input StartingequipmentClassQueryInput {
  index_exists: Boolean
  AND: [StartingequipmentClassQueryInput!]
  url_in: [String]
  url_lte: String
  index_gt: String
  index_lte: String
  index: String
  url_exists: Boolean
  url_gt: String
  url_nin: [String]
  name_in: [String]
  name_exists: Boolean
  name_gte: String
  url: String
  name_ne: String
  index_nin: [String]
  index_in: [String]
  url_lt: String
  name: String
  OR: [StartingequipmentClassQueryInput!]
  name_lt: String
  index_gte: String
  index_ne: String
  index_lt: String
  url_gte: String
  name_lte: String
  name_gt: String
  url_ne: String
  name_nin: [String]
}

input StartingequipmentQueryInput {
  url_ne: String
  index: String
  url_gt: String
  url_exists: Boolean
  AND: [StartingequipmentQueryInput!]
  starting_equipment_options: [StartingequipmentStarting_equipment_optionQueryInput]
  class: StartingequipmentClassQueryInput
  index_gte: String
  url_lte: String
  index_ne: String
  starting_equipment_in: [StartingequipmentStarting_equipmentQueryInput]
  class_exists: Boolean
  index_lt: String
  starting_equipment: [StartingequipmentStarting_equipmentQueryInput]
  url: String
  url_gte: String
  index_gt: String
  index_nin: [String]
  starting_equipment_exists: Boolean
  _id_exists: Boolean
  starting_equipment_options_exists: Boolean
  url_nin: [String]
  starting_equipment_nin: [StartingequipmentStarting_equipmentQueryInput]
  starting_equipment_options_in: [StartingequipmentStarting_equipment_optionQueryInput]
  index_lte: String
  starting_equipment_options_nin: [StartingequipmentStarting_equipment_optionQueryInput]
  url_in: [String]
  OR: [StartingequipmentQueryInput!]
  index_exists: Boolean
  url_lt: String
  index_in: [String]
}

enum StartingequipmentSortByInput {
  URL_DESC
  _ID_ASC
  _ID_DESC
  INDEX_ASC
  INDEX_DESC
  URL_ASC
}

type StartingequipmentStarting_equipment {
  equipment: StartingequipmentStarting_equipmentEquipment
  quantity: Int
}

type StartingequipmentStarting_equipment_option {
  choose: Int
  from: [StartingequipmentStarting_equipment_optionFrom]
  type: String
}

type StartingequipmentStarting_equipment_optionFrom {
  equipment: StartingequipmentStarting_equipment_optionFromEquipment
  quantity: Int
}

type StartingequipmentStarting_equipment_optionFromEquipment {
  index: String
  name: String
  url: String
}

input StartingequipmentStarting_equipment_optionFromEquipmentQueryInput {
  url_exists: Boolean
  index_ne: String
  index_gte: String
  url_gte: String
  index_lte: String
  url_ne: String
  name_lte: String
  name_nin: [String]
  url_lte: String
  index_nin: [String]
  url: String
  index_gt: String
  url_lt: String
  name_ne: String
  name_gte: String
  index_in: [String]
  name_in: [String]
  OR: [StartingequipmentStarting_equipment_optionFromEquipmentQueryInput!]
  url_gt: String
  index_exists: Boolean
  index_lt: String
  name_exists: Boolean
  url_nin: [String]
  index: String
  url_in: [String]
  name_lt: String
  name: String
  AND: [StartingequipmentStarting_equipment_optionFromEquipmentQueryInput!]
  name_gt: String
}

input StartingequipmentStarting_equipment_optionFromQueryInput {
  quantity_lte: Int
  quantity_gt: Int
  quantity_gte: Int
  AND: [StartingequipmentStarting_equipment_optionFromQueryInput!]
  OR: [StartingequipmentStarting_equipment_optionFromQueryInput!]
  quantity: Int
  equipment_exists: Boolean
  equipment: StartingequipmentStarting_equipment_optionFromEquipmentQueryInput
  quantity_ne: Int
  quantity_lt: Int
  quantity_in: [Int]
  quantity_nin: [Int]
  quantity_exists: Boolean
}

input StartingequipmentStarting_equipment_optionQueryInput {
  choose_gt: Int
  type_lte: String
  choose_in: [Int]
  choose_ne: Int
  type_in: [String]
  choose_gte: Int
  type_gt: String
  type_exists: Boolean
  choose: Int
  from: [StartingequipmentStarting_equipment_optionFromQueryInput]
  from_nin: [StartingequipmentStarting_equipment_optionFromQueryInput]
  from_in: [StartingequipmentStarting_equipment_optionFromQueryInput]
  type_gte: String
  type_lt: String
  AND: [StartingequipmentStarting_equipment_optionQueryInput!]
  choose_exists: Boolean
  from_exists: Boolean
  choose_lte: Int
  type_ne: String
  choose_lt: Int
  type: String
  OR: [StartingequipmentStarting_equipment_optionQueryInput!]
  type_nin: [String]
  choose_nin: [Int]
}

type StartingequipmentStarting_equipmentEquipment {
  index: String
  name: String
  url: String
}

input StartingequipmentStarting_equipmentEquipmentQueryInput {
  url_lte: String
  name_gt: String
  AND: [StartingequipmentStarting_equipmentEquipmentQueryInput!]
  index_gte: String
  name: String
  url_nin: [String]
  url_lt: String
  url: String
  index_gt: String
  name_nin: [String]
  index_in: [String]
  url_in: [String]
  name_ne: String
  name_lt: String
  url_exists: Boolean
  index: String
  url_gt: String
  index_lte: String
  url_ne: String
  OR: [StartingequipmentStarting_equipmentEquipmentQueryInput!]
  name_exists: Boolean
  index_exists: Boolean
  url_gte: String
  index_lt: String
  name_gte: String
  name_lte: String
  index_ne: String
  name_in: [String]
  index_nin: [String]
}

input StartingequipmentStarting_equipmentQueryInput {
  quantity: Int
  quantity_lte: Int
  quantity_nin: [Int]
  AND: [StartingequipmentStarting_equipmentQueryInput!]
  equipment_exists: Boolean
  quantity_lt: Int
  quantity_exists: Boolean
  quantity_ne: Int
  quantity_gte: Int
  quantity_in: [Int]
  quantity_gt: Int
  OR: [StartingequipmentStarting_equipmentQueryInput!]
  equipment: StartingequipmentStarting_equipmentEquipmentQueryInput
}
`;

const resolvers = {
  Query: {
    startingequipment: async (_, { query }) => {
      return await Startingequipment.findOne(query).exec();
    },
    startingequipments: async (_, { query, sortBy }) => {
      return await Startingequipment.find(query)
        .sort(sortBy)
        .exec();
    }
  }
};

module.exports = {
  typeDef,
  resolvers
};
