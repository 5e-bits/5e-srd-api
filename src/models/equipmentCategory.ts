import * as mongoose from 'mongoose';
import { APIReference } from './common';

const EquipmentCategory = new mongoose.Schema({
  _id: { type: String, select: false },
  equipment: [APIReference],
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
});

module.exports = mongoose.model('EquipmentCategory', EquipmentCategory, 'equipment-categories');
