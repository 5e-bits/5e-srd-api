import { APIReference } from '../common/index.js';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const EquipmentCategory = new Schema({
  _id: { type: String, select: false },
  equipment: [APIReference],
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
});

export default mongoose.model('EquipmentCategory', EquipmentCategory, 'equipment-categories');
