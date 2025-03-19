import { Schema, model } from 'mongoose';
import { APIReferenceSchema } from '@/models/2014/common/index.js';
import { Rule } from './types.js';

const RuleSchema = new Schema<Rule>({
  _id: { type: String, select: false },
  desc: { type: String, index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  subsections: [APIReferenceSchema],
  url: { type: String, index: true },
  updated_at: { type: String, index: true },
});

export default model('Rule', RuleSchema, '2014-rules');
