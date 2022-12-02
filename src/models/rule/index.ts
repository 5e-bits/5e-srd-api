import { Schema, model } from 'mongoose';
import { APIReferenceSchema } from '../common/index.js';
import { Rule } from './types';

const RuleSchema = new Schema<Rule>({
  _id: { type: String, select: false },
  desc: { type: String, index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  subsections: [APIReferenceSchema],
  url: { type: String, index: true },
});

export default model('Rule', RuleSchema, 'rules');
