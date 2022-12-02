import { Schema, model } from 'mongoose';
import { APIReferenceSchema } from '../common/index.js';
import {
  ArmorClass,
  Content,
  Cost,
  Damage,
  Range,
  Speed,
  ThrowRange,
  TwoHandedDamage,
  Equipment,
} from './types';

const ArmorClassSchema = new Schema<ArmorClass>({
  _id: false,
  base: { type: Number, index: true },
  dex_bonus: { type: Boolean, index: true },
  max_bonus: { type: Number, index: true },
});

const ContentSchema = new Schema<Content>({
  _id: false,
  item: APIReferenceSchema,
  quantity: { type: Number, index: true },
});

const CostSchema = new Schema<Cost>({
  _id: false,
  quantity: { type: Number, index: true },
  unit: { type: String, index: true },
});

const DamageSchema = new Schema<Damage>({
  _id: false,
  damage_dice: { type: String, index: true },
  damage_type: APIReferenceSchema,
});

const RangeSchema = new Schema<Range>({
  _id: false,
  long: { type: Number, index: true },
  normal: { type: Number, index: true },
});

const SpeedSchema = new Schema<Speed>({
  _id: false,
  quantity: { type: Number, index: true },
  unit: { type: String, index: true },
});

const ThrowRangeSchema = new Schema<ThrowRange>({
  _id: false,
  long: { type: Number, index: true },
  normal: { type: Number, index: true },
});

const TwoHandedDamageSchema = new Schema<TwoHandedDamage>({
  _id: false,
  damage_dice: { type: String, index: true },
  damage_type: APIReferenceSchema,
});

const EquipmentSchema = new Schema<Equipment>({
  _id: { type: String, select: false },
  armor_category: { type: String, index: true },
  armor_class: ArmorClassSchema,
  capacity: { type: String, index: true },
  category_range: { type: String, index: true },
  contents: [ContentSchema],
  cost: CostSchema,
  damage: DamageSchema,
  desc: { type: [String], index: true },
  equipment_category: APIReferenceSchema,
  gear_category: APIReferenceSchema,
  index: { type: String, index: true },
  name: { type: String, index: true },
  properties: [APIReferenceSchema],
  quantity: { type: Number, index: true },
  range: RangeSchema,
  special: { type: [String], index: true },
  speed: SpeedSchema,
  stealth_disadvantage: { type: Boolean, index: true },
  str_minimum: { type: Number, index: true },
  throw_range: ThrowRangeSchema,
  tool_category: { type: String, index: true },
  two_handed_damage: TwoHandedDamageSchema,
  url: { type: String, index: true },
  vehicle_category: { type: String, index: true },
  weapon_category: { type: String, index: true },
  weapon_range: { type: String, index: true },
  weight: { type: Number, index: true },
});

export default model('Equipment', EquipmentSchema, 'equipment');
