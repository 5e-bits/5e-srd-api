import mongoose from 'mongoose';
import { Collection } from './types.d';

const Schema = mongoose.Schema;

const CollectionSchema = new Schema<Collection>({
  _id: { type: String, select: false },
  index: { type: String, index: true },
});

export default mongoose.model('Collection', CollectionSchema, 'collections');
