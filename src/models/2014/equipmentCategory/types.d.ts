import * as mongoose from 'mongoose';
import { APIReference } from '@/models/2014/common/types';

export type EquipmentCategory = {
  _id?: mongoose.Types.ObjectId;
  equipment: APIReference[];
  index: string;
  name: string;
  url: string;
  updated_at: string;
};
