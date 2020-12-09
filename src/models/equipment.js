const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { NamedAPIResource } = require('./common');

const EquipmentArmorClass = new Schema({
  _id: false,
  base: Number,
  dex_bonus: Boolean,
  max_bonus: Number,
});

const EquipmentContent = new Schema({
  _id: false,
  item: NamedAPIResource,
  quantity: Number,
});

const EquipmentCost = new Schema({
  _id: false,
  quantity: Number,
  unit: String,
});

const EquipmentDamage = new Schema({
  _id: false,
  damage_dice: String,
  damage_type: NamedAPIResource,
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

const EquipmentTwoHandedDamage = new Schema({
  _id: false,
  damage_dice: String,
  damage_type: NamedAPIResource,
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
  equipment_category: NamedAPIResource,
  gear_category: NamedAPIResource,
  index: String,
  name: String,
  properties: [NamedAPIResource],
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
