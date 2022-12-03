import { Schema, model } from 'mongoose';
import { APIReferenceSchema } from '../common/index.js';
import { AbilityScore } from './types';

const AbilityScoreSchema = new Schema<AbilityScore>({
  _id: { type: String, select: false },
  desc: { type: [String], index: true },
  full_name: { type: String, index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  skills: [APIReferenceSchema],
  url: { type: String, index: true },
});

export default model('AbilityScore', AbilityScoreSchema, 'ability-scores');
