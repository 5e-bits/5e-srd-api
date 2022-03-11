import * as mongoose from 'mongoose';
import { APIReference, APIReferenceSchema } from './common';

interface ArmorClass {
  base: number;
  dex_bonus: boolean;
  max_bonus: number | null;
}

const ArmorClass = {
  base: { type: Number, index: true },
  dex_bonus: { type: Boolean, index: true },
  max_bonus: { type: Number, index: true },
};

interface Content {
  item: APIReference;
  quantity: number;
}

const Content = {
  item: APIReferenceSchema,
  quantity: { type: Number, index: true },
};

interface Cost {
  quantity: number;
  unit: string;
}

const Cost = {
  quantity: { type: Number, index: true },
  unit: { type: String, index: true },
};

interface Damage {
  damage_dice: string;
  damage_type: APIReference;
}

const Damage = {
  damage_dice: { type: String, index: true },
  damage_type: APIReferenceSchema,
};

interface Range {
  long: number;
  normal: number;
}

const Range = {
  long: { type: Number, index: true },
  normal: { type: Number, index: true },
};

interface Speed {
  quantity: number;
  unit: string;
}

const Speed = {
  quantity: { type: Number, index: true },
  unit: { type: String, index: true },
};

interface ThrowRange {
  long: number;
  normal: number;
}

const ThrowRange = {
  long: { type: Number, index: true },
  normal: { type: Number, index: true },
};

interface TwoHandedDamage {
  damage_dice: string;
  damage_type: APIReference;
}

const TwoHandedDamage = {
  damage_dice: { type: String, index: true },
  damage_type: APIReferenceSchema,
};

interface Equipment {
  _id?: mongoose.Types.ObjectId;
  armor_category?: string;
  armor_class?: ArmorClass;
  capacity?: number;
  category_range?: string;
  contents?: Content[];
  cost: Cost;
  damage?: Damage;
  desc: string[];
  equipment_category: APIReference;
  gear_category?: APIReference;
  index: string;
  name: string;
  properties?: APIReference[];
  quantity?: number;
  range?: Range;
  special?: string[];
  speed?: Speed;
  stealth_disadvantage?: boolean;
  str_minimum?: number;
  throw_range?: ThrowRange;
  tool_category?: string;
  two_handed_damage?: TwoHandedDamage;
  url: string;
  vehicle_category?: string;
  weapon_category?: string;
  weapon_range?: string;
  weight?: number;
}

const Equipment = new mongoose.Schema<Equipment>({
  _id: { type: String, select: false },
  armor_category: { type: String, index: true },
  armor_class: ArmorClass,
  capacity: { type: String, index: true },
  category_range: { type: String, index: true },
  contents: [Content],
  cost: Cost,
  damage: Damage,
  desc: { type: [String], index: true },
  equipment_category: APIReferenceSchema,
  gear_category: APIReferenceSchema,
  index: { type: String, index: true },
  name: { type: String, index: true },
  properties: [APIReferenceSchema],
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

export default mongoose.model<Equipment>('Equipment', Equipment, 'equipment');
