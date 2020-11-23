// TODO: Break this schema up.
const typeDefs = `
type AbilityScore {
  _id: ObjectId
  desc: [String]
  full_name: String
  index: String
  name: String
  skills: [AbilityScoreSkill]
  url: String
}

input AbilityScoreQueryInput {
  _id_lte: ObjectId
  name_gt: String
  _id_gte: ObjectId
  full_name_ne: String
  full_name_lte: String
  name: String
  name_lt: String
  skills_nin: [AbilityScoreSkillQueryInput]
  full_name: String
  name_exists: Boolean
  full_name_gt: String
  skills_exists: Boolean
  full_name_exists: Boolean
  _id_ne: ObjectId
  index_gt: String
  url_exists: Boolean
  index_exists: Boolean
  skills_in: [AbilityScoreSkillQueryInput]
  index_nin: [String]
  _id_gt: ObjectId
  url: String
  url_in: [String]
  _id_nin: [ObjectId]
  url_lte: String
  url_nin: [String]
  index_in: [String]
  name_ne: String
  index_gte: String
  _id_in: [ObjectId]
  index_lt: String
  full_name_gte: String
  skills: [AbilityScoreSkillQueryInput]
  OR: [AbilityScoreQueryInput!]
  desc_nin: [String]
  name_gte: String
  desc_in: [String]
  url_gte: String
  full_name_lt: String
  AND: [AbilityScoreQueryInput!]
  name_in: [String]
  full_name_nin: [String]
  name_nin: [String]
  _id_lt: ObjectId
  _id_exists: Boolean
  index_lte: String
  url_lt: String
  index_ne: String
  _id: ObjectId
  url_ne: String
  name_lte: String
  desc_exists: Boolean
  index: String
  full_name_in: [String]
  desc: [String]
  url_gt: String
}

type AbilityScoreSkill {
  index: String
  name: String
  url: String
}

input AbilityScoreSkillQueryInput {
  url_nin: [String]
  url_in: [String]
  index_lt: String
  url_gte: String
  index_in: [String]
  url_ne: String
  index: String
  url_exists: Boolean
  index_lte: String
  index_ne: String
  name: String
  name_lte: String
  name_exists: Boolean
  name_in: [String]
  index_gt: String
  name_lt: String
  AND: [AbilityScoreSkillQueryInput!]
  name_ne: String
  url_lte: String
  index_exists: Boolean
  OR: [AbilityScoreSkillQueryInput!]
  index_gte: String
  name_nin: [String]
  index_nin: [String]
  name_gt: String
  url_lt: String
  url: String
  url_gt: String
  name_gte: String
}

enum AbilityScoreSortByInput {
  FULL_NAME_ASC
  FULL_NAME_DESC
  INDEX_ASC
  INDEX_DESC
  URL_ASC
  _ID_ASC
  NAME_ASC
  NAME_DESC
  URL_DESC
  _ID_DESC
}

type Class {
  _id: ObjectId
  class_levels: String
  hit_die: Int
  index: String
  name: String
  proficiencies: [ClassProficiency]
  proficiency_choices: [ClassProficiency_choice]
  saving_throws: [ClassSaving_throw]
  spellcasting: ClassSpellcasting
  spells: String
  starting_equipment: String
  subclasses: [ClassSubclass]
  url: String
}

type ClassProficiency {
  index: String
  name: String
  url: String
}

type ClassProficiency_choice {
  choose: Int
  from: [ClassProficiency_choiceFrom]
  type: String
}

type ClassProficiency_choiceFrom {
  index: String
  name: String
  url: String
}

input ClassProficiency_choiceFromQueryInput {
  name_ne: String
  index_lte: String
  name_lte: String
  index_gte: String
  name_lt: String
  url: String
  url_ne: String
  index_exists: Boolean
  index_gt: String
  url_lt: String
  index_nin: [String]
  name_gt: String
  url_gte: String
  url_exists: Boolean
  url_nin: [String]
  index: String
  url_gt: String
  AND: [ClassProficiency_choiceFromQueryInput!]
  url_in: [String]
  name_gte: String
  index_ne: String
  index_lt: String
  OR: [ClassProficiency_choiceFromQueryInput!]
  name: String
  url_lte: String
  name_exists: Boolean
  index_in: [String]
  name_nin: [String]
  name_in: [String]
}

input ClassProficiency_choiceQueryInput {
  type: String
  type_nin: [String]
  choose_in: [Int]
  choose_gte: Int
  AND: [ClassProficiency_choiceQueryInput!]
  from: [ClassProficiency_choiceFromQueryInput]
  type_exists: Boolean
  choose_exists: Boolean
  type_lt: String
  type_lte: String
  choose: Int
  choose_lte: Int
  from_in: [ClassProficiency_choiceFromQueryInput]
  OR: [ClassProficiency_choiceQueryInput!]
  choose_nin: [Int]
  from_nin: [ClassProficiency_choiceFromQueryInput]
  choose_lt: Int
  type_gte: String
  type_ne: String
  from_exists: Boolean
  choose_ne: Int
  choose_gt: Int
  type_in: [String]
  type_gt: String
}

input ClassProficiencyQueryInput {
  url_lt: String
  OR: [ClassProficiencyQueryInput!]
  index_gte: String
  url_gt: String
  index_nin: [String]
  index_gt: String
  name_nin: [String]
  index_exists: Boolean
  url_nin: [String]
  index_lte: String
  name_ne: String
  name_gte: String
  url_gte: String
  AND: [ClassProficiencyQueryInput!]
  name_lt: String
  index_in: [String]
  name_gt: String
  index: String
  index_lt: String
  name: String
  url_ne: String
  url_in: [String]
  url_lte: String
  url: String
  name_exists: Boolean
  name_in: [String]
  name_lte: String
  index_ne: String
  url_exists: Boolean
}

input ClassQueryInput {
  class_levels_lte: String
  proficiency_choices_nin: [ClassProficiency_choiceQueryInput]
  index: String
  class_levels_in: [String]
  index_gt: String
  starting_equipment_lte: String
  url_lte: String
  OR: [ClassQueryInput!]
  starting_equipment_in: [String]
  _id_gt: ObjectId
  proficiencies_in: [ClassProficiencyQueryInput]
  proficiencies_nin: [ClassProficiencyQueryInput]
  name_exists: Boolean
  saving_throws_nin: [ClassSaving_throwQueryInput]
  spells_nin: [String]
  proficiency_choices: [ClassProficiency_choiceQueryInput]
  spells_in: [String]
  class_levels_nin: [String]
  starting_equipment_ne: String
  proficiencies_exists: Boolean
  AND: [ClassQueryInput!]
  name: String
  _id: ObjectId
  url_in: [String]
  url_lt: String
  class_levels_gt: String
  index_lte: String
  index_gte: String
  class_levels_exists: Boolean
  proficiencies: [ClassProficiencyQueryInput]
  _id_nin: [ObjectId]
  hit_die_nin: [Int]
  hit_die_in: [Int]
  starting_equipment_gt: String
  class_levels_ne: String
  _id_in: [ObjectId]
  spells_ne: String
  spells: String
  url_ne: String
  _id_lt: ObjectId
  saving_throws_exists: Boolean
  starting_equipment_lt: String
  name_gte: String
  starting_equipment_nin: [String]
  name_lt: String
  url_exists: Boolean
  hit_die: Int
  subclasses_nin: [ClassSubclassQueryInput]
  index_in: [String]
  spells_gt: String
  index_lt: String
  spells_gte: String
  spells_lt: String
  hit_die_ne: Int
  starting_equipment_exists: Boolean
  starting_equipment_gte: String
  url: String
  class_levels_lt: String
  name_nin: [String]
  index_exists: Boolean
  hit_die_gte: Int
  spellcasting_exists: Boolean
  class_levels_gte: String
  subclasses_in: [ClassSubclassQueryInput]
  subclasses: [ClassSubclassQueryInput]
  saving_throws: [ClassSaving_throwQueryInput]
  proficiency_choices_in: [ClassProficiency_choiceQueryInput]
  hit_die_lte: Int
  _id_lte: ObjectId
  name_ne: String
  saving_throws_in: [ClassSaving_throwQueryInput]
  name_lte: String
  url_nin: [String]
  url_gte: String
  index_nin: [String]
  name_in: [String]
  hit_die_lt: Int
  name_gt: String
  subclasses_exists: Boolean
  hit_die_gt: Int
  starting_equipment: String
  proficiency_choices_exists: Boolean
  _id_exists: Boolean
  class_levels: String
  spells_lte: String
  _id_gte: ObjectId
  index_ne: String
  url_gt: String
  hit_die_exists: Boolean
  spellcasting: ClassSpellcastingQueryInput
  spells_exists: Boolean
  _id_ne: ObjectId
}

type ClassSaving_throw {
  index: String
  name: String
  url: String
}

input ClassSaving_throwQueryInput {
  index_lt: String
  name_gte: String
  url: String
  index_nin: [String]
  index_gte: String
  url_ne: String
  name_exists: Boolean
  url_nin: [String]
  url_in: [String]
  url_gte: String
  name_lte: String
  name_nin: [String]
  index_lte: String
  index_ne: String
  index: String
  OR: [ClassSaving_throwQueryInput!]
  url_lte: String
  name_lt: String
  AND: [ClassSaving_throwQueryInput!]
  index_exists: Boolean
  name_in: [String]
  index_gt: String
  url_gt: String
  index_in: [String]
  url_lt: String
  name: String
  name_ne: String
  url_exists: Boolean
  name_gt: String
}

enum ClassSortByInput {
  SPELLS_DESC
  STARTING_EQUIPMENT_DESC
  NAME_DESC
  _ID_ASC
  HIT_DIE_ASC
  CLASS_LEVELS_DESC
  INDEX_ASC
  INDEX_DESC
  NAME_ASC
  URL_ASC
  URL_DESC
  CLASS_LEVELS_ASC
  _ID_DESC
  HIT_DIE_DESC
  SPELLS_ASC
  STARTING_EQUIPMENT_ASC
}

type ClassSpellcasting {
  info: [ClassSpellcastingInfo]
  level: Int
  spellcasting_ability: ClassSpellcastingSpellcasting_ability
}

type ClassSpellcastingInfo {
  desc: [String]
  name: String
}

input ClassSpellcastingInfoQueryInput {
  name_in: [String]
  OR: [ClassSpellcastingInfoQueryInput!]
  name_gt: String
  name_ne: String
  desc_in: [String]
  name_lt: String
  AND: [ClassSpellcastingInfoQueryInput!]
  name_gte: String
  name_lte: String
  desc: [String]
  name_exists: Boolean
  desc_exists: Boolean
  name: String
  desc_nin: [String]
  name_nin: [String]
}

input ClassSpellcastingQueryInput {
  info_exists: Boolean
  level_gt: Int
  AND: [ClassSpellcastingQueryInput!]
  level: Int
  level_in: [Int]
  spellcasting_ability_exists: Boolean
  level_lte: Int
  info_in: [ClassSpellcastingInfoQueryInput]
  spellcasting_ability: ClassSpellcastingSpellcasting_abilityQueryInput
  info: [ClassSpellcastingInfoQueryInput]
  level_lt: Int
  level_nin: [Int]
  info_nin: [ClassSpellcastingInfoQueryInput]
  level_exists: Boolean
  level_ne: Int
  level_gte: Int
  OR: [ClassSpellcastingQueryInput!]
}

type ClassSpellcastingSpellcasting_ability {
  index: String
  name: String
  url: String
}

input ClassSpellcastingSpellcasting_abilityQueryInput {
  name_lt: String
  name: String
  url_nin: [String]
  AND: [ClassSpellcastingSpellcasting_abilityQueryInput!]
  index_gt: String
  index_lte: String
  url_ne: String
  name_gte: String
  url: String
  index_exists: Boolean
  name_gt: String
  name_exists: Boolean
  index_gte: String
  name_ne: String
  url_exists: Boolean
  index_nin: [String]
  index_ne: String
  name_lte: String
  OR: [ClassSpellcastingSpellcasting_abilityQueryInput!]
  index: String
  url_gte: String
  url_gt: String
  name_nin: [String]
  url_in: [String]
  index_lt: String
  index_in: [String]
  url_lte: String
  name_in: [String]
  url_lt: String
}

type ClassSubclass {
  index: String
  name: String
  url: String
}

input ClassSubclassQueryInput {
  name_lte: String
  name_gt: String
  AND: [ClassSubclassQueryInput!]
  index_in: [String]
  name_nin: [String]
  name_gte: String
  url_lte: String
  url_gte: String
  name_ne: String
  url: String
  OR: [ClassSubclassQueryInput!]
  url_in: [String]
  name_lt: String
  index_gte: String
  url_exists: Boolean
  index_gt: String
  index_ne: String
  url_nin: [String]
  index_exists: Boolean
  name: String
  index_nin: [String]
  name_in: [String]
  url_lt: String
  name_exists: Boolean
  index_lt: String
  url_gt: String
  url_ne: String
  index: String
  index_lte: String
}

type Condition {
  _id: ObjectId
  desc: [String]
  index: String
  name: String
  url: String
}

input ConditionQueryInput {
  _id_gte: ObjectId
  url_nin: [String]
  desc: [String]
  index_in: [String]
  index_exists: Boolean
  url_lt: String
  url_exists: Boolean
  name_ne: String
  _id: ObjectId
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
  _id_lt: ObjectId
  _id_nin: [ObjectId]
  name_gt: String
  index_ne: String
  _id_ne: ObjectId
  index_gte: String
  url_lte: String
  url: String
  index_gt: String
  desc_in: [String]
  index_nin: [String]
  name_lt: String
  index: String
  _id_lte: ObjectId
  url_in: [String]
  name_nin: [String]
  index_lt: String
  OR: [ConditionQueryInput!]
  name_lte: String
  _id_in: [ObjectId]
  _id_gt: ObjectId
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

type DamageType {
  _id: ObjectId
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
  _id_gte: ObjectId
  name_exists: Boolean
  name_ne: String
  _id_nin: [ObjectId]
  _id: ObjectId
  url_gte: String
  url_nin: [String]
  url: String
  index_exists: Boolean
  url_ne: String
  _id_in: [ObjectId]
  name_lt: String
  index_lte: String
  url_exists: Boolean
  desc_nin: [String]
  index_nin: [String]
  desc_in: [String]
  name_in: [String]
  name_gt: String
  _id_gt: ObjectId
  _id_lt: ObjectId
  _id_ne: ObjectId
  desc_exists: Boolean
  name: String
  AND: [DamageTypeQueryInput!]
  _id_lte: ObjectId
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

type Equipment {
  H_damage: EquipmentH_damage
  _id: ObjectId
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

type EquipmentCategory {
  _id: ObjectId
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
  _id_in: [ObjectId]
  _id_lte: ObjectId
  index_exists: Boolean
  _id_exists: Boolean
  url_lt: String
  name_gte: String
  equipment: [EquipmentCategoryEquipmentQueryInput]
  index_ne: String
  index_gt: String
  name: String
  index_gte: String
  _id_gte: ObjectId
  index_lte: String
  equipment_exists: Boolean
  url_gte: String
  OR: [EquipmentCategoryQueryInput!]
  index: String
  name_gt: String
  url: String
  _id_lt: ObjectId
  _id_gt: ObjectId
  url_in: [String]
  index_lt: String
  name_lt: String
  url_exists: Boolean
  url_nin: [String]
  name_nin: [String]
  _id: ObjectId
  equipment_in: [EquipmentCategoryEquipmentQueryInput]
  _id_ne: ObjectId
  _id_nin: [ObjectId]
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
  _id_gt: ObjectId
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
  _id_gte: ObjectId
  str_minimum_gte: Int
  str_minimum_lt: Int
  _id: ObjectId
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
  _id_lte: ObjectId
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
  _id_lt: ObjectId
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
  _id_in: [ObjectId]
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
  _id_nin: [ObjectId]
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
  _id_ne: ObjectId
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

type Feature {
  _id: ObjectId
  choice: FeatureChoice
  class: FeatureClass
  desc: [String]
  group: String
  index: String
  level: Int
  name: String
  prerequisites: [FeaturePrerequisite]
  reference: String
  subclass: FeatureSubclass
  url: String
}

type FeatureChoice {
  choose: Int
  from: [FeatureChoiceFrom]
  type: String
}

type FeatureChoiceFrom {
  index: String
  name: String
  url: String
}

input FeatureChoiceFromQueryInput {
  name_exists: Boolean
  url_nin: [String]
  index_ne: String
  url_lt: String
  name_in: [String]
  url_ne: String
  index_in: [String]
  index_lte: String
  index_nin: [String]
  url_gte: String
  url_in: [String]
  url_gt: String
  AND: [FeatureChoiceFromQueryInput!]
  name_nin: [String]
  name: String
  url_exists: Boolean
  index_gte: String
  index_exists: Boolean
  name_ne: String
  OR: [FeatureChoiceFromQueryInput!]
  name_gte: String
  url_lte: String
  url: String
  index_lt: String
  name_gt: String
  index: String
  index_gt: String
  name_lte: String
  name_lt: String
}

input FeatureChoiceQueryInput {
  choose_ne: Int
  from_exists: Boolean
  from_nin: [FeatureChoiceFromQueryInput]
  type_gt: String
  choose_nin: [Int]
  type_lte: String
  AND: [FeatureChoiceQueryInput!]
  from: [FeatureChoiceFromQueryInput]
  choose: Int
  choose_gte: Int
  choose_gt: Int
  OR: [FeatureChoiceQueryInput!]
  from_in: [FeatureChoiceFromQueryInput]
  type_lt: String
  type_nin: [String]
  choose_lte: Int
  choose_lt: Int
  choose_exists: Boolean
  type_ne: String
  type_gte: String
  choose_in: [Int]
  type_in: [String]
  type_exists: Boolean
  type: String
}

type FeatureClass {
  index: String
  name: String
  url: String
}

input FeatureClassQueryInput {
  AND: [FeatureClassQueryInput!]
  url_gt: String
  url_nin: [String]
  name_lt: String
  url: String
  index_in: [String]
  name: String
  name_nin: [String]
  url_lte: String
  index: String
  index_lte: String
  name_ne: String
  url_gte: String
  index_gte: String
  index_exists: Boolean
  index_gt: String
  name_lte: String
  name_in: [String]
  index_nin: [String]
  url_lt: String
  index_ne: String
  name_gt: String
  index_lt: String
  name_gte: String
  url_exists: Boolean
  name_exists: Boolean
  url_ne: String
  OR: [FeatureClassQueryInput!]
  url_in: [String]
}

type FeaturePrerequisite {
  level: Int
  type: String
}

input FeaturePrerequisiteQueryInput {
  level_lte: Int
  type_ne: String
  level_gt: Int
  level_gte: Int
  type_exists: Boolean
  type_nin: [String]
  type_lt: String
  type_lte: String
  AND: [FeaturePrerequisiteQueryInput!]
  type: String
  type_gt: String
  level: Int
  OR: [FeaturePrerequisiteQueryInput!]
  level_lt: Int
  type_gte: String
  level_exists: Boolean
  level_nin: [Int]
  type_in: [String]
  level_in: [Int]
  level_ne: Int
}

input FeatureQueryInput {
  desc_in: [String]
  desc: [String]
  group_ne: String
  reference_lte: String
  _id_ne: ObjectId
  name_lt: String
  _id_gte: ObjectId
  name_nin: [String]
  url_gt: String
  url_lte: String
  _id_in: [ObjectId]
  index_gte: String
  level_exists: Boolean
  prerequisites_exists: Boolean
  reference_ne: String
  group_gt: String
  class_exists: Boolean
  choice: FeatureChoiceQueryInput
  url: String
  url_ne: String
  name_lte: String
  level_gte: Int
  level_gt: Int
  class: FeatureClassQueryInput
  subclass_exists: Boolean
  _id: ObjectId
  url_nin: [String]
  url_lt: String
  index_gt: String
  url_in: [String]
  url_gte: String
  index_lte: String
  prerequisites_nin: [FeaturePrerequisiteQueryInput]
  index: String
  AND: [FeatureQueryInput!]
  _id_exists: Boolean
  level_ne: Int
  reference_gte: String
  group_lt: String
  index_in: [String]
  level_nin: [Int]
  reference_nin: [String]
  group_exists: Boolean
  group_nin: [String]
  prerequisites_in: [FeaturePrerequisiteQueryInput]
  OR: [FeatureQueryInput!]
  _id_lte: ObjectId
  prerequisites: [FeaturePrerequisiteQueryInput]
  index_ne: String
  reference: String
  level_lt: Int
  _id_gt: ObjectId
  name_exists: Boolean
  _id_lt: ObjectId
  level_lte: Int
  reference_in: [String]
  name_ne: String
  desc_nin: [String]
  reference_lt: String
  subclass: FeatureSubclassQueryInput
  name_gt: String
  reference_exists: Boolean
  reference_gt: String
  name: String
  index_exists: Boolean
  index_nin: [String]
  name_in: [String]
  level: Int
  group_in: [String]
  desc_exists: Boolean
  level_in: [Int]
  _id_nin: [ObjectId]
  index_lt: String
  group_gte: String
  group_lte: String
  choice_exists: Boolean
  name_gte: String
  group: String
  url_exists: Boolean
}

enum FeatureSortByInput {
  GROUP_ASC
  REFERENCE_ASC
  _ID_DESC
  LEVEL_ASC
  LEVEL_DESC
  _ID_ASC
  INDEX_ASC
  INDEX_DESC
  URL_ASC
  NAME_DESC
  URL_DESC
  GROUP_DESC
  REFERENCE_DESC
  NAME_ASC
}

type FeatureSubclass {
  index: String
  name: String
  url: String
}

input FeatureSubclassQueryInput {
  OR: [FeatureSubclassQueryInput!]
  url_ne: String
  url_in: [String]
  url_gte: String
  name_in: [String]
  name_exists: Boolean
  name_nin: [String]
  url: String
  url_lt: String
  index_in: [String]
  url_nin: [String]
  name_lte: String
  index_exists: Boolean
  index_gte: String
  AND: [FeatureSubclassQueryInput!]
  url_gt: String
  url_lte: String
  name_lt: String
  index_nin: [String]
  name_ne: String
  index: String
  index_lte: String
  name_gte: String
  name_gt: String
  index_gt: String
  index_ne: String
  index_lt: String
  url_exists: Boolean
  name: String
}

type Language {
  _id: ObjectId
  desc: String
  index: String
  name: String
  script: String
  type: String
  typical_speakers: [String]
  url: String
}

input LanguageQueryInput {
  _id_exists: Boolean
  name_gt: String
  script_lte: String
  typical_speakers_exists: Boolean
  url_in: [String]
  name_exists: Boolean
  type: String
  url_lte: String
  type_gt: String
  name_nin: [String]
  _id_gte: ObjectId
  name_ne: String
  AND: [LanguageQueryInput!]
  type_ne: String
  url_nin: [String]
  _id_lt: ObjectId
  _id: ObjectId
  url_lt: String
  index_lt: String
  name_lt: String
  type_lte: String
  script_nin: [String]
  desc_ne: String
  desc_nin: [String]
  index_nin: [String]
  script: String
  _id_lte: ObjectId
  script_exists: Boolean
  desc_lt: String
  index_exists: Boolean
  index_gt: String
  _id_in: [ObjectId]
  _id_gt: ObjectId
  typical_speakers: [String]
  name: String
  name_lte: String
  type_lt: String
  index_lte: String
  index_ne: String
  typical_speakers_nin: [String]
  url_ne: String
  desc: String
  desc_gt: String
  _id_nin: [ObjectId]
  url_gt: String
  script_gt: String
  index: String
  _id_ne: ObjectId
  name_in: [String]
  type_gte: String
  name_gte: String
  url_exists: Boolean
  type_exists: Boolean
  index_gte: String
  type_nin: [String]
  index_in: [String]
  script_in: [String]
  desc_exists: Boolean
  url: String
  desc_gte: String
  desc_in: [String]
  desc_lte: String
  script_ne: String
  typical_speakers_in: [String]
  type_in: [String]
  OR: [LanguageQueryInput!]
  script_gte: String
  script_lt: String
  url_gte: String
}

enum LanguageSortByInput {
  NAME_DESC
  SCRIPT_DESC
  _ID_ASC
  INDEX_DESC
  SCRIPT_ASC
  URL_DESC
  DESC_ASC
  DESC_DESC
  NAME_ASC
  TYPE_DESC
  _ID_DESC
  INDEX_ASC
  TYPE_ASC
  URL_ASC
}

type Level {
  _id: ObjectId
  ability_score_bonuses: Int
  class: LevelClass
  class_specific: LevelClass_specific
  feature_choices: [LevelFeature_choice]
  features: [LevelFeature]
  index: String
  level: Int
  prof_bonus: Int
  spellcasting: LevelSpellcasting
  subclass: LevelSubclass
  subclass_specific: LevelSubclass_specific
  url: String
}

type LevelClass {
  index: String
  name: String
  url: String
}

type LevelClass_specific {
  action_surges: Int
  arcane_recovery_levels: Int
  aura_range: Int
  bardic_inspiration_die: Int
  brutal_critical_dice: Int
  channel_divinity_charges: Int
  creating_spell_slots: [LevelClass_specificCreating_spell_slot]
  destroy_undead_cr: Int
  extra_attacks: Int
  favored_enemies: Int
  favored_terrain: Int
  indomitable_uses: Int
  invocations_known: Int
  ki_points: Int
  magical_secrets_max_5: Int
  magical_secrets_max_7: Int
  magical_secrets_max_9: Int
  martial_arts: LevelClass_specificMartial_art
  metamagic_known: Int
  mystic_arcanum_level_6: Int
  mystic_arcanum_level_7: Int
  mystic_arcanum_level_8: Int
  mystic_arcanum_level_9: Int
  rage_count: Int
  rage_damage_bonus: Int
  sneak_attack: LevelClass_specificSneak_attack
  song_of_rest_die: Int
  sorcery_points: Int
  unarmored_movement: Int
  wild_shape_fly: Boolean
  wild_shape_max_cr: Int
  wild_shape_swim: Boolean
}

type LevelClass_specificCreating_spell_slot {
  sorcery_point_cost: Int
  spell_slot_level: Int
}

input LevelClass_specificCreating_spell_slotQueryInput {
  spell_slot_level_nin: [Int]
  spell_slot_level_lte: Int
  sorcery_point_cost_ne: Int
  spell_slot_level_ne: Int
  AND: [LevelClass_specificCreating_spell_slotQueryInput!]
  OR: [LevelClass_specificCreating_spell_slotQueryInput!]
  spell_slot_level_lt: Int
  sorcery_point_cost: Int
  spell_slot_level_in: [Int]
  sorcery_point_cost_nin: [Int]
  spell_slot_level_exists: Boolean
  sorcery_point_cost_lt: Int
  sorcery_point_cost_gt: Int
  spell_slot_level_gte: Int
  sorcery_point_cost_lte: Int
  spell_slot_level: Int
  sorcery_point_cost_exists: Boolean
  sorcery_point_cost_gte: Int
  spell_slot_level_gt: Int
  sorcery_point_cost_in: [Int]
}

type LevelClass_specificMartial_art {
  dice_count: Int
  dice_value: Int
}

input LevelClass_specificMartial_artQueryInput {
  dice_count_gte: Int
  dice_value_lte: Int
  dice_count_gt: Int
  OR: [LevelClass_specificMartial_artQueryInput!]
  dice_value_exists: Boolean
  dice_value_ne: Int
  dice_count_lt: Int
  dice_value: Int
  dice_value_in: [Int]
  dice_count: Int
  dice_count_lte: Int
  dice_count_nin: [Int]
  dice_count_in: [Int]
  dice_value_gte: Int
  dice_count_ne: Int
  AND: [LevelClass_specificMartial_artQueryInput!]
  dice_value_nin: [Int]
  dice_count_exists: Boolean
  dice_value_lt: Int
  dice_value_gt: Int
}

input LevelClass_specificQueryInput {
  wild_shape_fly_ne: Boolean
  bardic_inspiration_die_gt: Int
  metamagic_known_in: [Int]
  favored_terrain_lt: Int
  mystic_arcanum_level_9_gte: Int
  invocations_known_in: [Int]
  rage_damage_bonus_in: [Int]
  ki_points_gte: Int
  unarmored_movement_nin: [Int]
  channel_divinity_charges_gte: Int
  rage_count_gt: Int
  channel_divinity_charges_exists: Boolean
  rage_damage_bonus_lt: Int
  magical_secrets_max_9_nin: [Int]
  invocations_known_gte: Int
  wild_shape_max_cr_lte: Int
  invocations_known_ne: Int
  mystic_arcanum_level_7_lte: Int
  indomitable_uses_gte: Int
  destroy_undead_cr_lt: Int
  favored_enemies_ne: Int
  sneak_attack: LevelClass_specificSneak_attackQueryInput
  song_of_rest_die_gte: Int
  mystic_arcanum_level_8_in: [Int]
  mystic_arcanum_level_8_ne: Int
  mystic_arcanum_level_8_nin: [Int]
  creating_spell_slots_nin: [LevelClass_specificCreating_spell_slotQueryInput]
  magical_secrets_max_7_nin: [Int]
  channel_divinity_charges_in: [Int]
  bardic_inspiration_die_ne: Int
  rage_count_ne: Int
  rage_damage_bonus_lte: Int
  ki_points_nin: [Int]
  mystic_arcanum_level_7_gt: Int
  extra_attacks_in: [Int]
  indomitable_uses_lte: Int
  magical_secrets_max_5_lt: Int
  magical_secrets_max_5_lte: Int
  aura_range_gte: Int
  creating_spell_slots_in: [LevelClass_specificCreating_spell_slotQueryInput]
  sneak_attack_exists: Boolean
  favored_terrain_exists: Boolean
  sorcery_points_exists: Boolean
  bardic_inspiration_die_gte: Int
  rage_count_lt: Int
  aura_range_ne: Int
  mystic_arcanum_level_7_in: [Int]
  bardic_inspiration_die: Int
  mystic_arcanum_level_9_exists: Boolean
  song_of_rest_die_in: [Int]
  action_surges_exists: Boolean
  mystic_arcanum_level_7_nin: [Int]
  brutal_critical_dice_lte: Int
  destroy_undead_cr: Int
  indomitable_uses_lt: Int
  mystic_arcanum_level_7_exists: Boolean
  bardic_inspiration_die_in: [Int]
  mystic_arcanum_level_6_gt: Int
  mystic_arcanum_level_9: Int
  channel_divinity_charges_lte: Int
  aura_range_lt: Int
  wild_shape_fly_exists: Boolean
  metamagic_known_lt: Int
  AND: [LevelClass_specificQueryInput!]
  brutal_critical_dice_exists: Boolean
  indomitable_uses_nin: [Int]
  bardic_inspiration_die_exists: Boolean
  brutal_critical_dice_gte: Int
  metamagic_known_lte: Int
  brutal_critical_dice_ne: Int
  indomitable_uses_exists: Boolean
  wild_shape_swim_exists: Boolean
  favored_enemies: Int
  arcane_recovery_levels: Int
  ki_points_in: [Int]
  mystic_arcanum_level_9_in: [Int]
  indomitable_uses: Int
  action_surges_gte: Int
  invocations_known_lte: Int
  wild_shape_max_cr_nin: [Int]
  rage_count_lte: Int
  wild_shape_max_cr_lt: Int
  channel_divinity_charges_gt: Int
  aura_range_exists: Boolean
  magical_secrets_max_7_ne: Int
  magical_secrets_max_5_gte: Int
  song_of_rest_die_gt: Int
  unarmored_movement_gt: Int
  magical_secrets_max_5_gt: Int
  mystic_arcanum_level_6: Int
  ki_points_exists: Boolean
  favored_enemies_lte: Int
  magical_secrets_max_7_in: [Int]
  arcane_recovery_levels_lte: Int
  wild_shape_swim: Boolean
  song_of_rest_die_exists: Boolean
  aura_range_lte: Int
  magical_secrets_max_9_gte: Int
  martial_arts: LevelClass_specificMartial_artQueryInput
  favored_terrain_lte: Int
  brutal_critical_dice_in: [Int]
  sorcery_points_gt: Int
  ki_points_lt: Int
  extra_attacks_exists: Boolean
  ki_points_ne: Int
  invocations_known: Int
  mystic_arcanum_level_8: Int
  song_of_rest_die_lt: Int
  mystic_arcanum_level_6_gte: Int
  extra_attacks_gt: Int
  magical_secrets_max_7_gte: Int
  unarmored_movement_gte: Int
  metamagic_known_nin: [Int]
  action_surges_in: [Int]
  mystic_arcanum_level_7_ne: Int
  extra_attacks_nin: [Int]
  mystic_arcanum_level_8_lt: Int
  ki_points_gt: Int
  mystic_arcanum_level_8_gte: Int
  rage_count_nin: [Int]
  song_of_rest_die_ne: Int
  arcane_recovery_levels_nin: [Int]
  aura_range_gt: Int
  action_surges_lt: Int
  favored_terrain_gt: Int
  brutal_critical_dice: Int
  favored_enemies_nin: [Int]
  martial_arts_exists: Boolean
  metamagic_known_ne: Int
  action_surges_gt: Int
  magical_secrets_max_7_lt: Int
  mystic_arcanum_level_9_gt: Int
  unarmored_movement_exists: Boolean
  destroy_undead_cr_lte: Int
  mystic_arcanum_level_6_nin: [Int]
  wild_shape_max_cr_gt: Int
  channel_divinity_charges_ne: Int
  arcane_recovery_levels_gt: Int
  favored_terrain_ne: Int
  brutal_critical_dice_nin: [Int]
  ki_points: Int
  favored_enemies_in: [Int]
  sorcery_points_lte: Int
  mystic_arcanum_level_6_exists: Boolean
  favored_enemies_gt: Int
  favored_enemies_gte: Int
  magical_secrets_max_9_in: [Int]
  mystic_arcanum_level_9_ne: Int
  unarmored_movement_ne: Int
  indomitable_uses_in: [Int]
  arcane_recovery_levels_lt: Int
  extra_attacks_lte: Int
  magical_secrets_max_5_ne: Int
  wild_shape_max_cr_in: [Int]
  destroy_undead_cr_ne: Int
  favored_terrain: Int
  indomitable_uses_gt: Int
  magical_secrets_max_9_lt: Int
  creating_spell_slots: [LevelClass_specificCreating_spell_slotQueryInput]
  unarmored_movement: Int
  destroy_undead_cr_gte: Int
  magical_secrets_max_7: Int
  creating_spell_slots_exists: Boolean
  bardic_inspiration_die_nin: [Int]
  magical_secrets_max_7_gt: Int
  magical_secrets_max_9_gt: Int
  magical_secrets_max_5: Int
  magical_secrets_max_9_lte: Int
  extra_attacks_lt: Int
  arcane_recovery_levels_in: [Int]
  mystic_arcanum_level_6_ne: Int
  rage_damage_bonus_nin: [Int]
  extra_attacks_gte: Int
  rage_damage_bonus_gt: Int
  action_surges: Int
  aura_range: Int
  destroy_undead_cr_nin: [Int]
  action_surges_lte: Int
  mystic_arcanum_level_8_exists: Boolean
  channel_divinity_charges: Int
  rage_damage_bonus_gte: Int
  favored_enemies_exists: Boolean
  mystic_arcanum_level_8_gt: Int
  mystic_arcanum_level_6_in: [Int]
  sorcery_points: Int
  channel_divinity_charges_lt: Int
  action_surges_nin: [Int]
  wild_shape_max_cr_exists: Boolean
  wild_shape_swim_ne: Boolean
  magical_secrets_max_7_lte: Int
  song_of_rest_die: Int
  invocations_known_lt: Int
  destroy_undead_cr_in: [Int]
  metamagic_known_gt: Int
  ki_points_lte: Int
  indomitable_uses_ne: Int
  sorcery_points_nin: [Int]
  unarmored_movement_in: [Int]
  arcane_recovery_levels_ne: Int
  extra_attacks: Int
  unarmored_movement_lt: Int
  destroy_undead_cr_exists: Boolean
  bardic_inspiration_die_lt: Int
  magical_secrets_max_5_exists: Boolean
  invocations_known_gt: Int
  magical_secrets_max_9_ne: Int
  brutal_critical_dice_gt: Int
  channel_divinity_charges_nin: [Int]
  mystic_arcanum_level_9_lte: Int
  mystic_arcanum_level_7_lt: Int
  invocations_known_exists: Boolean
  magical_secrets_max_9_exists: Boolean
  rage_damage_bonus_exists: Boolean
  mystic_arcanum_level_8_lte: Int
  extra_attacks_ne: Int
  favored_terrain_nin: [Int]
  magical_secrets_max_9: Int
  mystic_arcanum_level_7_gte: Int
  sorcery_points_in: [Int]
  aura_range_nin: [Int]
  magical_secrets_max_7_exists: Boolean
  sorcery_points_gte: Int
  mystic_arcanum_level_7: Int
  arcane_recovery_levels_gte: Int
  action_surges_ne: Int
  song_of_rest_die_lte: Int
  invocations_known_nin: [Int]
  rage_count_gte: Int
  rage_count_exists: Boolean
  wild_shape_max_cr_gte: Int
  rage_damage_bonus: Int
  metamagic_known: Int
  favored_enemies_lt: Int
  brutal_critical_dice_lt: Int
  magical_secrets_max_5_nin: [Int]
  arcane_recovery_levels_exists: Boolean
  aura_range_in: [Int]
  rage_damage_bonus_ne: Int
  sorcery_points_ne: Int
  sorcery_points_lt: Int
  mystic_arcanum_level_6_lt: Int
  metamagic_known_exists: Boolean
  rage_count_in: [Int]
  destroy_undead_cr_gt: Int
  wild_shape_fly: Boolean
  mystic_arcanum_level_9_lt: Int
  wild_shape_max_cr: Int
  wild_shape_max_cr_ne: Int
  mystic_arcanum_level_6_lte: Int
  song_of_rest_die_nin: [Int]
  metamagic_known_gte: Int
  favored_terrain_gte: Int
  rage_count: Int
  OR: [LevelClass_specificQueryInput!]
  bardic_inspiration_die_lte: Int
  unarmored_movement_lte: Int
  magical_secrets_max_5_in: [Int]
  mystic_arcanum_level_9_nin: [Int]
  favored_terrain_in: [Int]
}

type LevelClass_specificSneak_attack {
  dice_count: Int
  dice_value: Int
}

input LevelClass_specificSneak_attackQueryInput {
  dice_value_in: [Int]
  dice_count_lt: Int
  dice_count_gte: Int
  dice_count_ne: Int
  dice_value_gte: Int
  OR: [LevelClass_specificSneak_attackQueryInput!]
  dice_count_gt: Int
  dice_value: Int
  dice_value_nin: [Int]
  AND: [LevelClass_specificSneak_attackQueryInput!]
  dice_value_gt: Int
  dice_value_lte: Int
  dice_count_in: [Int]
  dice_value_lt: Int
  dice_value_ne: Int
  dice_count: Int
  dice_count_exists: Boolean
  dice_value_exists: Boolean
  dice_count_lte: Int
  dice_count_nin: [Int]
}

input LevelClassQueryInput {
  index_exists: Boolean
  name_exists: Boolean
  name_lt: String
  index_gt: String
  index_in: [String]
  name_nin: [String]
  index_nin: [String]
  AND: [LevelClassQueryInput!]
  url_ne: String
  url_nin: [String]
  OR: [LevelClassQueryInput!]
  url_in: [String]
  index: String
  name_lte: String
  index_lte: String
  url_gte: String
  name_ne: String
  name_in: [String]
  index_ne: String
  index_gte: String
  url_exists: Boolean
  url: String
  name: String
  index_lt: String
  url_lt: String
  name_gt: String
  url_lte: String
  url_gt: String
  name_gte: String
}

type LevelFeature {
  index: String
  name: String
  url: String
}

type LevelFeature_choice {
  index: String
  name: String
  url: String
}

input LevelFeature_choiceQueryInput {
  index_exists: Boolean
  AND: [LevelFeature_choiceQueryInput!]
  index: String
  name_gt: String
  url_in: [String]
  index_ne: String
  name_exists: Boolean
  name_ne: String
  index_lte: String
  index_gt: String
  name: String
  url_gte: String
  index_nin: [String]
  name_lt: String
  name_lte: String
  url_gt: String
  url_lte: String
  name_nin: [String]
  name_in: [String]
  name_gte: String
  url_ne: String
  index_in: [String]
  url_exists: Boolean
  OR: [LevelFeature_choiceQueryInput!]
  index_lt: String
  url: String
  url_nin: [String]
  index_gte: String
  url_lt: String
}

input LevelFeatureQueryInput {
  url: String
  index_gte: String
  name_nin: [String]
  url_in: [String]
  url_exists: Boolean
  index_gt: String
  url_nin: [String]
  index_ne: String
  name_lte: String
  url_gt: String
  name_exists: Boolean
  url_lt: String
  name_in: [String]
  name_gte: String
  name: String
  url_gte: String
  index_in: [String]
  name_gt: String
  AND: [LevelFeatureQueryInput!]
  url_lte: String
  index_exists: Boolean
  index_lt: String
  index_nin: [String]
  index_lte: String
  url_ne: String
  name_ne: String
  index: String
  name_lt: String
  OR: [LevelFeatureQueryInput!]
}

input LevelQueryInput {
  level_gt: Int
  url_gte: String
  _id_gt: ObjectId
  url_in: [String]
  level_exists: Boolean
  feature_choices_in: [LevelFeature_choiceQueryInput]
  url_nin: [String]
  index_nin: [String]
  ability_score_bonuses: Int
  prof_bonus_exists: Boolean
  features_in: [LevelFeatureQueryInput]
  feature_choices_nin: [LevelFeature_choiceQueryInput]
  url_gt: String
  prof_bonus_gt: Int
  url_exists: Boolean
  ability_score_bonuses_exists: Boolean
  prof_bonus_in: [Int]
  feature_choices_exists: Boolean
  url_lt: String
  AND: [LevelQueryInput!]
  spellcasting_exists: Boolean
  class_specific: LevelClass_specificQueryInput
  level_lt: Int
  feature_choices: [LevelFeature_choiceQueryInput]
  _id_in: [ObjectId]
  prof_bonus_lt: Int
  class_specific_exists: Boolean
  _id_gte: ObjectId
  _id: ObjectId
  ability_score_bonuses_gt: Int
  prof_bonus_ne: Int
  ability_score_bonuses_lt: Int
  level_lte: Int
  ability_score_bonuses_lte: Int
  _id_nin: [ObjectId]
  index_lt: String
  level: Int
  features: [LevelFeatureQueryInput]
  _id_lte: ObjectId
  level_ne: Int
  prof_bonus: Int
  index_gt: String
  subclass: LevelSubclassQueryInput
  subclass_specific_exists: Boolean
  ability_score_bonuses_ne: Int
  prof_bonus_lte: Int
  prof_bonus_gte: Int
  class_exists: Boolean
  prof_bonus_nin: [Int]
  level_gte: Int
  url_ne: String
  _id_exists: Boolean
  level_in: [Int]
  index_ne: String
  url: String
  ability_score_bonuses_in: [Int]
  url_lte: String
  _id_ne: ObjectId
  level_nin: [Int]
  index_exists: Boolean
  subclass_specific: LevelSubclass_specificQueryInput
  _id_lt: ObjectId
  ability_score_bonuses_nin: [Int]
  index: String
  class: LevelClassQueryInput
  index_in: [String]
  subclass_exists: Boolean
  OR: [LevelQueryInput!]
  index_lte: String
  ability_score_bonuses_gte: Int
  spellcasting: LevelSpellcastingQueryInput
  features_nin: [LevelFeatureQueryInput]
  index_gte: String
  features_exists: Boolean
}

enum LevelSortByInput {
  LEVEL_DESC
  URL_ASC
  URL_DESC
  PROF_BONUS_DESC
  _ID_ASC
  LEVEL_ASC
  ABILITY_SCORE_BONUSES_ASC
  ABILITY_SCORE_BONUSES_DESC
  INDEX_ASC
  INDEX_DESC
  PROF_BONUS_ASC
  _ID_DESC
}

type LevelSpellcasting {
  cantrips_known: Int
  spell_slots_level_1: Int
  spell_slots_level_2: Int
  spell_slots_level_3: Int
  spell_slots_level_4: Int
  spell_slots_level_5: Int
  spell_slots_level_6: Int
  spell_slots_level_7: Int
  spell_slots_level_8: Int
  spell_slots_level_9: Int
  spells_known: Int
}

input LevelSpellcastingQueryInput {
  spell_slots_level_1_lte: Int
  spell_slots_level_8: Int
  spell_slots_level_6_exists: Boolean
  spell_slots_level_9: Int
  spell_slots_level_9_in: [Int]
  spell_slots_level_6_gt: Int
  cantrips_known_lt: Int
  spell_slots_level_2_nin: [Int]
  spell_slots_level_5_lte: Int
  spell_slots_level_3_lte: Int
  spell_slots_level_4_gte: Int
  spell_slots_level_4_exists: Boolean
  cantrips_known_gte: Int
  spell_slots_level_2_lte: Int
  spell_slots_level_3_in: [Int]
  spell_slots_level_7_ne: Int
  spells_known_nin: [Int]
  spell_slots_level_4_lt: Int
  spell_slots_level_1_gt: Int
  spells_known_exists: Boolean
  spell_slots_level_8_gt: Int
  spell_slots_level_7: Int
  spell_slots_level_6_lte: Int
  spell_slots_level_1_nin: [Int]
  spell_slots_level_7_gt: Int
  spell_slots_level_8_gte: Int
  spell_slots_level_1_ne: Int
  spell_slots_level_8_in: [Int]
  spell_slots_level_1_in: [Int]
  spell_slots_level_7_lte: Int
  spell_slots_level_9_exists: Boolean
  spell_slots_level_6_in: [Int]
  spell_slots_level_9_nin: [Int]
  spell_slots_level_4: Int
  spell_slots_level_9_lte: Int
  spell_slots_level_1_gte: Int
  spell_slots_level_7_nin: [Int]
  spell_slots_level_4_nin: [Int]
  spell_slots_level_3_exists: Boolean
  cantrips_known: Int
  spell_slots_level_2_gte: Int
  spell_slots_level_2_ne: Int
  spell_slots_level_5_gt: Int
  spell_slots_level_3_lt: Int
  spell_slots_level_3_gte: Int
  spell_slots_level_8_exists: Boolean
  spell_slots_level_2_exists: Boolean
  spell_slots_level_2_lt: Int
  spell_slots_level_9_gte: Int
  spell_slots_level_6_nin: [Int]
  spell_slots_level_8_lte: Int
  spell_slots_level_2_in: [Int]
  spell_slots_level_7_exists: Boolean
  spell_slots_level_8_ne: Int
  spell_slots_level_2_gt: Int
  spell_slots_level_5_gte: Int
  spells_known_gt: Int
  spell_slots_level_4_ne: Int
  spell_slots_level_1: Int
  spell_slots_level_3_nin: [Int]
  spell_slots_level_7_gte: Int
  spell_slots_level_2: Int
  spell_slots_level_5_lt: Int
  spell_slots_level_5_in: [Int]
  spells_known_lt: Int
  spell_slots_level_3: Int
  spells_known: Int
  cantrips_known_nin: [Int]
  spell_slots_level_9_gt: Int
  spell_slots_level_4_gt: Int
  spell_slots_level_8_nin: [Int]
  spell_slots_level_4_lte: Int
  spell_slots_level_8_lt: Int
  spell_slots_level_3_ne: Int
  spells_known_in: [Int]
  spells_known_ne: Int
  AND: [LevelSpellcastingQueryInput!]
  spell_slots_level_1_lt: Int
  spell_slots_level_9_ne: Int
  spell_slots_level_4_in: [Int]
  spell_slots_level_1_exists: Boolean
  cantrips_known_lte: Int
  spell_slots_level_5: Int
  spell_slots_level_6_ne: Int
  spell_slots_level_6_gte: Int
  spell_slots_level_5_exists: Boolean
  spell_slots_level_5_nin: [Int]
  spell_slots_level_6: Int
  spells_known_lte: Int
  spell_slots_level_3_gt: Int
  cantrips_known_exists: Boolean
  spell_slots_level_7_in: [Int]
  cantrips_known_gt: Int
  cantrips_known_in: [Int]
  spell_slots_level_5_ne: Int
  spell_slots_level_7_lt: Int
  spell_slots_level_9_lt: Int
  spell_slots_level_6_lt: Int
  spells_known_gte: Int
  cantrips_known_ne: Int
  OR: [LevelSpellcastingQueryInput!]
}

type LevelSubclass {
  index: String
  name: String
  url: String
}

type LevelSubclass_specific {
  additional_magical_secrets_max_lvl: Int
  aura_range: Int
}

input LevelSubclass_specificQueryInput {
  AND: [LevelSubclass_specificQueryInput!]
  aura_range_gte: Int
  additional_magical_secrets_max_lvl_ne: Int
  additional_magical_secrets_max_lvl_gt: Int
  additional_magical_secrets_max_lvl_lte: Int
  aura_range: Int
  aura_range_nin: [Int]
  aura_range_lte: Int
  aura_range_gt: Int
  aura_range_lt: Int
  additional_magical_secrets_max_lvl_in: [Int]
  OR: [LevelSubclass_specificQueryInput!]
  aura_range_in: [Int]
  aura_range_exists: Boolean
  additional_magical_secrets_max_lvl_nin: [Int]
  additional_magical_secrets_max_lvl_lt: Int
  aura_range_ne: Int
  additional_magical_secrets_max_lvl_gte: Int
  additional_magical_secrets_max_lvl: Int
  additional_magical_secrets_max_lvl_exists: Boolean
}

input LevelSubclassQueryInput {
  index_gte: String
  url_nin: [String]
  url_gt: String
  index_lt: String
  index: String
  url_gte: String
  name_gt: String
  name: String
  name_nin: [String]
  url_ne: String
  url_lt: String
  name_gte: String
  url_exists: Boolean
  name_lte: String
  OR: [LevelSubclassQueryInput!]
  index_lte: String
  name_in: [String]
  name_exists: Boolean
  index_ne: String
  index_nin: [String]
  name_lt: String
  name_ne: String
  url: String
  index_in: [String]
  AND: [LevelSubclassQueryInput!]
  index_exists: Boolean
  url_in: [String]
  index_gt: String
  url_lte: String
}

type MagicItem {
  _id: ObjectId
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
  _id_lte: ObjectId
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
  _id_nin: [ObjectId]
  _id_gt: ObjectId
  url_gte: String
  url_nin: [String]
  url_lte: String
  url_exists: Boolean
  index: String
  desc_in: [String]
  _id_in: [ObjectId]
  AND: [MagicItemQueryInput!]
  name_gt: String
  _id: ObjectId
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
  _id_ne: ObjectId
  _id_gte: ObjectId
  index_nin: [String]
  index_gte: String
  index_gt: String
  _id_lt: ObjectId
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

type MagicSchool {
  _id: ObjectId
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
  _id_gte: ObjectId
  index_ne: String
  desc_lt: String
  _id_in: [ObjectId]
  url_lt: String
  index_in: [String]
  url_nin: [String]
  url_lte: String
  index: String
  _id_gt: ObjectId
  _id_nin: [ObjectId]
  name_gte: String
  _id_ne: ObjectId
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
  _id_lte: ObjectId
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
  _id: ObjectId
  name_lt: String
  _id_lt: ObjectId
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

type Monster {
  _id: ObjectId
  actions: [MonsterAction]
  alignment: String
  armor_class: Int
  challenge_rating: Float
  charisma: Int
  condition_immunities: [MonsterCondition_immunity]
  constitution: Int
  damage_immunities: [String]
  damage_resistances: [String]
  damage_vulnerabilities: [String]
  dexterity: Int
  hit_dice: String
  hit_points: Int
  index: String
  intelligence: Int
  languages: String
  legendary_actions: [MonsterLegendary_action]
  name: String
  other_speeds: [MonsterOther_speed]
  proficiencies: [MonsterProficiency]
  reactions: [MonsterReaction]
  senses: MonsterSense
  size: String
  special_abilities: [MonsterSpecial_ability]
  speed: MonsterSpeed
  strength: Int
  subtype: String
  type: String
  url: String
  wisdom: Int
  xp: Int
}

type MonsterAction {
  attack_bonus: Int
  damage: [MonsterActionDamage]
  desc: String
  name: String
}

type MonsterActionDamage {
  damage_dice: String
  damage_type: MonsterActionDamageDamage_type
}

type MonsterActionDamageDamage_type {
  index: String
  name: String
  url: String
}

input MonsterActionDamageDamage_typeQueryInput {
  url_in: [String]
  index_lt: String
  index_gte: String
  name_exists: Boolean
  url_exists: Boolean
  url_gt: String
  url_gte: String
  OR: [MonsterActionDamageDamage_typeQueryInput!]
  index_exists: Boolean
  index_in: [String]
  name_gte: String
  url_ne: String
  AND: [MonsterActionDamageDamage_typeQueryInput!]
  name_lt: String
  name_gt: String
  index_lte: String
  name_lte: String
  url_lt: String
  url_lte: String
  name_nin: [String]
  index: String
  index_nin: [String]
  url_nin: [String]
  name_ne: String
  index_ne: String
  name: String
  url: String
  index_gt: String
  name_in: [String]
}

input MonsterActionDamageQueryInput {
  damage_dice: String
  damage_dice_nin: [String]
  damage_type_exists: Boolean
  OR: [MonsterActionDamageQueryInput!]
  damage_dice_gte: String
  damage_dice_gt: String
  damage_dice_lt: String
  AND: [MonsterActionDamageQueryInput!]
  damage_dice_lte: String
  damage_type: MonsterActionDamageDamage_typeQueryInput
  damage_dice_ne: String
  damage_dice_exists: Boolean
  damage_dice_in: [String]
}

input MonsterActionQueryInput {
  AND: [MonsterActionQueryInput!]
  damage_nin: [MonsterActionDamageQueryInput]
  attack_bonus_in: [Int]
  name_ne: String
  name: String
  name_gte: String
  desc_gte: String
  desc_in: [String]
  attack_bonus_ne: Int
  attack_bonus: Int
  name_in: [String]
  damage: [MonsterActionDamageQueryInput]
  name_exists: Boolean
  desc_lt: String
  attack_bonus_exists: Boolean
  damage_exists: Boolean
  desc_ne: String
  OR: [MonsterActionQueryInput!]
  name_nin: [String]
  desc_gt: String
  attack_bonus_gte: Int
  name_gt: String
  attack_bonus_lt: Int
  desc_lte: String
  name_lte: String
  attack_bonus_lte: Int
  desc_nin: [String]
  name_lt: String
  desc: String
  desc_exists: Boolean
  attack_bonus_gt: Int
  attack_bonus_nin: [Int]
  damage_in: [MonsterActionDamageQueryInput]
}

type MonsterCondition_immunity {
  index: String
  name: String
  url: String
}

input MonsterCondition_immunityQueryInput {
  index_nin: [String]
  index_gt: String
  name_lt: String
  url_gte: String
  index_gte: String
  url_lte: String
  index_in: [String]
  url_nin: [String]
  url_exists: Boolean
  index_exists: Boolean
  url_gt: String
  name_exists: Boolean
  url_ne: String
  url: String
  OR: [MonsterCondition_immunityQueryInput!]
  index_ne: String
  name_gt: String
  url_lt: String
  name_in: [String]
  index_lt: String
  name_ne: String
  name_lte: String
  name: String
  url_in: [String]
  name_gte: String
  AND: [MonsterCondition_immunityQueryInput!]
  index: String
  index_lte: String
  name_nin: [String]
}


type MonsterLegendary_action {
  attack_bonus: Int
  desc: String
  name: String
}

input MonsterLegendary_actionQueryInput {
  attack_bonus_nin: [Int]
  name_ne: String
  attack_bonus: Int
  attack_bonus_lt: Int
  desc_gte: String
  desc_nin: [String]
  name_lte: String
  attack_bonus_ne: Int
  desc_exists: Boolean
  name_in: [String]
  name_gt: String
  desc_lt: String
  name_nin: [String]
  name_lt: String
  attack_bonus_gt: Int
  desc_ne: String
  attack_bonus_gte: Int
  name_gte: String
  name_exists: Boolean
  attack_bonus_in: [Int]
  desc_in: [String]
  OR: [MonsterLegendary_actionQueryInput!]
  desc: String
  attack_bonus_exists: Boolean
  AND: [MonsterLegendary_actionQueryInput!]
  desc_gt: String
  attack_bonus_lte: Int
  name: String
  desc_lte: String
}

type MonsterOther_speed {
  form: String
  speed: MonsterOther_speedSpeed
}

input MonsterOther_speedQueryInput {
  form_gt: String
  form_gte: String
  OR: [MonsterOther_speedQueryInput!]
  form_nin: [String]
  form_exists: Boolean
  AND: [MonsterOther_speedQueryInput!]
  form_ne: String
  form_in: [String]
  form: String
  form_lte: String
  speed_exists: Boolean
  speed: MonsterOther_speedSpeedQueryInput
  form_lt: String
}

type MonsterOther_speedSpeed {
  walk: String
}

input MonsterOther_speedSpeedQueryInput {
  OR: [MonsterOther_speedSpeedQueryInput!]
  walk_gt: String
  walk_nin: [String]
  AND: [MonsterOther_speedSpeedQueryInput!]
  walk_lt: String
  walk_gte: String
  walk_lte: String
  walk_exists: Boolean
  walk_ne: String
  walk_in: [String]
  walk: String
}

type MonsterProficiency {
  proficiency: MonsterProficiencyProficiency
  value: Int
}

type MonsterProficiencyProficiency {
  index: String
  name: String
  url: String
}

input MonsterProficiencyProficiencyQueryInput {
  AND: [MonsterProficiencyProficiencyQueryInput!]
  url_ne: String
  index_gte: String
  name_lt: String
  url_gte: String
  name_gt: String
  url_lt: String
  name_in: [String]
  url_lte: String
  index_exists: Boolean
  index_lte: String
  name_gte: String
  url_in: [String]
  name: String
  name_exists: Boolean
  index_in: [String]
  name_ne: String
  url: String
  url_exists: Boolean
  index_nin: [String]
  index: String
  OR: [MonsterProficiencyProficiencyQueryInput!]
  name_lte: String
  index_gt: String
  url_gt: String
  url_nin: [String]
  index_ne: String
  index_lt: String
  name_nin: [String]
}

input MonsterProficiencyQueryInput {
  value_ne: Int
  OR: [MonsterProficiencyQueryInput!]
  value_in: [Int]
  proficiency_exists: Boolean
  value_lte: Int
  value_exists: Boolean
  proficiency: MonsterProficiencyProficiencyQueryInput
  value: Int
  value_gte: Int
  value_gt: Int
  AND: [MonsterProficiencyQueryInput!]
  value_lt: Int
  value_nin: [Int]
}

input MonsterQueryInput {
  other_speeds_in: [MonsterOther_speedQueryInput]
  name_nin: [String]
  charisma_exists: Boolean
  intelligence_exists: Boolean
  condition_immunities_in: [MonsterCondition_immunityQueryInput]
  type_ne: String
  xp_in: [Int]
  dexterity_lte: Int
  hit_points_lte: Int
  index_in: [String]
  size_gt: String
  legendary_actions_nin: [MonsterLegendary_actionQueryInput]
  wisdom_exists: Boolean
  challenge_rating_lte: Float
  hit_dice_ne: String
  languages_gt: String
  charisma_gte: Int
  url_lt: String
  speed_exists: Boolean
  strength_in: [Int]
  strength_gte: Int
  index_lte: String
  proficiencies: [MonsterProficiencyQueryInput]
  charisma_lte: Int
  size_ne: String
  challenge_rating_nin: [Float]
  _id_nin: [ObjectId]
  challenge_rating_gt: Float
  hit_dice_lt: String
  intelligence_lt: Int
  dexterity_exists: Boolean
  reactions: [MonsterReactionQueryInput]
  damage_vulnerabilities_in: [String]
  armor_class_ne: Int
  languages_in: [String]
  challenge_rating_gte: Float
  type_gte: String
  wisdom_gt: Int
  xp_ne: Int
  other_speeds_exists: Boolean
  _id_exists: Boolean
  dexterity_in: [Int]
  damage_vulnerabilities: [String]
  strength: Int
  alignment_lte: String
  proficiencies_nin: [MonsterProficiencyQueryInput]
  xp: Int
  wisdom_nin: [Int]
  _id_in: [ObjectId]
  languages_lte: String
  xp_lt: Int
  other_speeds: [MonsterOther_speedQueryInput]
  OR: [MonsterQueryInput!]
  damage_resistances_in: [String]
  constitution_nin: [Int]
  dexterity_gte: Int
  strength_nin: [Int]
  hit_dice_nin: [String]
  armor_class_gt: Int
  hit_dice_gte: String
  _id_gte: ObjectId
  damage_resistances: [String]
  constitution_ne: Int
  armor_class_gte: Int
  _id: ObjectId
  alignment: String
  alignment_in: [String]
  special_abilities_exists: Boolean
  armor_class_exists: Boolean
  type_in: [String]
  name_lt: String
  damage_immunities_in: [String]
  url_in: [String]
  index_lt: String
  wisdom_ne: Int
  challenge_rating: Float
  armor_class_in: [Int]
  size: String
  charisma: Int
  hit_points_in: [Int]
  subtype_lt: String
  url_ne: String
  intelligence_gt: Int
  dexterity_nin: [Int]
  languages: String
  wisdom_lte: Int
  alignment_nin: [String]
  _id_gt: ObjectId
  dexterity: Int
  charisma_gt: Int
  damage_immunities: [String]
  constitution_lt: Int
  proficiencies_exists: Boolean
  name_gte: String
  intelligence_in: [Int]
  url_exists: Boolean
  armor_class_lte: Int
  name_ne: String
  size_nin: [String]
  intelligence_nin: [Int]
  damage_vulnerabilities_nin: [String]
  type_lte: String
  strength_ne: Int
  challenge_rating_exists: Boolean
  strength_lt: Int
  proficiencies_in: [MonsterProficiencyQueryInput]
  hit_dice: String
  _id_lt: ObjectId
  reactions_nin: [MonsterReactionQueryInput]
  _id_ne: ObjectId
  charisma_lt: Int
  subtype_exists: Boolean
  constitution: Int
  hit_points_exists: Boolean
  damage_immunities_nin: [String]
  damage_vulnerabilities_exists: Boolean
  dexterity_lt: Int
  xp_nin: [Int]
  index: String
  subtype_ne: String
  strength_exists: Boolean
  reactions_in: [MonsterReactionQueryInput]
  condition_immunities_exists: Boolean
  languages_ne: String
  speed: MonsterSpeedQueryInput
  hit_points_ne: Int
  alignment_lt: String
  special_abilities: [MonsterSpecial_abilityQueryInput]
  index_exists: Boolean
  alignment_gt: String
  alignment_ne: String
  url: String
  actions: [MonsterActionQueryInput]
  url_nin: [String]
  hit_points_gt: Int
  AND: [MonsterQueryInput!]
  damage_resistances_exists: Boolean
  hit_points: Int
  intelligence_lte: Int
  type_nin: [String]
  xp_gt: Int
  senses: MonsterSenseQueryInput
  type_exists: Boolean
  actions_in: [MonsterActionQueryInput]
  special_abilities_in: [MonsterSpecial_abilityQueryInput]
  size_lte: String
  languages_nin: [String]
  type_lt: String
  challenge_rating_ne: Float
  strength_gt: Int
  size_lt: String
  strength_lte: Int
  hit_dice_in: [String]
  legendary_actions_exists: Boolean
  index_nin: [String]
  reactions_exists: Boolean
  charisma_in: [Int]
  damage_resistances_nin: [String]
  wisdom_lt: Int
  charisma_ne: Int
  armor_class: Int
  armor_class_nin: [Int]
  legendary_actions: [MonsterLegendary_actionQueryInput]
  challenge_rating_in: [Float]
  hit_dice_exists: Boolean
  type_gt: String
  url_lte: String
  legendary_actions_in: [MonsterLegendary_actionQueryInput]
  wisdom_gte: Int
  wisdom_in: [Int]
  armor_class_lt: Int
  hit_points_lt: Int
  xp_gte: Int
  languages_lt: String
  subtype_lte: String
  charisma_nin: [Int]
  senses_exists: Boolean
  subtype: String
  index_gt: String
  alignment_gte: String
  _id_lte: ObjectId
  challenge_rating_lt: Float
  hit_dice_gt: String
  url_gt: String
  languages_exists: Boolean
  size_gte: String
  actions_nin: [MonsterActionQueryInput]
  index_gte: String
  damage_immunities_exists: Boolean
  hit_points_gte: Int
  name_lte: String
  wisdom: Int
  languages_gte: String
  intelligence_gte: Int
  constitution_lte: Int
  condition_immunities_nin: [MonsterCondition_immunityQueryInput]
  index_ne: String
  type: String
  xp_lte: Int
  intelligence: Int
  xp_exists: Boolean
  hit_points_nin: [Int]
  subtype_gt: String
  dexterity_ne: Int
  other_speeds_nin: [MonsterOther_speedQueryInput]
  subtype_gte: String
  subtype_nin: [String]
  subtype_in: [String]
  hit_dice_lte: String
  size_exists: Boolean
  constitution_exists: Boolean
  intelligence_ne: Int
  url_gte: String
  alignment_exists: Boolean
  name: String
  constitution_gte: Int
  special_abilities_nin: [MonsterSpecial_abilityQueryInput]
  dexterity_gt: Int
  size_in: [String]
  actions_exists: Boolean
  name_in: [String]
  constitution_in: [Int]
  name_gt: String
  condition_immunities: [MonsterCondition_immunityQueryInput]
  name_exists: Boolean
  constitution_gt: Int
}

type MonsterReaction {
  desc: String
  name: String
}

input MonsterReactionQueryInput {
  OR: [MonsterReactionQueryInput!]
  name_in: [String]
  desc_gt: String
  name_gte: String
  name: String
  name_exists: Boolean
  desc_gte: String
  name_gt: String
  name_lt: String
  name_lte: String
  desc_ne: String
  desc_exists: Boolean
  name_nin: [String]
  desc_lte: String
  name_ne: String
  desc_lt: String
  desc_in: [String]
  desc_nin: [String]
  AND: [MonsterReactionQueryInput!]
  desc: String
}

type MonsterSense {
  blindsight: String
  darkvision: String
  passive_perception: Int
  tremorsense: String
  truesight: String
}

input MonsterSenseQueryInput {
  blindsight_lt: String
  passive_perception_lte: Int
  truesight_in: [String]
  blindsight_gt: String
  darkvision_gt: String
  blindsight_exists: Boolean
  blindsight: String
  passive_perception_exists: Boolean
  truesight_nin: [String]
  tremorsense_nin: [String]
  darkvision_exists: Boolean
  blindsight_in: [String]
  darkvision_in: [String]
  darkvision_lte: String
  blindsight_nin: [String]
  tremorsense_lt: String
  truesight_ne: String
  blindsight_lte: String
  darkvision_nin: [String]
  OR: [MonsterSenseQueryInput!]
  passive_perception_ne: Int
  AND: [MonsterSenseQueryInput!]
  tremorsense_in: [String]
  passive_perception: Int
  tremorsense_gte: String
  truesight_exists: Boolean
  truesight_lte: String
  tremorsense_gt: String
  truesight_gt: String
  blindsight_gte: String
  passive_perception_in: [Int]
  truesight: String
  passive_perception_gte: Int
  truesight_lt: String
  darkvision_lt: String
  blindsight_ne: String
  tremorsense_exists: Boolean
  darkvision_gte: String
  tremorsense_lte: String
  tremorsense_ne: String
  passive_perception_nin: [Int]
  darkvision_ne: String
  passive_perception_gt: Int
  darkvision: String
  truesight_gte: String
  passive_perception_lt: Int
  tremorsense: String
}

enum MonsterSortByInput {
  WISDOM_ASC
  ARMOR_CLASS_ASC
  NAME_ASC
  ALIGNMENT_ASC
  SUBTYPE_DESC
  DEXTERITY_ASC
  WISDOM_DESC
  _ID_DESC
  INDEX_DESC
  NAME_DESC
  CHARISMA_ASC
  TYPE_DESC
  URL_ASC
  HIT_POINTS_ASC
  DEXTERITY_DESC
  CONSTITUTION_DESC
  LANGUAGES_ASC
  XP_DESC
  HIT_DICE_DESC
  CONSTITUTION_ASC
  STRENGTH_DESC
  LANGUAGES_DESC
  TYPE_ASC
  CHALLENGE_RATING_ASC
  CHALLENGE_RATING_DESC
  HIT_DICE_ASC
  INDEX_ASC
  HIT_POINTS_DESC
  CHARISMA_DESC
  SUBTYPE_ASC
  INTELLIGENCE_DESC
  SIZE_ASC
  SIZE_DESC
  STRENGTH_ASC
  URL_DESC
  INTELLIGENCE_ASC
  ALIGNMENT_DESC
  XP_ASC
  _ID_ASC
  ARMOR_CLASS_DESC
}

type MonsterSpecial_ability {
  desc: String
  name: String
}

input MonsterSpecial_abilityQueryInput {
  desc_exists: Boolean
  desc_ne: String
  desc: String
  OR: [MonsterSpecial_abilityQueryInput!]
  desc_in: [String]
  name_nin: [String]
  desc_lte: String
  name: String
  name_lt: String
  name_gte: String
  desc_gt: String
  name_lte: String
  name_exists: Boolean
  desc_lt: String
  name_gt: String
  AND: [MonsterSpecial_abilityQueryInput!]
  name_ne: String
  name_in: [String]
  desc_nin: [String]
  desc_gte: String
}

type MonsterSpeed {
  burrow: String
  climb: String
  fly: String
  hover: Boolean
  swim: String
  walk: String
}

input MonsterSpeedQueryInput {
  climb_lt: String
  hover: Boolean
  swim_nin: [String]
  burrow_ne: String
  fly_ne: String
  fly_lte: String
  walk_gte: String
  walk_ne: String
  walk_gt: String
  fly_gt: String
  climb_in: [String]
  burrow_in: [String]
  climb_ne: String
  burrow_exists: Boolean
  burrow: String
  walk_nin: [String]
  climb_gt: String
  swim_lte: String
  hover_exists: Boolean
  hover_ne: Boolean
  burrow_gte: String
  burrow_lte: String
  fly_gte: String
  walk_lte: String
  burrow_lt: String
  climb_exists: Boolean
  swim_gt: String
  climb_gte: String
  fly_in: [String]
  walk_lt: String
  burrow_gt: String
  fly_lt: String
  swim_exists: Boolean
  swim_gte: String
  walk_in: [String]
  burrow_nin: [String]
  fly_exists: Boolean
  fly: String
  swim_lt: String
  swim_in: [String]
  swim_ne: String
  walk: String
  climb_nin: [String]
  OR: [MonsterSpeedQueryInput!]
  walk_exists: Boolean
  climb_lte: String
  AND: [MonsterSpeedQueryInput!]
  climb: String
  fly_nin: [String]
  swim: String
}

scalar ObjectId

type Proficiency {
  _id: ObjectId
  classes: [ProficiencyClass]
  index: String
  name: String
  races: [ProficiencyRace]
  references: [ProficiencyReference]
  type: String
  url: String
}

type ProficiencyClass {
  index: String
  name: String
  url: String
}

input ProficiencyClassQueryInput {
  name_exists: Boolean
  name_nin: [String]
  url_gt: String
  index_in: [String]
  index_lte: String
  index_exists: Boolean
  url_nin: [String]
  index_lt: String
  index_ne: String
  name_lt: String
  name_ne: String
  url_gte: String
  index_gte: String
  name: String
  name_gte: String
  url_in: [String]
  AND: [ProficiencyClassQueryInput!]
  index: String
  name_lte: String
  name_gt: String
  OR: [ProficiencyClassQueryInput!]
  url_exists: Boolean
  index_gt: String
  url_ne: String
  index_nin: [String]
  url: String
  url_lt: String
  name_in: [String]
  url_lte: String
}

input ProficiencyQueryInput {
  name_gte: String
  url_gt: String
  type_exists: Boolean
  races_nin: [ProficiencyRaceQueryInput]
  type_nin: [String]
  OR: [ProficiencyQueryInput!]
  _id_lte: ObjectId
  url_ne: String
  references_in: [ProficiencyReferenceQueryInput]
  name_in: [String]
  type_in: [String]
  url_lte: String
  name_gt: String
  name_lt: String
  url_lt: String
  url_in: [String]
  _id_gte: ObjectId
  type: String
  url: String
  classes_exists: Boolean
  races: [ProficiencyRaceQueryInput]
  name_lte: String
  name_exists: Boolean
  classes_nin: [ProficiencyClassQueryInput]
  index_lt: String
  _id_lt: ObjectId
  url_nin: [String]
  _id_in: [ObjectId]
  url_exists: Boolean
  references: [ProficiencyReferenceQueryInput]
  _id_exists: Boolean
  index_gt: String
  _id_gt: ObjectId
  _id_nin: [ObjectId]
  index_nin: [String]
  type_gte: String
  name_nin: [String]
  _id: ObjectId
  races_in: [ProficiencyRaceQueryInput]
  name: String
  races_exists: Boolean
  type_ne: String
  type_lt: String
  index_in: [String]
  index_exists: Boolean
  classes_in: [ProficiencyClassQueryInput]
  name_ne: String
  index_lte: String
  index_ne: String
  classes: [ProficiencyClassQueryInput]
  _id_ne: ObjectId
  index: String
  references_exists: Boolean
  type_lte: String
  type_gt: String
  references_nin: [ProficiencyReferenceQueryInput]
  index_gte: String
  url_gte: String
  AND: [ProficiencyQueryInput!]
}

type ProficiencyRace {
  index: String
  name: String
  url: String
}

input ProficiencyRaceQueryInput {
  index_ne: String
  index_gt: String
  url: String
  url_nin: [String]
  name_lte: String
  name_exists: Boolean
  name_in: [String]
  index_exists: Boolean
  url_gt: String
  name: String
  name_nin: [String]
  index_lt: String
  OR: [ProficiencyRaceQueryInput!]
  name_gt: String
  name_ne: String
  index_lte: String
  url_gte: String
  name_lt: String
  url_in: [String]
  index_in: [String]
  url_exists: Boolean
  index_gte: String
  url_lt: String
  index_nin: [String]
  AND: [ProficiencyRaceQueryInput!]
  url_ne: String
  name_gte: String
  url_lte: String
  index: String
}

type ProficiencyReference {
  index: String
  name: String
  type: String
  url: String
}

input ProficiencyReferenceQueryInput {
  url_in: [String]
  name_gt: String
  index_in: [String]
  index_gte: String
  name: String
  type_gte: String
  url_lte: String
  name_nin: [String]
  AND: [ProficiencyReferenceQueryInput!]
  url_gt: String
  index_gt: String
  url_lt: String
  name_exists: Boolean
  type_lte: String
  index_exists: Boolean
  name_lte: String
  index_ne: String
  type_in: [String]
  index: String
  type_gt: String
  url_gte: String
  index_lt: String
  type_nin: [String]
  url_nin: [String]
  OR: [ProficiencyReferenceQueryInput!]
  type_ne: String
  url: String
  name_gte: String
  index_nin: [String]
  index_lte: String
  url_exists: Boolean
  name_in: [String]
  name_ne: String
  type: String
  type_lt: String
  type_exists: Boolean
  url_ne: String
  name_lt: String
}

enum ProficiencySortByInput {
  NAME_ASC
  TYPE_ASC
  _ID_ASC
  _ID_DESC
  NAME_DESC
  TYPE_DESC
  URL_ASC
  URL_DESC
  INDEX_ASC
  INDEX_DESC
}

type Query {
  abilityScore(query: AbilityScoreQueryInput): AbilityScore
  abilityScores(query: AbilityScoreQueryInput, sortBy: AbilityScoreSortByInput): [AbilityScore]!
  class(query: ClassQueryInput): Class
  classes(query: ClassQueryInput, sortBy: ClassSortByInput): [Class]!
  condition(query: ConditionQueryInput): Condition
  conditions(query: ConditionQueryInput, sortBy: ConditionSortByInput): [Condition]!
  damageType(query: DamageTypeQueryInput): DamageType
  damageTypes(query: DamageTypeQueryInput, sortBy: DamageTypeSortByInput): [DamageType]!
  equipment(query: EquipmentQueryInput): Equipment
  equipmentCategories(query: EquipmentCategoryQueryInput, sortBy: EquipmentCategorySortByInput): [EquipmentCategory]!
  equipmentCategory(query: EquipmentCategoryQueryInput): EquipmentCategory
  equipments(query: EquipmentQueryInput, sortBy: EquipmentSortByInput): [Equipment]!
  feature(query: FeatureQueryInput): Feature
  features(sortBy: FeatureSortByInput, query: FeatureQueryInput, limit: Int = 100): [Feature]!
  language(query: LanguageQueryInput): Language
  languages(query: LanguageQueryInput, sortBy: LanguageSortByInput): [Language]!
  level(query: LevelQueryInput): Level
  levels(query: LevelQueryInput, sortBy: LevelSortByInput): [Level]!
  magicItem(query: MagicItemQueryInput): MagicItem
  magicItems(query: MagicItemQueryInput, sortBy: MagicItemSortByInput): [MagicItem]!
  magicSchool(query: MagicSchoolQueryInput): MagicSchool
  magicSchools(query: MagicSchoolQueryInput, sortBy: MagicSchoolSortByInput): [MagicSchool]!
  monster(query: MonsterQueryInput): Monster
  monsters(query: MonsterQueryInput, sortBy: MonsterSortByInput): [Monster]!
  proficiencies(query: ProficiencyQueryInput, sortBy: ProficiencySortByInput): [Proficiency]!
  proficiency(query: ProficiencyQueryInput): Proficiency
  rule(query: RuleQueryInput): Rule
  ruleSection(query: RuleSectionQueryInput): RuleSection
  ruleSections(query: RuleSectionQueryInput, sortBy: RuleSectionSortByInput): [RuleSection]!
  rules(query: RuleQueryInput, sortBy: RuleSortByInput): [Rule]!
  skill(query: SkillQueryInput): Skill
  skills(sortBy: SkillSortByInput, query: SkillQueryInput): [Skill]!
  spell(query: SpellQueryInput): Spell
  spells(query: SpellQueryInput, sortBy: SpellSortByInput): [Spell]!
  startingequipment(query: StartingequipmentQueryInput): Startingequipment
  startingequipments(sortBy: StartingequipmentSortByInput, query: StartingequipmentQueryInput): [Startingequipment]!
  subclass(query: SubclassQueryInput): Subclass
  subclasses(sortBy: SubclassSortByInput, query: SubclassQueryInput): [Subclass]!
  subrace(query: SubraceQueryInput): Subrace
  subraces(sortBy: SubraceSortByInput, query: SubraceQueryInput): [Subrace]!
  trait(query: TraitQueryInput): Trait
  traits(query: TraitQueryInput, sortBy: TraitSortByInput): [Trait]!
  weaponProperties(query: WeaponPropertyQueryInput, sortBy: WeaponPropertySortByInput): [WeaponProperty]!
  weaponProperty(query: WeaponPropertyQueryInput): WeaponProperty
}

type Rule {
  _id: ObjectId
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
  _id_lte: ObjectId
  url_lte: String
  url_exists: Boolean
  desc_ne: String
  desc_gte: String
  index_gt: String
  url_gt: String
  name_ne: String
  url_nin: [String]
  desc: String
  _id: ObjectId
  index: String
  _id_gte: ObjectId
  name_nin: [String]
  desc_gt: String
  index_in: [String]
  _id_in: [ObjectId]
  index_nin: [String]
  index_gte: String
  OR: [RuleQueryInput!]
  url_in: [String]
  url_lt: String
  desc_lte: String
  _id_gt: ObjectId
  url_ne: String
  url: String
  index_lt: String
  name_in: [String]
  name_exists: Boolean
  name_lte: String
  desc_exists: Boolean
  desc_lt: String
  _id_ne: ObjectId
  name: String
  _id_lt: ObjectId
  desc_nin: [String]
  subsections: [RuleSubsectionQueryInput]
  _id_exists: Boolean
  name_gte: String
  AND: [RuleQueryInput!]
  url_gte: String
  subsections_exists: Boolean
  subsections_in: [RuleSubsectionQueryInput]
  _id_nin: [ObjectId]
  name_lt: String
  index_lte: String
  name_gt: String
}

type RuleSection {
  _id: ObjectId
  desc: String
  index: String
  name: String
  url: String
}

input RuleSectionQueryInput {
  name_lte: String
  index_nin: [String]
  _id_ne: ObjectId
  _id_in: [ObjectId]
  name_nin: [String]
  _id_lt: ObjectId
  url_lt: String
  _id_gt: ObjectId
  desc_gt: String
  index_gt: String
  index_exists: Boolean
  desc: String
  index_in: [String]
  index_gte: String
  name_ne: String
  index: String
  url_lte: String
  url_ne: String
  url_gte: String
  desc_lt: String
  _id_lte: ObjectId
  name_gte: String
  _id_gte: ObjectId
  url_nin: [String]
  url_gt: String
  url: String
  desc_in: [String]
  desc_nin: [String]
  index_ne: String
  name: String
  desc_gte: String
  url_exists: Boolean
  name_exists: Boolean
  desc_exists: Boolean
  _id_nin: [ObjectId]
  url_in: [String]
  desc_ne: String
  index_lte: String
  AND: [RuleSectionQueryInput!]
  _id_exists: Boolean
  OR: [RuleSectionQueryInput!]
  name_gt: String
  desc_lte: String
  index_lt: String
  name_in: [String]
  name_lt: String
  _id: ObjectId
}

enum RuleSectionSortByInput {
  NAME_DESC
  URL_ASC
  _ID_ASC
  DESC_ASC
  DESC_DESC
  INDEX_ASC
  NAME_ASC
  _ID_DESC
  INDEX_DESC
  URL_DESC
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

type Skill {
  _id: ObjectId
  ability_score: SkillAbility_score
  desc: [String]
  index: String
  name: String
  url: String
}

type SkillAbility_score {
  index: String
  name: String
  url: String
}

input SkillAbility_scoreQueryInput {
  name: String
  url_lt: String
  url: String
  name_ne: String
  url_ne: String
  url_gte: String
  url_lte: String
  index_lt: String
  index_exists: Boolean
  index_ne: String
  index: String
  url_nin: [String]
  url_exists: Boolean
  index_lte: String
  OR: [SkillAbility_scoreQueryInput!]
  name_lt: String
  AND: [SkillAbility_scoreQueryInput!]
  name_nin: [String]
  name_exists: Boolean
  name_gt: String
  index_in: [String]
  url_gt: String
  url_in: [String]
  index_gt: String
  name_gte: String
  index_nin: [String]
  index_gte: String
  name_in: [String]
  name_lte: String
}

input SkillQueryInput {
  index_gte: String
  desc_nin: [String]
  url_ne: String
  ability_score: SkillAbility_scoreQueryInput
  url_exists: Boolean
  url: String
  url_in: [String]
  _id_lte: ObjectId
  _id_in: [ObjectId]
  _id_ne: ObjectId
  name_nin: [String]
  url_nin: [String]
  index_exists: Boolean
  index_lte: String
  ability_score_exists: Boolean
  url_lt: String
  _id_lt: ObjectId
  index_gt: String
  index: String
  _id_exists: Boolean
  name_gte: String
  _id_gte: ObjectId
  name_ne: String
  desc: [String]
  desc_in: [String]
  name_lte: String
  _id: ObjectId
  _id_gt: ObjectId
  name_lt: String
  _id_nin: [ObjectId]
  index_ne: String
  name_in: [String]
  OR: [SkillQueryInput!]
  url_gte: String
  index_nin: [String]
  index_in: [String]
  name: String
  url_gt: String
  url_lte: String
  name_gt: String
  index_lt: String
  desc_exists: Boolean
  AND: [SkillQueryInput!]
  name_exists: Boolean
}

enum SkillSortByInput {
  NAME_ASC
  NAME_DESC
  URL_ASC
  URL_DESC
  _ID_ASC
  _ID_DESC
  INDEX_ASC
  INDEX_DESC
}

type Spell {
  _id: ObjectId
  area_of_effect: SpellArea_of_effect
  attack_type: String
  casting_time: String
  classes: [SpellClass]
  components: [String]
  concentration: Boolean
  damage: SpellDamage
  dc: SpellDc
  desc: [String]
  duration: String
  higher_level: [String]
  index: String
  level: Int
  material: String
  name: String
  range: String
  ritual: Boolean
  school: SpellSchool
  subclasses: [SpellSubclass]
  url: String
}

type SpellArea_of_effect {
  size: Int
  type: String
}

input SpellArea_of_effectQueryInput {
  type: String
  type_exists: Boolean
  OR: [SpellArea_of_effectQueryInput!]
  type_gte: String
  size_gt: Int
  size_gte: Int
  size_in: [Int]
  type_gt: String
  size_ne: Int
  type_lt: String
  type_nin: [String]
  AND: [SpellArea_of_effectQueryInput!]
  size_lt: Int
  type_ne: String
  size: Int
  size_exists: Boolean
  size_nin: [Int]
  type_lte: String
  type_in: [String]
  size_lte: Int
}

type SpellClass {
  index: String
  name: String
  url: String
}

input SpellClassQueryInput {
  url_ne: String
  url_nin: [String]
  index: String
  name_in: [String]
  index_in: [String]
  name_ne: String
  url_in: [String]
  index_gte: String
  name: String
  index_lt: String
  name_lt: String
  name_lte: String
  OR: [SpellClassQueryInput!]
  index_ne: String
  url_gte: String
  name_gt: String
  url: String
  index_exists: Boolean
  index_lte: String
  url_gt: String
  name_nin: [String]
  url_exists: Boolean
  index_nin: [String]
  name_exists: Boolean
  url_lte: String
  index_gt: String
  name_gte: String
  url_lt: String
  AND: [SpellClassQueryInput!]
}

type SpellDamage {
  damage_type: SpellDamageDamage_type
}

type SpellDamageDamage_type {
  index: String
  name: String
  url: String
}

input SpellDamageDamage_typeQueryInput {
  name_in: [String]
  index_lt: String
  index_nin: [String]
  url_gt: String
  name_lt: String
  url_exists: Boolean
  index_gt: String
  index_exists: Boolean
  name_gt: String
  url_ne: String
  index_in: [String]
  url_lte: String
  name_gte: String
  OR: [SpellDamageDamage_typeQueryInput!]
  name_exists: Boolean
  url_gte: String
  name: String
  name_lte: String
  index_lte: String
  name_ne: String
  index_ne: String
  name_nin: [String]
  index_gte: String
  url_nin: [String]
  AND: [SpellDamageDamage_typeQueryInput!]
  index: String
  url: String
  url_in: [String]
  url_lt: String
}

input SpellDamageQueryInput {
  damage_type: SpellDamageDamage_typeQueryInput
  damage_type_exists: Boolean
  AND: [SpellDamageQueryInput!]
  OR: [SpellDamageQueryInput!]
}

type SpellDc {
  dc_success: String
  dc_type: SpellDcDc_type
  desc: String
}

type SpellDcDc_type {
  index: String
  name: String
  url: String
}

input SpellDcDc_typeQueryInput {
  index_gte: String
  name_nin: [String]
  url_gt: String
  name_gt: String
  url_lt: String
  index_exists: Boolean
  url: String
  index_in: [String]
  name_lt: String
  name_exists: Boolean
  index_lte: String
  url_exists: Boolean
  url_gte: String
  OR: [SpellDcDc_typeQueryInput!]
  index_gt: String
  url_in: [String]
  name_ne: String
  url_ne: String
  index_lt: String
  index_ne: String
  url_nin: [String]
  url_lte: String
  index_nin: [String]
  AND: [SpellDcDc_typeQueryInput!]
  name: String
  index: String
  name_lte: String
  name_in: [String]
  name_gte: String
}

input SpellDcQueryInput {
  AND: [SpellDcQueryInput!]
  desc_exists: Boolean
  desc: String
  dc_success_gte: String
  desc_ne: String
  dc_success_ne: String
  desc_nin: [String]
  desc_gt: String
  dc_type: SpellDcDc_typeQueryInput
  dc_success_gt: String
  desc_lt: String
  desc_gte: String
  dc_success: String
  dc_success_exists: Boolean
  dc_success_lt: String
  dc_success_nin: [String]
  desc_lte: String
  OR: [SpellDcQueryInput!]
  dc_type_exists: Boolean
  dc_success_in: [String]
  dc_success_lte: String
  desc_in: [String]
}

input SpellQueryInput {
  damage: SpellDamageQueryInput
  dc: SpellDcQueryInput
  attack_type_gte: String
  duration: String
  index: String
  url: String
  duration_gt: String
  subclasses_exists: Boolean
  index_nin: [String]
  material_exists: Boolean
  url_gt: String
  _id_lte: ObjectId
  range_lte: String
  AND: [SpellQueryInput!]
  duration_lt: String
  range_gte: String
  components_exists: Boolean
  range_exists: Boolean
  casting_time_gt: String
  attack_type_in: [String]
  material_lte: String
  url_exists: Boolean
  casting_time: String
  _id_ne: ObjectId
  attack_type_lt: String
  name_lt: String
  casting_time_ne: String
  level_ne: Int
  name_in: [String]
  components_nin: [String]
  attack_type: String
  area_of_effect_exists: Boolean
  classes: [SpellClassQueryInput]
  material: String
  name_lte: String
  ritual: Boolean
  classes_exists: Boolean
  subclasses: [SpellSubclassQueryInput]
  level_in: [Int]
  school: SpellSchoolQueryInput
  url_nin: [String]
  name_gte: String
  ritual_ne: Boolean
  subclasses_in: [SpellSubclassQueryInput]
  damage_exists: Boolean
  desc_nin: [String]
  casting_time_nin: [String]
  _id_nin: [ObjectId]
  index_exists: Boolean
  attack_type_gt: String
  duration_gte: String
  attack_type_exists: Boolean
  desc: [String]
  material_lt: String
  level_gte: Int
  level_exists: Boolean
  desc_in: [String]
  concentration_exists: Boolean
  classes_nin: [SpellClassQueryInput]
  classes_in: [SpellClassQueryInput]
  url_lt: String
  casting_time_lte: String
  index_gt: String
  school_exists: Boolean
  range_lt: String
  url_ne: String
  range_nin: [String]
  url_gte: String
  dc_exists: Boolean
  OR: [SpellQueryInput!]
  duration_exists: Boolean
  concentration_ne: Boolean
  duration_nin: [String]
  name_nin: [String]
  range_gt: String
  attack_type_ne: String
  level_lte: Int
  material_gt: String
  material_in: [String]
  attack_type_nin: [String]
  range: String
  higher_level_in: [String]
  _id_gte: ObjectId
  index_gte: String
  url_in: [String]
  higher_level: [String]
  attack_type_lte: String
  name_gt: String
  index_in: [String]
  ritual_exists: Boolean
  components: [String]
  subclasses_nin: [SpellSubclassQueryInput]
  desc_exists: Boolean
  range_ne: String
  _id: ObjectId
  higher_level_nin: [String]
  index_lt: String
  duration_ne: String
  name_ne: String
  casting_time_lt: String
  _id_lt: ObjectId
  _id_in: [ObjectId]
  level_lt: Int
  level_gt: Int
  name: String
  range_in: [String]
  level_nin: [Int]
  casting_time_gte: String
  _id_exists: Boolean
  url_lte: String
  level: Int
  material_ne: String
  material_nin: [String]
  material_gte: String
  duration_in: [String]
  casting_time_exists: Boolean
  name_exists: Boolean
  higher_level_exists: Boolean
  components_in: [String]
  concentration: Boolean
  area_of_effect: SpellArea_of_effectQueryInput
  casting_time_in: [String]
  _id_gt: ObjectId
  index_lte: String
  index_ne: String
  duration_lte: String
}

type SpellSchool {
  index: String
  name: String
  url: String
}

input SpellSchoolQueryInput {
  name_nin: [String]
  name_gt: String
  url_in: [String]
  url_gte: String
  index_nin: [String]
  name: String
  name_ne: String
  index_ne: String
  url_lt: String
  index_gt: String
  url: String
  index_lte: String
  index_exists: Boolean
  url_nin: [String]
  index_gte: String
  name_in: [String]
  name_exists: Boolean
  url_gt: String
  OR: [SpellSchoolQueryInput!]
  AND: [SpellSchoolQueryInput!]
  index_in: [String]
  index: String
  url_exists: Boolean
  name_lt: String
  url_ne: String
  name_gte: String
  name_lte: String
  index_lt: String
  url_lte: String
}

enum SpellSortByInput {
  RANGE_ASC
  CASTING_TIME_ASC
  CASTING_TIME_DESC
  LEVEL_ASC
  LEVEL_DESC
  URL_ASC
  URL_DESC
  NAME_ASC
  NAME_DESC
  MATERIAL_ASC
  _ID_ASC
  DURATION_ASC
  INDEX_ASC
  INDEX_DESC
  _ID_DESC
  DURATION_DESC
  ATTACK_TYPE_DESC
  MATERIAL_DESC
  RANGE_DESC
  ATTACK_TYPE_ASC
}

type SpellSubclass {
  index: String
  name: String
  url: String
}

input SpellSubclassQueryInput {
  index: String
  name_lt: String
  url_nin: [String]
  name_nin: [String]
  url: String
  index_gt: String
  index_gte: String
  name_ne: String
  AND: [SpellSubclassQueryInput!]
  url_in: [String]
  url_lte: String
  url_lt: String
  index_ne: String
  name_in: [String]
  OR: [SpellSubclassQueryInput!]
  name_lte: String
  url_ne: String
  name_gt: String
  index_lte: String
  name_exists: Boolean
  index_exists: Boolean
  url_gte: String
  index_lt: String
  index_nin: [String]
  name: String
  index_in: [String]
  url_gt: String
  name_gte: String
  url_exists: Boolean
}

type Startingequipment {
  _id: ObjectId
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
  _id_lte: ObjectId
  url_ne: String
  _id_lt: ObjectId
  _id_in: [ObjectId]
  index: String
  url_gt: String
  _id_gt: ObjectId
  _id_gte: ObjectId
  url_exists: Boolean
  AND: [StartingequipmentQueryInput!]
  starting_equipment_options: [StartingequipmentStarting_equipment_optionQueryInput]
  _id: ObjectId
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
  _id_nin: [ObjectId]
  url_nin: [String]
  starting_equipment_nin: [StartingequipmentStarting_equipmentQueryInput]
  _id_ne: ObjectId
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

type Subclass {
  _id: ObjectId
  class: SubclassClass
  desc: [String]
  index: String
  name: String
  spells: [SubclassSpell]
  subclass_flavor: String
  subclass_levels: String
  url: String
}

type SubclassClass {
  index: String
  name: String
  url: String
}

input SubclassClassQueryInput {
  AND: [SubclassClassQueryInput!]
  index_gt: String
  index_in: [String]
  url_exists: Boolean
  name: String
  index_nin: [String]
  name_ne: String
  url_lte: String
  index: String
  url_in: [String]
  name_gt: String
  OR: [SubclassClassQueryInput!]
  name_in: [String]
  index_lte: String
  name_nin: [String]
  name_exists: Boolean
  name_lte: String
  name_gte: String
  index_lt: String
  url: String
  name_lt: String
  url_nin: [String]
  index_gte: String
  url_gt: String
  index_exists: Boolean
  url_ne: String
  url_lt: String
  index_ne: String
  url_gte: String
}

input SubclassQueryInput {
  index_nin: [String]
  subclass_flavor: String
  _id_exists: Boolean
  index_lte: String
  url_exists: Boolean
  subclass_flavor_in: [String]
  subclass_flavor_lte: String
  subclass_flavor_gte: String
  index_gte: String
  url_nin: [String]
  _id_gte: ObjectId
  index_lt: String
  index_ne: String
  _id_nin: [ObjectId]
  subclass_levels_in: [String]
  url_lt: String
  _id_lte: ObjectId
  subclass_flavor_lt: String
  index: String
  name_exists: Boolean
  subclass_levels_exists: Boolean
  subclass_levels_gt: String
  spells: [SubclassSpellQueryInput]
  url_lte: String
  subclass_levels_nin: [String]
  url_in: [String]
  subclass_levels_lt: String
  OR: [SubclassQueryInput!]
  url_ne: String
  url_gte: String
  name_in: [String]
  subclass_flavor_ne: String
  name_gt: String
  name_nin: [String]
  subclass_levels: String
  name_gte: String
  name_lte: String
  index_exists: Boolean
  class_exists: Boolean
  _id_in: [ObjectId]
  _id_gt: ObjectId
  _id_lt: ObjectId
  desc_exists: Boolean
  _id: ObjectId
  AND: [SubclassQueryInput!]
  class: SubclassClassQueryInput
  subclass_levels_ne: String
  spells_in: [SubclassSpellQueryInput]
  index_in: [String]
  desc_nin: [String]
  desc: [String]
  index_gt: String
  spells_exists: Boolean
  name_lt: String
  subclass_flavor_nin: [String]
  url: String
  subclass_levels_lte: String
  name_ne: String
  subclass_flavor_gt: String
  desc_in: [String]
  _id_ne: ObjectId
  subclass_levels_gte: String
  name: String
  subclass_flavor_exists: Boolean
  url_gt: String
  spells_nin: [SubclassSpellQueryInput]
}

enum SubclassSortByInput {
  URL_DESC
  INDEX_ASC
  _ID_ASC
  NAME_ASC
  NAME_DESC
  SUBCLASS_FLAVOR_ASC
  SUBCLASS_LEVELS_DESC
  URL_ASC
  INDEX_DESC
  _ID_DESC
  SUBCLASS_FLAVOR_DESC
  SUBCLASS_LEVELS_ASC
}

type SubclassSpell {
  prerequisites: [SubclassSpellPrerequisite]
  spell: SubclassSpellSpell
}

type SubclassSpellPrerequisite {
  index: String
  name: String
  type: String
  url: String
}

input SubclassSpellPrerequisiteQueryInput {
  type_in: [String]
  type_ne: String
  index_exists: Boolean
  index_nin: [String]
  name_ne: String
  name_exists: Boolean
  index_in: [String]
  index: String
  name_gt: String
  url_in: [String]
  url_gt: String
  url_lt: String
  name_lt: String
  index_lt: String
  type_gt: String
  name_nin: [String]
  name_gte: String
  type_exists: Boolean
  url: String
  url_nin: [String]
  index_gt: String
  OR: [SubclassSpellPrerequisiteQueryInput!]
  name: String
  name_lte: String
  type_gte: String
  type_lte: String
  type: String
  index_gte: String
  name_in: [String]
  AND: [SubclassSpellPrerequisiteQueryInput!]
  url_gte: String
  index_ne: String
  type_lt: String
  type_nin: [String]
  url_exists: Boolean
  url_ne: String
  index_lte: String
  url_lte: String
}

input SubclassSpellQueryInput {
  prerequisites: [SubclassSpellPrerequisiteQueryInput]
  prerequisites_in: [SubclassSpellPrerequisiteQueryInput]
  prerequisites_nin: [SubclassSpellPrerequisiteQueryInput]
  prerequisites_exists: Boolean
  AND: [SubclassSpellQueryInput!]
  OR: [SubclassSpellQueryInput!]
  spell: SubclassSpellSpellQueryInput
  spell_exists: Boolean
}

type SubclassSpellSpell {
  index: String
  name: String
  url: String
}

input SubclassSpellSpellQueryInput {
  index_nin: [String]
  OR: [SubclassSpellSpellQueryInput!]
  name_gt: String
  name_in: [String]
  name_lt: String
  index: String
  url_exists: Boolean
  url_lte: String
  name_gte: String
  index_ne: String
  name_lte: String
  url_nin: [String]
  index_lte: String
  url_ne: String
  index_exists: Boolean
  index_lt: String
  index_in: [String]
  url_lt: String
  url_gt: String
  url_in: [String]
  name_exists: Boolean
  AND: [SubclassSpellSpellQueryInput!]
  name: String
  index_gte: String
  name_nin: [String]
  url: String
  name_ne: String
  url_gte: String
  index_gt: String
}

type Subrace {
  _id: ObjectId
  ability_bonuses: [SubraceAbility_bonuse]
  desc: String
  index: String
  language_options: SubraceLanguage_option
  name: String
  race: SubraceRace
  racial_trait_options: SubraceRacial_trait_option
  racial_traits: [SubraceRacial_trait]
  starting_proficiencies: [SubraceStarting_proficiency]
  url: String
}

type SubraceAbility_bonuse {
  ability_score: SubraceAbility_bonuseAbility_score
  bonus: Int
}

type SubraceAbility_bonuseAbility_score {
  index: String
  name: String
  url: String
}

input SubraceAbility_bonuseAbility_scoreQueryInput {
  name_exists: Boolean
  index: String
  index_exists: Boolean
  name_nin: [String]
  index_gt: String
  index_nin: [String]
  name_ne: String
  index_lt: String
  url_ne: String
  url_nin: [String]
  index_in: [String]
  index_ne: String
  name: String
  url_gte: String
  url_lt: String
  AND: [SubraceAbility_bonuseAbility_scoreQueryInput!]
  name_gt: String
  index_gte: String
  OR: [SubraceAbility_bonuseAbility_scoreQueryInput!]
  name_lte: String
  name_lt: String
  name_gte: String
  index_lte: String
  url_gt: String
  url_lte: String
  url: String
  name_in: [String]
  url_in: [String]
  url_exists: Boolean
}

input SubraceAbility_bonuseQueryInput {
  bonus_exists: Boolean
  bonus_ne: Int
  bonus_gte: Int
  ability_score_exists: Boolean
  bonus_lte: Int
  bonus_nin: [Int]
  bonus_in: [Int]
  ability_score: SubraceAbility_bonuseAbility_scoreQueryInput
  AND: [SubraceAbility_bonuseQueryInput!]
  bonus: Int
  bonus_lt: Int
  OR: [SubraceAbility_bonuseQueryInput!]
  bonus_gt: Int
}

type SubraceLanguage_option {
  choose: Int
  from: [SubraceLanguage_optionFrom]
  type: String
}

type SubraceLanguage_optionFrom {
  index: String
  name: String
  url: String
}

input SubraceLanguage_optionFromQueryInput {
  index_nin: [String]
  name_gte: String
  url_gt: String
  index_gte: String
  index_in: [String]
  name_lte: String
  OR: [SubraceLanguage_optionFromQueryInput!]
  AND: [SubraceLanguage_optionFromQueryInput!]
  url_lte: String
  url_ne: String
  name_nin: [String]
  index_gt: String
  url_in: [String]
  name_ne: String
  name_lt: String
  url_exists: Boolean
  name_in: [String]
  url_lt: String
  name: String
  index: String
  url_gte: String
  index_ne: String
  url_nin: [String]
  url: String
  index_lte: String
  index_exists: Boolean
  index_lt: String
  name_exists: Boolean
  name_gt: String
}

input SubraceLanguage_optionQueryInput {
  type_exists: Boolean
  OR: [SubraceLanguage_optionQueryInput!]
  type_lt: String
  choose_exists: Boolean
  type_nin: [String]
  choose: Int
  type: String
  choose_gt: Int
  choose_lte: Int
  AND: [SubraceLanguage_optionQueryInput!]
  choose_in: [Int]
  choose_nin: [Int]
  type_ne: String
  from_exists: Boolean
  from_nin: [SubraceLanguage_optionFromQueryInput]
  choose_gte: Int
  type_lte: String
  choose_lt: Int
  type_gt: String
  type_gte: String
  type_in: [String]
  choose_ne: Int
  from: [SubraceLanguage_optionFromQueryInput]
  from_in: [SubraceLanguage_optionFromQueryInput]
}

input SubraceQueryInput {
  index_in: [String]
  index_nin: [String]
  desc: String
  desc_lte: String
  racial_traits_in: [SubraceRacial_traitQueryInput]
  name_ne: String
  url_gte: String
  index_lte: String
  _id_lte: ObjectId
  racial_trait_options: SubraceRacial_trait_optionQueryInput
  language_options_exists: Boolean
  url_exists: Boolean
  AND: [SubraceQueryInput!]
  starting_proficiencies: [SubraceStarting_proficiencyQueryInput]
  desc_gt: String
  name_lte: String
  racial_trait_options_exists: Boolean
  desc_lt: String
  _id_gte: ObjectId
  index: String
  _id_in: [ObjectId]
  index_exists: Boolean
  _id_gt: ObjectId
  _id_exists: Boolean
  name_nin: [String]
  name_lt: String
  language_options: SubraceLanguage_optionQueryInput
  url_ne: String
  ability_bonuses: [SubraceAbility_bonuseQueryInput]
  starting_proficiencies_exists: Boolean
  _id_ne: ObjectId
  desc_ne: String
  name_in: [String]
  starting_proficiencies_nin: [SubraceStarting_proficiencyQueryInput]
  index_gte: String
  starting_proficiencies_in: [SubraceStarting_proficiencyQueryInput]
  url_in: [String]
  name: String
  name_exists: Boolean
  url_gt: String
  name_gt: String
  desc_nin: [String]
  index_gt: String
  _id_nin: [ObjectId]
  name_gte: String
  index_lt: String
  url_nin: [String]
  desc_in: [String]
  desc_exists: Boolean
  _id: ObjectId
  race_exists: Boolean
  race: SubraceRaceQueryInput
  racial_traits_nin: [SubraceRacial_traitQueryInput]
  OR: [SubraceQueryInput!]
  url_lt: String
  desc_gte: String
  url: String
  index_ne: String
  url_lte: String
  _id_lt: ObjectId
  racial_traits: [SubraceRacial_traitQueryInput]
  racial_traits_exists: Boolean
  ability_bonuses_in: [SubraceAbility_bonuseQueryInput]
  ability_bonuses_nin: [SubraceAbility_bonuseQueryInput]
  ability_bonuses_exists: Boolean
}

type SubraceRace {
  index: String
  name: String
  url: String
}

input SubraceRaceQueryInput {
  index_lt: String
  name_in: [String]
  index_lte: String
  index: String
  url: String
  index_exists: Boolean
  name_nin: [String]
  index_in: [String]
  index_ne: String
  name_ne: String
  AND: [SubraceRaceQueryInput!]
  index_gt: String
  url_gte: String
  url_lt: String
  name_lte: String
  url_gt: String
  index_gte: String
  url_ne: String
  name_lt: String
  OR: [SubraceRaceQueryInput!]
  url_nin: [String]
  url_lte: String
  name_exists: Boolean
  url_exists: Boolean
  name: String
  url_in: [String]
  name_gt: String
  name_gte: String
  index_nin: [String]
}

type SubraceRacial_trait {
  index: String
  name: String
  url: String
}

type SubraceRacial_trait_option {
  choose: Int
  from: [SubraceRacial_trait_optionFrom]
  type: String
}

type SubraceRacial_trait_optionFrom {
  index: String
  name: String
  url: String
}

input SubraceRacial_trait_optionFromQueryInput {
  index_gt: String
  url_lte: String
  url_nin: [String]
  index_gte: String
  url_ne: String
  index_lte: String
  name_lt: String
  url_gte: String
  index_ne: String
  name_in: [String]
  name_nin: [String]
  name: String
  name_lte: String
  index: String
  index_nin: [String]
  url: String
  index_in: [String]
  url_gt: String
  url_exists: Boolean
  OR: [SubraceRacial_trait_optionFromQueryInput!]
  index_exists: Boolean
  name_exists: Boolean
  name_ne: String
  AND: [SubraceRacial_trait_optionFromQueryInput!]
  index_lt: String
  url_lt: String
  name_gte: String
  name_gt: String
  url_in: [String]
}

input SubraceRacial_trait_optionQueryInput {
  type_in: [String]
  choose_in: [Int]
  choose_gt: Int
  type_lte: String
  choose: Int
  choose_gte: Int
  from: [SubraceRacial_trait_optionFromQueryInput]
  type: String
  from_nin: [SubraceRacial_trait_optionFromQueryInput]
  type_nin: [String]
  type_exists: Boolean
  type_ne: String
  type_gte: String
  choose_lt: Int
  choose_exists: Boolean
  from_in: [SubraceRacial_trait_optionFromQueryInput]
  choose_nin: [Int]
  type_gt: String
  AND: [SubraceRacial_trait_optionQueryInput!]
  choose_lte: Int
  OR: [SubraceRacial_trait_optionQueryInput!]
  choose_ne: Int
  from_exists: Boolean
  type_lt: String
}

input SubraceRacial_traitQueryInput {
  index_lte: String
  name_in: [String]
  url_in: [String]
  name_lt: String
  url_lt: String
  index_exists: Boolean
  index_lt: String
  url_ne: String
  index_nin: [String]
  name_gt: String
  url_lte: String
  name: String
  name_lte: String
  AND: [SubraceRacial_traitQueryInput!]
  index_gt: String
  index_ne: String
  url_gte: String
  name_ne: String
  index: String
  url_exists: Boolean
  index_gte: String
  url_gt: String
  url_nin: [String]
  name_exists: Boolean
  name_nin: [String]
  url: String
  name_gte: String
  OR: [SubraceRacial_traitQueryInput!]
  index_in: [String]
}

enum SubraceSortByInput {
  _ID_DESC
  DESC_ASC
  NAME_DESC
  _ID_ASC
  DESC_DESC
  NAME_ASC
  URL_ASC
  URL_DESC
  INDEX_ASC
  INDEX_DESC
}

type SubraceStarting_proficiency {
  index: String
  name: String
  url: String
}

input SubraceStarting_proficiencyQueryInput {
  index_in: [String]
  index_lt: String
  url_gte: String
  url_lte: String
  url_nin: [String]
  name_exists: Boolean
  index_exists: Boolean
  name_lte: String
  index_lte: String
  AND: [SubraceStarting_proficiencyQueryInput!]
  name_gte: String
  url_lt: String
  index: String
  OR: [SubraceStarting_proficiencyQueryInput!]
  index_gte: String
  name_gt: String
  url: String
  url_in: [String]
  index_nin: [String]
  url_gt: String
  name_lt: String
  index_gt: String
  url_exists: Boolean
  url_ne: String
  name: String
  index_ne: String
  name_nin: [String]
  name_ne: String
  name_in: [String]
}

type Trait {
  _id: ObjectId
  desc: [String]
  index: String
  name: String
  proficiencies: [TraitProficiency]
  proficiency_choices: TraitProficiency_choice
  races: [TraitRace]
  subraces: [TraitSubrace]
  url: String
}

type TraitProficiency {
  index: String
  name: String
  url: String
}

type TraitProficiency_choice {
  choose: Int
  from: [TraitProficiency_choiceFrom]
  type: String
}

type TraitProficiency_choiceFrom {
  index: String
  name: String
  url: String
}

input TraitProficiency_choiceFromQueryInput {
  index_nin: [String]
  url_exists: Boolean
  url_ne: String
  url_nin: [String]
  name_nin: [String]
  index_lt: String
  url_lt: String
  index_lte: String
  name: String
  url_gt: String
  name_exists: Boolean
  name_lte: String
  name_gte: String
  url_in: [String]
  name_lt: String
  index_in: [String]
  name_ne: String
  name_in: [String]
  url_gte: String
  index_ne: String
  url_lte: String
  index_gt: String
  index: String
  OR: [TraitProficiency_choiceFromQueryInput!]
  name_gt: String
  index_exists: Boolean
  url: String
  AND: [TraitProficiency_choiceFromQueryInput!]
  index_gte: String
}

input TraitProficiency_choiceQueryInput {
  from: [TraitProficiency_choiceFromQueryInput]
  choose_gt: Int
  type: String
  OR: [TraitProficiency_choiceQueryInput!]
  AND: [TraitProficiency_choiceQueryInput!]
  choose_gte: Int
  from_nin: [TraitProficiency_choiceFromQueryInput]
  choose_ne: Int
  type_in: [String]
  type_ne: String
  choose: Int
  from_in: [TraitProficiency_choiceFromQueryInput]
  type_lte: String
  choose_in: [Int]
  choose_lte: Int
  type_exists: Boolean
  choose_lt: Int
  type_gt: String
  choose_nin: [Int]
  choose_exists: Boolean
  type_lt: String
  from_exists: Boolean
  type_nin: [String]
  type_gte: String
}

input TraitProficiencyQueryInput {
  url_in: [String]
  index_nin: [String]
  name: String
  name_ne: String
  AND: [TraitProficiencyQueryInput!]
  index_ne: String
  name_gte: String
  name_lte: String
  index: String
  index_exists: Boolean
  index_lt: String
  url_lte: String
  index_lte: String
  url_ne: String
  name_gt: String
  name_nin: [String]
  url_exists: Boolean
  index_gte: String
  OR: [TraitProficiencyQueryInput!]
  url: String
  url_nin: [String]
  name_lt: String
  name_in: [String]
  name_exists: Boolean
  url_lt: String
  url_gt: String
  url_gte: String
  index_in: [String]
  index_gt: String
}

input TraitQueryInput {
  name_nin: [String]
  index: String
  subraces_nin: [TraitSubraceQueryInput]
  _id_lt: ObjectId
  _id_exists: Boolean
  _id_nin: [ObjectId]
  proficiencies: [TraitProficiencyQueryInput]
  _id_lte: ObjectId
  index_gt: String
  url_in: [String]
  index_ne: String
  url_lte: String
  subraces_in: [TraitSubraceQueryInput]
  url_exists: Boolean
  name_exists: Boolean
  races: [TraitRaceQueryInput]
  url_gt: String
  url_lt: String
  proficiency_choices_exists: Boolean
  name_lte: String
  proficiencies_in: [TraitProficiencyQueryInput]
  name_gt: String
  index_nin: [String]
  proficiencies_exists: Boolean
  desc_in: [String]
  races_exists: Boolean
  name_gte: String
  _id_ne: ObjectId
  desc: [String]
  _id: ObjectId
  name_ne: String
  index_gte: String
  races_nin: [TraitRaceQueryInput]
  AND: [TraitQueryInput!]
  proficiency_choices: TraitProficiency_choiceQueryInput
  url_ne: String
  url_gte: String
  name_lt: String
  OR: [TraitQueryInput!]
  name_in: [String]
  _id_gte: ObjectId
  _id_gt: ObjectId
  _id_in: [ObjectId]
  races_in: [TraitRaceQueryInput]
  subraces: [TraitSubraceQueryInput]
  index_lt: String
  name: String
  desc_nin: [String]
  index_lte: String
  subraces_exists: Boolean
  url: String
  index_in: [String]
  index_exists: Boolean
  proficiencies_nin: [TraitProficiencyQueryInput]
  desc_exists: Boolean
  url_nin: [String]
}

type TraitRace {
  index: String
  name: String
  url: String
}

input TraitRaceQueryInput {
  name: String
  index_exists: Boolean
  url_in: [String]
  url_exists: Boolean
  index_lt: String
  name_lte: String
  index_in: [String]
  url_nin: [String]
  index_gt: String
  url_gte: String
  index_nin: [String]
  url_ne: String
  name_in: [String]
  name_gte: String
  name_exists: Boolean
  name_nin: [String]
  url: String
  index_ne: String
  name_ne: String
  url_lt: String
  OR: [TraitRaceQueryInput!]
  index: String
  url_lte: String
  name_gt: String
  index_gte: String
  AND: [TraitRaceQueryInput!]
  index_lte: String
  name_lt: String
  url_gt: String
}

enum TraitSortByInput {
  URL_DESC
  _ID_ASC
  _ID_DESC
  INDEX_ASC
  INDEX_DESC
  NAME_ASC
  NAME_DESC
  URL_ASC
}

type TraitSubrace {
  index: String
  name: String
  url: String
}

input TraitSubraceQueryInput {
  url_gte: String
  index_in: [String]
  index: String
  name_ne: String
  index_lt: String
  name: String
  index_lte: String
  index_gt: String
  url_in: [String]
  url_nin: [String]
  url_ne: String
  name_in: [String]
  url_exists: Boolean
  name_lt: String
  name_gt: String
  name_gte: String
  AND: [TraitSubraceQueryInput!]
  index_nin: [String]
  index_exists: Boolean
  url: String
  index_ne: String
  url_lt: String
  url_gt: String
  url_lte: String
  name_exists: Boolean
  name_nin: [String]
  name_lte: String
  OR: [TraitSubraceQueryInput!]
  index_gte: String
}

type WeaponProperty {
  _id: ObjectId
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
  _id_gte: ObjectId
  url_lt: String
  _id_lt: ObjectId
  _id_ne: ObjectId
  index_nin: [String]
  url: String
  AND: [WeaponPropertyQueryInput!]
  name_in: [String]
  index_gt: String
  desc_nin: [String]
  _id_gt: ObjectId
  index_gte: String
  _id_exists: Boolean
  _id_nin: [ObjectId]
  name_gt: String
  url_lte: String
  url_exists: Boolean
  desc_exists: Boolean
  name_nin: [String]
  url_ne: String
  _id_lte: ObjectId
  url_gt: String
  index_in: [String]
  index_lte: String
  OR: [WeaponPropertyQueryInput!]
  url_in: [String]
  name_lt: String
  name_ne: String
  name_gte: String
  url_nin: [String]
  _id_in: [ObjectId]
  index_ne: String
  name_lte: String
  desc: [String]
  index: String
  _id: ObjectId
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
  _id: ObjectId
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
const resolvers = {}

module.exports = {
  typeDefs,
  resolvers
}
