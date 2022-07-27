import { APIReference } from '../common/index.js';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AbilityScore = new Schema({
  _id: { type: String, select: false },
  desc: { type: [String], index: true },
  full_name: { type: String, index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  skills: [APIReference],
  url: { type: String, index: true },
});

export default mongoose.model('AbilityScore', AbilityScore, 'ability-scores');
