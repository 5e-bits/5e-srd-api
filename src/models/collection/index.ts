import { Schema, model } from 'mongoose';
import { Collection } from './types.d';

const CollectionSchema = new Schema<Collection>({
  _id: { type: String, select: false },
  index: { type: String, index: true },
});

export default model('Collection', CollectionSchema, 'collections');
