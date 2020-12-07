const Equipment = require('../models/equipment');

const typeDef = `
extend type Query {
  equipment(query: EquipmentQueryInput): Equipment
  equipments(query: EquipmentQueryInput, sortBy: EquipmentSortByInput): [Equipment]!
}

type Equipment {
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
  two_handed_damage: EquipmentTwo_handed_damage
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
  AND: [EquipmentArmor_classQueryInput!]
  base_exists: Boolean
  base_gt: Int
  base_gte: Int
  base_in: [Int]
  base_lt: Int
  base_lte: Int
  base_ne: Int
  base_nin: [Int]
  base: Int
  dex_bonus_exists: Boolean
  dex_bonus_ne: Boolean
  dex_bonus: Boolean
  max_bonus_exists: Boolean
  max_bonus_gt: Int
  max_bonus_gte: Int
  max_bonus_in: [Int]
  max_bonus_lt: Int
  max_bonus_lte: Int
  max_bonus_ne: Int
  max_bonus_nin: [Int]
  max_bonus: Int
  OR: [EquipmentArmor_classQueryInput!]
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
  AND: [EquipmentContentItemQueryInput!]
  index_exists: Boolean
  index_gt: String
  index_gte: String
  index_in: [String]
  index_lt: String
  index_lte: String
  index_ne: String
  index_nin: [String]
  index: String
  name_exists: Boolean
  name_gt: String
  name_gte: String
  name_in: [String]
  name_lt: String
  name_lte: String
  name_ne: String
  name_nin: [String]
  name: String
  OR: [EquipmentContentItemQueryInput!]
  url_exists: Boolean
  url_gt: String
  url_gte: String
  url_in: [String]
  url_lt: String
  url_lte: String
  url_ne: String
  url_nin: [String]
  url: String
}

input EquipmentContentQueryInput {
  AND: [EquipmentContentQueryInput!]
  item_exists: Boolean
  item: EquipmentContentItemQueryInput
  OR: [EquipmentContentQueryInput!]
  quantity_exists: Boolean
  quantity_gt: Int
  quantity_gte: Int
  quantity_in: [Int]
  quantity_lt: Int
  quantity_lte: Int
  quantity_ne: Int
  quantity_nin: [Int]
  quantity: Int
}

type EquipmentCost {
  quantity: Int
  unit: String
}

input EquipmentCostQueryInput {
  AND: [EquipmentCostQueryInput!]
  OR: [EquipmentCostQueryInput!]
  quantity_exists: Boolean
  quantity_gt: Int
  quantity_gte: Int
  quantity_in: [Int]
  quantity_lt: Int
  quantity_lte: Int
  quantity_ne: Int
  quantity_nin: [Int]
  quantity: Int
  unit_exists: Boolean
  unit_gt: String
  unit_gte: String
  unit_in: [String]
  unit_lt: String
  unit_lte: String
  unit_ne: String
  unit_nin: [String]
  unit: String
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
  AND: [EquipmentDamageDamage_typeQueryInput!]
  index_exists: Boolean
  index_gt: String
  index_gte: String
  index_in: [String]
  index_lt: String
  index_lte: String
  index_ne: String
  index_nin: [String]
  index: String
  name_exists: Boolean
  name_gt: String
  name_gte: String
  name_in: [String]
  name_lt: String
  name_lte: String
  name_ne: String
  name_nin: [String]
  name: String
  OR: [EquipmentDamageDamage_typeQueryInput!]
  url_exists: Boolean
  url_gt: String
  url_gte: String
  url_in: [String]
  url_lt: String
  url_lte: String
  url_ne: String
  url_nin: [String]
  url: String
}

input EquipmentDamageQueryInput {
  AND: [EquipmentDamageQueryInput!]
  damage_dice_exists: Boolean
  damage_dice_gt: String
  damage_dice_gte: String
  damage_dice_in: [String]
  damage_dice_lt: String
  damage_dice_lte: String
  damage_dice_ne: String
  damage_dice_nin: [String]
  damage_dice: String
  damage_type_exists: Boolean
  damage_type: EquipmentDamageDamage_typeQueryInput
  OR: [EquipmentDamageQueryInput!]
}

type EquipmentEquipment_category {
  index: String
  name: String
  url: String
}

input EquipmentEquipment_categoryQueryInput {
  AND: [EquipmentEquipment_categoryQueryInput!]
  index_exists: Boolean
  index_gt: String
  index_gte: String
  index_in: [String]
  index_lt: String
  index_lte: String
  index_ne: String
  index_nin: [String]
  index: String
  name_exists: Boolean
  name_gt: String
  name_gte: String
  name_in: [String]
  name_lt: String
  name_lte: String
  name_ne: String
  name_nin: [String]
  name: String
  OR: [EquipmentEquipment_categoryQueryInput!]
  url_exists: Boolean
  url_gt: String
  url_gte: String
  url_in: [String]
  url_lt: String
  url_lte: String
  url_ne: String
  url_nin: [String]
  url: String
}

type EquipmentGear_category {
  index: String
  name: String
  url: String
}

input EquipmentGear_categoryQueryInput {
  AND: [EquipmentGear_categoryQueryInput!]
  index_exists: Boolean
  index_gt: String
  index_gte: String
  index_in: [String]
  index_lt: String
  index_lte: String
  index_ne: String
  index_nin: [String]
  index: String
  name_exists: Boolean
  name_gt: String
  name_gte: String
  name_in: [String]
  name_lt: String
  name_lte: String
  name_ne: String
  name_nin: [String]
  name: String
  OR: [EquipmentGear_categoryQueryInput!]
  url_exists: Boolean
  url_gt: String
  url_gte: String
  url_in: [String]
  url_lt: String
  url_lte: String
  url_ne: String
  url_nin: [String]
  url: String
}

type EquipmentProperty {
  index: String
  name: String
  url: String
}

input EquipmentPropertyQueryInput {
  AND: [EquipmentPropertyQueryInput!]
  index_exists: Boolean
  index_gt: String
  index_gte: String
  index_in: [String]
  index_lt: String
  index_lte: String
  index_ne: String
  index_nin: [String]
  index: String
  name_exists: Boolean
  name_gt: String
  name_gte: String
  name_in: [String]
  name_lt: String
  name_lte: String
  name_ne: String
  name_nin: [String]
  name: String
  OR: [EquipmentPropertyQueryInput!]
  url_exists: Boolean
  url_gt: String
  url_gte: String
  url_in: [String]
  url_lt: String
  url_lte: String
  url_ne: String
  url_nin: [String]
  url: String
}

input EquipmentQueryInput {
  AND: [EquipmentQueryInput!]
  armor_category_exists: Boolean
  armor_category_gt: String
  armor_category_gte: String
  armor_category_in: [String]
  armor_category_lt: String
  armor_category_lte: String
  armor_category_ne: String
  armor_category_nin: [String]
  armor_category: String
  armor_class_exists: Boolean
  armor_class: EquipmentArmor_classQueryInput
  capacity_exists: Boolean
  capacity_gt: String
  capacity_gte: String
  capacity_in: [String]
  capacity_lt: String
  capacity_lte: String
  capacity_ne: String
  capacity_nin: [String]
  capacity: String
  category_range_exists: Boolean
  category_range_gt: String
  category_range_gte: String
  category_range_in: [String]
  category_range_lt: String
  category_range_lte: String
  category_range_ne: String
  category_range_nin: [String]
  category_range: String
  contents_exists: Boolean
  contents_in: [EquipmentContentQueryInput]
  contents_nin: [EquipmentContentQueryInput]
  contents: [EquipmentContentQueryInput]
  cost_exists: Boolean
  cost: EquipmentCostQueryInput
  damage_exists: Boolean
  damage: EquipmentDamageQueryInput
  desc_exists: Boolean
  desc_in: [String]
  desc_nin: [String]
  desc: [String]
  equipment_category_exists: Boolean
  equipment_category: EquipmentEquipment_categoryQueryInput
  gear_category_exists: Boolean
  gear_category: EquipmentGear_categoryQueryInput
  index_exists: Boolean
  index_gt: String
  index_gte: String
  index_in: [String]
  index_lt: String
  index_lte: String
  index_ne: String
  index_nin: [String]
  index: String
  name_exists: Boolean
  name_gt: String
  name_gte: String
  name_in: [String]
  name_lt: String
  name_lte: String
  name_ne: String
  name_nin: [String]
  name: String
  OR: [EquipmentQueryInput!]
  properties_exists: Boolean
  properties_in: [EquipmentPropertyQueryInput]
  properties_nin: [EquipmentPropertyQueryInput]
  properties: [EquipmentPropertyQueryInput]
  quantity_exists: Boolean
  quantity_gt: Int
  quantity_gte: Int
  quantity_in: [Int]
  quantity_lt: Int
  quantity_lte: Int
  quantity_ne: Int
  quantity_nin: [Int]
  quantity: Int
  range_exists: Boolean
  range: EquipmentRangeQueryInput
  special_exists: Boolean
  special_in: [String]
  special_nin: [String]
  special: [String]
  speed_exists: Boolean
  speed: EquipmentSpeedQueryInput
  stealth_disadvantage_exists: Boolean
  stealth_disadvantage_ne: Boolean
  stealth_disadvantage: Boolean
  str_minimum_exists: Boolean
  str_minimum_gt: Int
  str_minimum_gte: Int
  str_minimum_in: [Int]
  str_minimum_lt: Int
  str_minimum_lte: Int
  str_minimum_ne: Int
  str_minimum_nin: [Int]
  str_minimum: Int
  throw_range_exists: Boolean
  throw_range: EquipmentThrow_rangeQueryInput
  tool_category_exists: Boolean
  tool_category_gt: String
  tool_category_gte: String
  tool_category_in: [String]
  tool_category_lt: String
  tool_category_lte: String
  tool_category_ne: String
  tool_category_nin: [String]
  tool_category: String
  two_handed_damage_exists: Boolean
  two_handed_damage: EquipmentTwo_handed_damageQueryInput
  url_exists: Boolean
  url_gt: String
  url_gte: String
  url_in: [String]
  url_lt: String
  url_lte: String
  url_ne: String
  url_nin: [String]
  url: String
  vehicle_category_exists: Boolean
  vehicle_category_gt: String
  vehicle_category_gte: String
  vehicle_category_in: [String]
  vehicle_category_lt: String
  vehicle_category_lte: String
  vehicle_category_ne: String
  vehicle_category_nin: [String]
  vehicle_category: String
  weapon_category_exists: Boolean
  weapon_category_gt: String
  weapon_category_gte: String
  weapon_category_in: [String]
  weapon_category_lt: String
  weapon_category_lte: String
  weapon_category_ne: String
  weapon_category_nin: [String]
  weapon_category: String
  weapon_range_exists: Boolean
  weapon_range_gt: String
  weapon_range_gte: String
  weapon_range_in: [String]
  weapon_range_lt: String
  weapon_range_lte: String
  weapon_range_ne: String
  weapon_range_nin: [String]
  weapon_range: String
  weight_exists: Boolean
  weight_gt: Int
  weight_gte: Int
  weight_in: [Int]
  weight_lt: Int
  weight_lte: Int
  weight_ne: Int
  weight_nin: [Int]
  weight: Int
}

type EquipmentRange {
  long: Int
  normal: Int
}

input EquipmentRangeQueryInput {
  AND: [EquipmentRangeQueryInput!]
  long_exists: Boolean
  long_gt: Int
  long_gte: Int
  long_in: [Int]
  long_lt: Int
  long_lte: Int
  long_ne: Int
  long_nin: [Int]
  long: Int
  normal_exists: Boolean
  normal_gt: Int
  normal_gte: Int
  normal_in: [Int]
  normal_lt: Int
  normal_lte: Int
  normal_ne: Int
  normal_nin: [Int]
  normal: Int
  OR: [EquipmentRangeQueryInput!]
}

enum EquipmentSortByInput {
  ARMOR_CATEGORY_ASC
  ARMOR_CATEGORY_DESC
  CAPACITY_ASC
  CAPACITY_DESC
  CATEGORY_RANGE_ASC
  CATEGORY_RANGE_DESC
  INDEX_ASC
  INDEX_DESC
  NAME_ASC
  NAME_DESC
  QUANTITY_ASC
  QUANTITY_DESC
  STR_MINIMUM_ASC
  STR_MINIMUM_DESC
  TOOL_CATEGORY_ASC
  TOOL_CATEGORY_DESC
  URL_ASC
  URL_DESC
  VEHICLE_CATEGORY_ASC
  VEHICLE_CATEGORY_DESC
  WEAPON_CATEGORY_ASC
  WEAPON_CATEGORY_DESC
  WEAPON_RANGE_ASC
  WEAPON_RANGE_DESC
  WEIGHT_ASC
  WEIGHT_DESC
}

type EquipmentSpeed {
  quantity: Int
  unit: String
}

input EquipmentSpeedQueryInput {
  AND: [EquipmentSpeedQueryInput!]
  OR: [EquipmentSpeedQueryInput!]
  quantity_exists: Boolean
  quantity_gt: Int
  quantity_gte: Int
  quantity_in: [Int]
  quantity_lt: Int
  quantity_lte: Int
  quantity_ne: Int
  quantity_nin: [Int]
  quantity: Int
  unit_exists: Boolean
  unit_gt: String
  unit_gte: String
  unit_in: [String]
  unit_lt: String
  unit_lte: String
  unit_ne: String
  unit_nin: [String]
  unit: String
}

type EquipmentThrow_range {
  long: Int
  normal: Int
}

input EquipmentThrow_rangeQueryInput {
  AND: [EquipmentThrow_rangeQueryInput!]
  long_exists: Boolean
  long_gt: Int
  long_gte: Int
  long_in: [Int]
  long_lt: Int
  long_lte: Int
  long_ne: Int
  long_nin: [Int]
  long: Int
  normal_exists: Boolean
  normal_gt: Int
  normal_gte: Int
  normal_in: [Int]
  normal_lt: Int
  normal_lte: Int
  normal_ne: Int
  normal_nin: [Int]
  normal: Int
  OR: [EquipmentThrow_rangeQueryInput!]
}

type EquipmentTwo_handed_damage {
  damage_dice: String
  damage_type: EquipmentTwo_handed_damageDamage_type
}

type EquipmentTwo_handed_damageDamage_type {
  index: String
  name: String
  url: String
}

input EquipmentTwo_handed_damageDamage_typeQueryInput {
  AND: [EquipmentTwo_handed_damageDamage_typeQueryInput!]
  index_exists: Boolean
  index_gt: String
  index_gte: String
  index_in: [String]
  index_lt: String
  index_lte: String
  index_ne: String
  index_nin: [String]
  index: String
  name_exists: Boolean
  name_gt: String
  name_gte: String
  name_in: [String]
  name_lt: String
  name_lte: String
  name_ne: String
  name_nin: [String]
  name: String
  OR: [EquipmentTwo_handed_damageDamage_typeQueryInput!]
  url_exists: Boolean
  url_gt: String
  url_gte: String
  url_in: [String]
  url_lt: String
  url_lte: String
  url_ne: String
  url_nin: [String]
  url: String
}

input EquipmentTwo_handed_damageQueryInput {
  AND: [EquipmentTwo_handed_damageQueryInput!]
  damage_dice_exists: Boolean
  damage_dice_gt: String
  damage_dice_gte: String
  damage_dice_in: [String]
  damage_dice_lt: String
  damage_dice_lte: String
  damage_dice_ne: String
  damage_dice_nin: [String]
  damage_dice: String
  damage_type_exists: Boolean
  damage_type: EquipmentTwo_handed_damageDamage_typeQueryInput
  OR: [EquipmentTwo_handed_damageQueryInput!]
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
    },
  },
};

module.exports = {
  typeDef,
  resolvers,
};
