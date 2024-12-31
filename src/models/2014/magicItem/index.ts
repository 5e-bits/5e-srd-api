import { Schema, model } from 'mongoose';
import { APIReferenceSchema } from '../common/index.js';
import { Rarity, MagicItem } from './types.js';

const RaritySchema = new Schema<Rarity>({
  _id: false,
  name: { type: String, index: true },
});

const MagicItemSchema = new Schema<MagicItem>({
  _id: { type: String, select: false },
  desc: { type: [String], index: true },
  equipment_category: APIReferenceSchema,
  image: { type: String, index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  rarity: RaritySchema,
  url: { type: String, index: true },
  variants: [APIReferenceSchema],
  variant: Boolean,
});

export default model('MagicItem', MagicItemSchema, '2014-magic-items');
