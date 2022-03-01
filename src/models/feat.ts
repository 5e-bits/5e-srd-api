import * as mongoose from 'mongoose';
import { APIReference } from './common';

const Prerequisite = {
  ability_score: APIReference,
  minimum_score: { type: Number, index: true },
};

const Feat = new mongoose.Schema({
  _id: { type: String, select: false },
  index: { type: String, index: true },
  name: { type: String, index: true },
  prerequisites: [Prerequisite],
  desc: { type: [String], index: true },
  url: { type: String, index: true },
});

export default mongoose.model('Feat', Feat, 'feats');
