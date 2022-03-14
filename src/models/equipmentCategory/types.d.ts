import * as mongoose from 'mongoose';
import { APIReference } from '../common/types';

export type EquipmentCategory = {
  _id?: mongoose.Types.ObjectId;
  equipment: APIReference[];
  index: string;
  name: string;
  url: string;
};
