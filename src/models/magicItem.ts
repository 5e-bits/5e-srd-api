import * as mongoose from 'mongoose';
import { APIReference, APIReferenceSchema } from './common';

interface MagicItem {
  _id?: mongoose.Types.ObjectId;
  desc: string[];
  equipment_category: APIReference;
  index: string;
  name: string;
  url: string;
}

const MagicItem = new mongoose.Schema<MagicItem>({
  _id: { type: String, select: false },
  desc: { type: [String], index: true },
  equipment_category: APIReferenceSchema,
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
});

export default mongoose.model<MagicItem>('MagicItem', MagicItem, 'magic-items');
