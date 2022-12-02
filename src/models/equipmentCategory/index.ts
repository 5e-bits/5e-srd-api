import { Schema, model } from 'mongoose';
import { APIReferenceSchema } from '../common/index.js';
import { EquipmentCategory } from './types';

const EquipmentCategorySchema = new Schema<EquipmentCategory>({
  _id: { type: String, select: false },
  equipment: [APIReferenceSchema],
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
});

export default model('EquipmentCategory', EquipmentCategorySchema, 'equipment-categories');
