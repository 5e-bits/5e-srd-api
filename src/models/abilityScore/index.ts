import { Schema, model } from 'mongoose';
import { APIReference } from '../common';
import { AbilityScore } from './types';

const AbilityScoreSchema = new Schema<AbilityScore>({
  _id: { type: String, select: false },
  desc: { type: [String], index: true },
  full_name: { type: String, index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  skills: [APIReference],
  url: { type: String, index: true },
});

module.exports = model('AbilityScore', AbilityScoreSchema, 'ability-scores');
