import * as mongoose from 'mongoose';
import { APIReference } from './common';

const MagicItem = new mongoose.Schema({
  _id: { type: String, select: false },
  desc: { type: [String], index: true },
  equipment_category: APIReference,
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
});

export default mongoose.model('MagicItem', MagicItem, 'magic-items');
