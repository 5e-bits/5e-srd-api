import mongoose from 'mongoose';
import { APIReference } from './common';

const AbilityScore = new mongoose.Schema({
  _id: { type: String, select: false },
  desc: { type: [String], index: true },
  full_name: { type: String, index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  skills: [APIReference],
  url: { type: String, index: true },
});

module.exports = mongoose.model('AbilityScore', AbilityScore, 'ability-scores');
