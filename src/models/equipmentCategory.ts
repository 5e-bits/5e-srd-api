import * as mongoose from 'mongoose';
import { APIReference, APIReferenceSchema } from './common';

interface EquipmentCategory {
  _id?: mongoose.Types.ObjectId;
  equipment: APIReference[];
  index: string;
  name: string;
  url: string;
}

const EquipmentCategory = new mongoose.Schema<EquipmentCategory>({
  _id: { type: String, select: false },
  equipment: [APIReferenceSchema],
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
});

export default mongoose.model<EquipmentCategory>(
  'EquipmentCategory',
  EquipmentCategory,
  'equipment-categories'
);
