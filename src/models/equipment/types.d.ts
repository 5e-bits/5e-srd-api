import * as mongoose from 'mongoose';
import { APIReference } from '../common/types';

type ArmorClass = {
  base: number;
  dex_bonus: boolean;
  max_bonus?: number;
};

type Content = {
  item: APIReference;
  quantity: number;
};

type Cost = {
  quantity: number;
  unit: string;
};

type Damage = {
  damage_dice: string;
  damage_type: APIReference;
};

type Range = {
  long?: number;
  normal: number;
};

type Speed = {
  quantity: number;
  unit: string;
};

type ThrowRange = {
  long: number;
  normal: number;
};

type TwoHandedDamage = {
  damage_dice: string;
  damage_type: APIReference;
};

export type Equipment = {
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
};
