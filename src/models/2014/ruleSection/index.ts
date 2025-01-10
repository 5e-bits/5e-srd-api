import { Schema, model } from 'mongoose';
import { RuleSection } from './types';

const RuleSectionSchema = new Schema<RuleSection>({
  _id: { type: String, select: false },
  desc: { type: String, index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
  updated_at: { type: String, index: true },
});

export default model('RuleSection', RuleSectionSchema, '2014-rule-sections');
