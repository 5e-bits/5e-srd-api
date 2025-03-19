import * as mongoose from 'mongoose';
import { APIReference } from '@/models/2014/common/types';

interface Rarity {
  _id?: boolean;
  name: string;
}

export type MagicItem = {
  _id?: mongoose.Types.ObjectId;
  desc: string[];
  equipment_category: APIReference;
  image?: string;
  index: string;
  name: string;
  rarity: Rarity;
  url: string;
  variants: APIReference[];
  variant: boolean;
  updated_at: string;
};
