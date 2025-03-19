import { Schema, model } from 'mongoose';
import { APIReferenceSchema } from '@/models/2014/common/index.js';
import { AbilityScore } from './types.js';

const AbilityScoreSchema = new Schema<AbilityScore>({
  _id: { type: String, select: false },
  desc: { type: [String], index: true },
  full_name: { type: String, index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  skills: [APIReferenceSchema],
  url: { type: String, index: true },
  updated_at: { type: String, index: true },
});

export default model('AbilityScore', AbilityScoreSchema, '2014-ability-scores');
