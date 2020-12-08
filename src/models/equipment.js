const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EquipmentArmorClass = new Schema({
  _id: false,
  base: Number,
  dex_bonus: Boolean,
  max_bonus: Number,
});

const EquipmentContentItem = new Schema({
  _id: false,
  index: String,
  name: String,
  url: String,
});

const EquipmentContent = new Schema({
  _id: false,
  item: EquipmentContentItem,
  quantity: Number,
});

const EquipmentCost = new Schema({
  _id: false,
  quantity: Number,
  unit: String,
});

const EquipmentDamageDamageType = new Schema({
  _id: false,
  index: String,
  name: String,
  url: String,
});

const EquipmentDamage = new Schema({
  _id: false,
  damage_dice: String,
  damage_type: EquipmentDamageDamageType,
});

const EquipmentEquipmentCategory = new Schema({
  _id: false,
  index: String,
  name: String,
  url: String,
});

const EquipmentGearCategory = new Schema({
  _id: false,
  index: String,
  name: String,
  url: String,
});

const EquipmentProperty = new Schema({
  _id: false,
  index: String,
  name: String,
  url: String,
});

const EquipmentRange = new Schema({
  _id: false,
  long: Number,
  normal: Number,
});

const EquipmentSpeed = new Schema({
  _id: false,
  quantity: Number,
  unit: String,
});

const EquipmentThrowRange = new Schema({
  _id: false,
  long: Number,
  normal: Number,
});

const EquipmentTwoHandedDamageDamageType = new Schema({
  _id: false,
  index: String,
  name: String,
  url: String,
});

const EquipmentTwoHandedDamage = new Schema({
  _id: false,
  damage_dice: String,
  damage_type: EquipmentTwoHandedDamageDamageType,
});

const Equipment = new Schema({
  _id: {
    type: String,
    select: false,
  },
  armor_category: String,
  armor_class: EquipmentArmorClass,
  capacity: String,
  category_range: String,
  contents: [EquipmentContent],
  cost: EquipmentCost,
  damage: EquipmentDamage,
  desc: [String],
  equipment_category: EquipmentEquipmentCategory,
  gear_category: EquipmentGearCategory,
  index: String,
  name: String,
  properties: [EquipmentProperty],
  quantity: Number,
  range: EquipmentRange,
  special: [String],
  speed: EquipmentSpeed,
  stealth_disadvantage: Boolean,
  str_minimum: Number,
  throw_range: EquipmentThrowRange,
  tool_category: String,
  two_handed_damage: EquipmentTwoHandedDamage,
  url: String,
  vehicle_category: String,
  weapon_category: String,
  weapon_range: String,
  weight: Number,
});

module.exports = mongoose.model('Equipment', Equipment, 'equipment');
