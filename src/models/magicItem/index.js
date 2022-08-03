import { APIReference } from '../common/index.js';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Rarity = new Schema({
  _id: false,
  name: { type: String, index: true },
});

const MagicItem = new Schema({
  _id: { type: String, select: false },
  desc: { type: [String], index: true },
  equipment_category: APIReference,
  index: { type: String, index: true },
  name: { type: String, index: true },
  rarity: Rarity,
  url: { type: String, index: true },
  variants: [APIReference],
  variant: Boolean,
});

export default mongoose.model('MagicItem', MagicItem, 'magic-items');
