import { Schema, model } from 'mongoose';
import { Condition } from './types';

const ConditionSchema = new Schema<Condition>({
  _id: { type: String, select: false },
  desc: { type: [String], index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
});

export default model('Condition', ConditionSchema, 'conditions');
