import * as mongoose from 'mongoose';
import { APIReference } from './common';

const Skill = new mongoose.Schema({
  _id: { type: String, select: false },
  ability_score: APIReference,
  desc: { type: [String], index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
});

export default mongoose.model('Skill', Skill, 'skills');
