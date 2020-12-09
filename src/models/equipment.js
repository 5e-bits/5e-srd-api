const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { NamedAPIResource } = require('./common');

const ArmorClass = new Schema({
  _id: false,
  base: Number,
  dex_bonus: Boolean,
  max_bonus: Number,
});

const Content = new Schema({
  _id: false,
  item: NamedAPIResource,
  quantity: Number,
});

const Cost = new Schema({
  _id: false,
  quantity: Number,
  unit: String,
});

const Damage = new Schema({
  _id: false,
  damage_dice: String,
  damage_type: NamedAPIResource,
});

const Range = new Schema({
  _id: false,
  long: Number,
  normal: Number,
});

const Speed = new Schema({
  _id: false,
  quantity: Number,
  unit: String,
});

const ThrowRange = new Schema({
  _id: false,
  long: Number,
  normal: Number,
});

const TwoHandedDamage = new Schema({
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
  armor_class: ArmorClass,
  capacity: String,
  category_range: String,
  contents: [Content],
  cost: Cost,
  damage: Damage,
  desc: [String],
  equipment_category: NamedAPIResource,
  gear_category: NamedAPIResource,
  index: String,
  name: String,
  properties: [NamedAPIResource],
  quantity: Number,
  range: Range,
  special: [String],
  speed: Speed,
  stealth_disadvantage: Boolean,
  str_minimum: Number,
  throw_range: ThrowRange,
  tool_category: String,
  two_handed_damage: TwoHandedDamage,
  url: String,
  vehicle_category: String,
  weapon_category: String,
  weapon_range: String,
  weight: Number,
});

module.exports = mongoose.model('Equipment', Equipment, 'equipment');
