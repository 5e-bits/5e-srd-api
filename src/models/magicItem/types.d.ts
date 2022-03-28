import * as mongoose from 'mongoose';
import { APIReference } from '../common/types';

interface Rarity {
  _id?: mongoose.Types.ObjectId;
  name: string;
}

export type MagicItem = {
  _id?: mongoose.Types.ObjectId;
  desc: string[];
  equipment_category: APIReference;
  index: string;
  name: string;
  rarity: Rarity;
  url: string;
  variants: APIReference[];
};
