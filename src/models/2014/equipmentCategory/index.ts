import { Schema, model } from 'mongoose';
import { APIReferenceSchema } from '@/models/2014/common/index.js';
import { EquipmentCategory } from './types.js';

const EquipmentCategorySchema = new Schema<EquipmentCategory>({
  _id: { type: String, select: false },
  equipment: [APIReferenceSchema],
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
  updated_at: { type: String, index: true },
});

export default model('EquipmentCategory', EquipmentCategorySchema, '2014-equipment-categories');
