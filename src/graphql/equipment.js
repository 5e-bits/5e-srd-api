const Equipment = require('../models/equipment');

const typeDef = `
extend type Query {
  equipment(query: EquipmentQueryInput): Equipment
  equipments(query: EquipmentQueryInput, sortBy: EquipmentSortByInput): [Equipment]!
}

type Equipment {
  H_damage: EquipmentH_damage
  armor_category: String
  armor_class: EquipmentArmor_class
  capacity: String
  category_range: String
  contents: [EquipmentContent]
  cost: EquipmentCost
  damage: EquipmentDamage
  desc: [String]
  equipment_category: EquipmentEquipment_category
  gear_category: EquipmentGear_category
  index: String
  name: String
  properties: [EquipmentProperty]
  quantity: Int
  range: EquipmentRange
  special: [String]
  speed: EquipmentSpeed
  stealth_disadvantage: Boolean
  str_minimum: Int
  throw_range: EquipmentThrow_range
  tool_category: String
  url: String
  vehicle_category: String
  weapon_category: String
  weapon_range: String
  weight: Int
}

type EquipmentArmor_class {
  base: Int
  dex_bonus: Boolean
  max_bonus: Int
}

input EquipmentArmor_classQueryInput {
  base_ne: Int
  max_bonus_gte: Int
  dex_bonus_exists: Boolean
  max_bonus: Int
  base_exists: Boolean
  max_bonus_nin: [Int]
  max_bonus_ne: Int
  dex_bonus: Boolean
  max_bonus_gt: Int
  base_lt: Int
  OR: [EquipmentArmor_classQueryInput!]
  base_gte: Int
  AND: [EquipmentArmor_classQueryInput!]
  max_bonus_lt: Int
  base_gt: Int
  base_lte: Int
  base: Int
  base_in: [Int]
  max_bonus_lte: Int
  base_nin: [Int]
  max_bonus_in: [Int]
  max_bonus_exists: Boolean
  dex_bonus_ne: Boolean
}

type EquipmentContent {
  item: EquipmentContentItem
  quantity: Int
}

type EquipmentContentItem {
  index: String
  name: String
  url: String
}

input EquipmentContentItemQueryInput {
  url_lt: String
  OR: [EquipmentContentItemQueryInput!]
  name_lt: String
  index_gte: String
  name_gte: String
  AND: [EquipmentContentItemQueryInput!]
  index_ne: String
  index_nin: [String]
  name_lte: String
  index_in: [String]
  url_nin: [String]
  url_exists: Boolean
  url_lte: String
  url_gt: String
  name_nin: [String]
  url: String
  url_ne: String
  index_lt: String
  name_ne: String
  index_exists: Boolean
  index_gt: String
  name_in: [String]
  index: String
  name: String
  url_in: [String]
  index_lte: String
  name_gt: String
  url_gte: String
  name_exists: Boolean
}

input EquipmentContentQueryInput {
  quantity: Int
  quantity_gte: Int
  item: EquipmentContentItemQueryInput
  quantity_ne: Int
  quantity_gt: Int
  quantity_in: [Int]
  quantity_exists: Boolean
  OR: [EquipmentContentQueryInput!]
  quantity_lt: Int
  AND: [EquipmentContentQueryInput!]
  quantity_lte: Int
  quantity_nin: [Int]
  item_exists: Boolean
}

type EquipmentCost {
  quantity: Int
  unit: String
}

input EquipmentCostQueryInput {
  quantity_nin: [Int]
  unit_in: [String]
  AND: [EquipmentCostQueryInput!]
  unit_lte: String
  quantity_exists: Boolean
  quantity_gte: Int
  unit_exists: Boolean
  quantity_lt: Int
  unit_gte: String
  quantity_gt: Int
  unit_ne: String
  quantity_lte: Int
  unit: String
  unit_lt: String
  unit_nin: [String]
  quantity_ne: Int
  quantity_in: [Int]
  unit_gt: String
  quantity: Int
  OR: [EquipmentCostQueryInput!]
}

type EquipmentDamage {
  damage_dice: String
  damage_type: EquipmentDamageDamage_type
}

type EquipmentDamageDamage_type {
  index: String
  name: String
  url: String
}

input EquipmentDamageDamage_typeQueryInput {
  index_nin: [String]
  name_lt: String
  index_lt: String
  name_nin: [String]
  url_gte: String
  url_exists: Boolean
  url_lt: String
  OR: [EquipmentDamageDamage_typeQueryInput!]
  name_lte: String
  url_in: [String]
  name_gte: String
  url_gt: String
  name_gt: String
  index_ne: String
  AND: [EquipmentDamageDamage_typeQueryInput!]
  name: String
  index_gt: String
  name_ne: String
  index_gte: String
  index_exists: Boolean
  index_lte: String
  url_nin: [String]
  name_exists: Boolean
  url_ne: String
  index: String
  url_lte: String
  name_in: [String]
  index_in: [String]
  url: String
}

input EquipmentDamageQueryInput {
  damage_dice_lte: String
  damage_type: EquipmentDamageDamage_typeQueryInput
  damage_dice_ne: String
  damage_dice_in: [String]
  OR: [EquipmentDamageQueryInput!]
  damage_dice: String
  damage_type_exists: Boolean
  AND: [EquipmentDamageQueryInput!]
  damage_dice_gte: String
  damage_dice_gt: String
  damage_dice_lt: String
  damage_dice_nin: [String]
  damage_dice_exists: Boolean
}

type EquipmentEquipment_category {
  index: String
  name: String
  url: String
}

input EquipmentEquipment_categoryQueryInput {
  name_nin: [String]
  index_lte: String
  index_ne: String
  name_lt: String
  index_gte: String
  url_in: [String]
  index_lt: String
  index_gt: String
  url_nin: [String]
  name_gt: String
  url_lte: String
  index_in: [String]
  name_ne: String
  url_gte: String
  url_ne: String
  index_exists: Boolean
  index_nin: [String]
  url_exists: Boolean
  index: String
  name: String
  url_gt: String
  name_in: [String]
  AND: [EquipmentEquipment_categoryQueryInput!]
  name_exists: Boolean
  name_gte: String
  url_lt: String
  name_lte: String
  url: String
  OR: [EquipmentEquipment_categoryQueryInput!]
}

type EquipmentGear_category {
  index: String
  name: String
  url: String
}

input EquipmentGear_categoryQueryInput {
  url_in: [String]
  url_lte: String
  url_gt: String
  index_lte: String
  index_nin: [String]
  name: String
  url_gte: String
  OR: [EquipmentGear_categoryQueryInput!]
  name_gt: String
  url_lt: String
  index_ne: String
  index_lt: String
  name_ne: String
  name_exists: Boolean
  url_ne: String
  index_gte: String
  name_lte: String
  url_nin: [String]
  index_gt: String
  url_exists: Boolean
  index_in: [String]
  index_exists: Boolean
  index: String
  name_gte: String
  url: String
  name_nin: [String]
  name_in: [String]
  name_lt: String
  AND: [EquipmentGear_categoryQueryInput!]
}

type EquipmentH_damage {
  damage_dice: String
  damage_type: EquipmentH_damageDamage_type
}

type EquipmentH_damageDamage_type {
  index: String
  name: String
  url: String
}

input EquipmentH_damageDamage_typeQueryInput {
  index: String
  url_lt: String
  OR: [EquipmentH_damageDamage_typeQueryInput!]
  name_gte: String
  name_lt: String
  index_ne: String
  url_in: [String]
  name_in: [String]
  index_nin: [String]
  name_nin: [String]
  url_gte: String
  url_lte: String
  index_gt: String
  index_gte: String
  name_lte: String
  index_in: [String]
  url_gt: String
  AND: [EquipmentH_damageDamage_typeQueryInput!]
  url_nin: [String]
  index_exists: Boolean
  index_lt: String
  index_lte: String
  url: String
  name_ne: String
  url_ne: String
  name_exists: Boolean
  url_exists: Boolean
  name_gt: String
  name: String
}

input EquipmentH_damageQueryInput {
  damage_type: EquipmentH_damageDamage_typeQueryInput
  damage_dice: String
  damage_dice_exists: Boolean
  damage_dice_ne: String
  damage_dice_gt: String
  damage_dice_lt: String
  damage_type_exists: Boolean
  damage_dice_in: [String]
  damage_dice_gte: String
  AND: [EquipmentH_damageQueryInput!]
  damage_dice_lte: String
  damage_dice_nin: [String]
  OR: [EquipmentH_damageQueryInput!]
}

type EquipmentProperty {
  index: String
  name: String
  url: String
}

input EquipmentPropertyQueryInput {
  index: String
  url_ne: String
  url_nin: [String]
  name_lt: String
  url_lte: String
  name_lte: String
  name: String
  index_lte: String
  index_gt: String
  name_ne: String
  name_exists: Boolean
  name_in: [String]
  url_exists: Boolean
  url_in: [String]
  index_in: [String]
  index_exists: Boolean
  AND: [EquipmentPropertyQueryInput!]
  name_gt: String
  index_ne: String
  url: String
  OR: [EquipmentPropertyQueryInput!]
  index_lt: String
  index_nin: [String]
  url_gt: String
  name_gte: String
  url_gte: String
  url_lt: String
  index_gte: String
  name_nin: [String]
}

input EquipmentQueryInput {
  cost: EquipmentCostQueryInput
  category_range: String
  name_lte: String
  contents_exists: Boolean
  url_nin: [String]
  vehicle_category_exists: Boolean
  H_damage_exists: Boolean
  weapon_category_nin: [String]
  properties: [EquipmentPropertyQueryInput]
  name_gt: String
  armor_class: EquipmentArmor_classQueryInput
  str_minimum_gte: Int
  str_minimum_lt: Int
  throw_range_exists: Boolean
  weapon_range_gt: String
  name_gte: String
  capacity_gt: String
  capacity_nin: [String]
  speed: EquipmentSpeedQueryInput
  index_gte: String
  vehicle_category_nin: [String]
  special_in: [String]
  category_range_lt: String
  armor_class_exists: Boolean
  H_damage: EquipmentH_damageQueryInput
  range_exists: Boolean
  armor_category: String
  capacity_ne: String
  armor_category_ne: String
  tool_category_lte: String
  weight_nin: [Int]
  quantity_gte: Int
  stealth_disadvantage_ne: Boolean
  str_minimum_in: [Int]
  str_minimum_gt: Int
  properties_in: [EquipmentPropertyQueryInput]
  contents_in: [EquipmentContentQueryInput]
  tool_category_in: [String]
  weapon_range_ne: String
  stealth_disadvantage: Boolean
  vehicle_category_lte: String
  capacity_lte: String
  tool_category_exists: Boolean
  weapon_category_lt: String
  weapon_range_lte: String
  _id_exists: Boolean
  OR: [EquipmentQueryInput!]
  damage: EquipmentDamageQueryInput
  index_nin: [String]
  category_range_in: [String]
  name_ne: String
  category_range_exists: Boolean
  category_range_nin: [String]
  properties_exists: Boolean
  weight_lte: Int
  quantity_exists: Boolean
  weapon_category: String
  category_range_lte: String
  category_range_gte: String
  name_lt: String
  vehicle_category_lt: String
  quantity_lte: Int
  armor_category_lt: String
  index_lt: String
  speed_exists: Boolean
  category_range_gt: String
  url_in: [String]
  quantity_ne: Int
  damage_exists: Boolean
  armor_category_exists: Boolean
  tool_category_gt: String
  weapon_category_ne: String
  desc: [String]
  weapon_category_in: [String]
  weight_gte: Int
  weapon_category_gte: String
  str_minimum_nin: [Int]
  index_exists: Boolean
  special: [String]
  armor_category_nin: [String]
  special_exists: Boolean
  throw_range: EquipmentThrow_rangeQueryInput
  tool_category_ne: String
  desc_exists: Boolean
  vehicle_category_gte: String
  properties_nin: [EquipmentPropertyQueryInput]
  url_ne: String
  weapon_range_gte: String
  str_minimum_ne: Int
  equipment_category_exists: Boolean
  weight_exists: Boolean
  desc_in: [String]
  tool_category_lt: String
  str_minimum_exists: Boolean
  cost_exists: Boolean
  str_minimum: Int
  special_nin: [String]
  weapon_category_lte: String
  gear_category_exists: Boolean
  url_lt: String
  weight_in: [Int]
  armor_category_gte: String
  armor_category_in: [String]
  index: String
  weapon_category_gt: String
  range: EquipmentRangeQueryInput
  contents: [EquipmentContentQueryInput]
  quantity_lt: Int
  tool_category: String
  stealth_disadvantage_exists: Boolean
  url: String
  name_exists: Boolean
  name: String
  armor_category_gt: String
  quantity: Int
  index_gt: String
  vehicle_category_ne: String
  weapon_range_nin: [String]
  index_ne: String
  capacity_in: [String]
  weapon_range_in: [String]
  equipment_category: EquipmentEquipment_categoryQueryInput
  capacity_gte: String
  url_gt: String
  name_in: [String]
  quantity_in: [Int]
  capacity: String
  quantity_gt: Int
  str_minimum_lte: Int
  weapon_range: String
  weapon_range_lt: String
  url_exists: Boolean
  url_gte: String
  capacity_exists: Boolean
  armor_category_lte: String
  weight_ne: Int
  weight: Int
  weapon_range_exists: Boolean
  weight_lt: Int
  category_range_ne: String
  name_nin: [String]
  tool_category_gte: String
  vehicle_category_in: [String]
  AND: [EquipmentQueryInput!]
  capacity_lt: String
  url_lte: String
  index_in: [String]
  contents_nin: [EquipmentContentQueryInput]
  desc_nin: [String]
  vehicle_category_gt: String
  vehicle_category: String
  weight_gt: Int
  gear_category: EquipmentGear_categoryQueryInput
  index_lte: String
  weapon_category_exists: Boolean
  quantity_nin: [Int]
  tool_category_nin: [String]
}

type EquipmentRange {
  long: Int
  normal: Int
}

input EquipmentRangeQueryInput {
  normal_nin: [Int]
  normal_ne: Int
  normal_gte: Int
  long_in: [Int]
  normal_exists: Boolean
  long_nin: [Int]
  normal_gt: Int
  normal_lt: Int
  long_lte: Int
  normal_lte: Int
  long: Int
  long_gt: Int
  long_lt: Int
  AND: [EquipmentRangeQueryInput!]
  normal_in: [Int]
  long_gte: Int
  long_exists: Boolean
  long_ne: Int
  OR: [EquipmentRangeQueryInput!]
  normal: Int
}

enum EquipmentSortByInput {
  NAME_DESC
  WEAPON_CATEGORY_DESC
  WEIGHT_DESC
  _ID_ASC
  _ID_DESC
  STR_MINIMUM_ASC
  CAPACITY_ASC
  WEAPON_CATEGORY_ASC
  VEHICLE_CATEGORY_ASC
  TOOL_CATEGORY_DESC
  VEHICLE_CATEGORY_DESC
  CATEGORY_RANGE_ASC
  INDEX_DESC
  CAPACITY_DESC
  QUANTITY_ASC
  URL_DESC
  ARMOR_CATEGORY_DESC
  CATEGORY_RANGE_DESC
  TOOL_CATEGORY_ASC
  NAME_ASC
  STR_MINIMUM_DESC
  URL_ASC
  INDEX_ASC
  QUANTITY_DESC
  WEIGHT_ASC
  WEAPON_RANGE_DESC
  ARMOR_CATEGORY_ASC
  WEAPON_RANGE_ASC
}

type EquipmentSpeed {
  quantity: Int
  unit: String
}

input EquipmentSpeedQueryInput {
  unit_lte: String
  quantity_nin: [Int]
  quantity_exists: Boolean
  unit_nin: [String]
  unit_ne: String
  quantity_gte: Int
  quantity_ne: Int
  quantity_lt: Int
  quantity_in: [Int]
  unit_in: [String]
  AND: [EquipmentSpeedQueryInput!]
  quantity: Int
  quantity_gt: Int
  unit_gt: String
  unit_exists: Boolean
  unit: String
  unit_lt: String
  unit_gte: String
  OR: [EquipmentSpeedQueryInput!]
  quantity_lte: Int
}

type EquipmentThrow_range {
  long: Int
  normal: Int
}

input EquipmentThrow_rangeQueryInput {
  normal_gt: Int
  long_exists: Boolean
  long_in: [Int]
  long_gt: Int
  long_ne: Int
  long_lte: Int
  normal: Int
  normal_in: [Int]
  normal_lt: Int
  long_lt: Int
  normal_lte: Int
  long_gte: Int
  normal_exists: Boolean
  AND: [EquipmentThrow_rangeQueryInput!]
  OR: [EquipmentThrow_rangeQueryInput!]
  long: Int
  normal_gte: Int
  long_nin: [Int]
  normal_ne: Int
  normal_nin: [Int]
}
`;

const resolvers = {
  Query: {
    equipment: async (_, { query }) => {
      return await Equipment.findOne(query).exec();
    },
    equipments: async (_, { query, sortBy }) => {
      return await Equipment.find(query)
        .sort(sortBy)
        .exec();
    }
  }
};

module.exports = {
  typeDef,
  resolvers
};
