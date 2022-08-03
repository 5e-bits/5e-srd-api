import { APIReference } from '../common/index.js';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Skill = new Schema({
  _id: { type: String, select: false },
  ability_score: APIReference,
  desc: { type: [String], index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
});

export default mongoose.model('Skill', Skill, 'skills');
