import * as mongoose from 'mongoose';
import { APIReference } from '../common/types';

export type MagicItem = {
  _id?: mongoose.Types.ObjectId;
  desc: string[];
  equipment_category: APIReference;
  index: string;
  name: string;
  url: string;
};
