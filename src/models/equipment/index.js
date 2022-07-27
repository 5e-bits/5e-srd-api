import { APIReference } from '../common/index.js';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ArmorClass = new Schema({
  _id: false,
  base: { type: Number, index: true },
  dex_bonus: { type: Boolean, index: true },
  max_bonus: { type: Number, index: true },
});

const Content = new Schema({
  _id: false,
  item: APIReference,
  quantity: { type: Number, index: true },
});

const Cost = new Schema({
  _id: false,
  quantity: { type: Number, index: true },
  unit: { type: String, index: true },
});

const Damage = new Schema({
  _id: false,
  damage_dice: { type: String, index: true },
  damage_type: APIReference,
});

const Range = new Schema({
  _id: false,
  long: { type: Number, index: true },
  normal: { type: Number, index: true },
});

const Speed = new Schema({
  _id: false,
  quantity: { type: Number, index: true },
  unit: { type: String, index: true },
});

const ThrowRange = new Schema({
  _id: false,
  long: { type: Number, index: true },
  normal: { type: Number, index: true },
});

const TwoHandedDamage = new Schema({
  _id: false,
  damage_dice: { type: String, index: true },
  damage_type: APIReference,
});

const Equipment = new Schema({
  _id: { type: String, select: false },
  armor_category: { type: String, index: true },
  armor_class: ArmorClass,
  capacity: { type: String, index: true },
  category_range: { type: String, index: true },
  contents: [Content],
  cost: Cost,
  damage: Damage,
  desc: { type: [String], index: true },
  equipment_category: APIReference,
  gear_category: APIReference,
  index: { type: String, index: true },
  name: { type: String, index: true },
  properties: [APIReference],
  quantity: { type: Number, index: true },
  range: Range,
  special: { type: [String], index: true },
  speed: Speed,
  stealth_disadvantage: { type: Boolean, index: true },
  str_minimum: { type: Number, index: true },
  throw_range: ThrowRange,
  tool_category: { type: String, index: true },
  two_handed_damage: TwoHandedDamage,
  url: { type: String, index: true },
  vehicle_category: { type: String, index: true },
  weapon_category: { type: String, index: true },
  weapon_range: { type: String, index: true },
  weight: { type: Number, index: true },
});

export default mongoose.model('Equipment', Equipment, 'equipment');
