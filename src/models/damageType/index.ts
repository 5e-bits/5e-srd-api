import { Schema, model } from 'mongoose';
import { DamageType } from './types';

const DamageTypeSchema = new Schema<DamageType>({
  _id: { type: String, select: false },
  desc: { type: [String], index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
});

export default model('DamageType', DamageTypeSchema, 'damage-types');
