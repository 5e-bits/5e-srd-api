import * as mongoose from 'mongoose';
import { APIReference } from './common';

const Rule = new mongoose.Schema({
  _id: { type: String, select: false },
  desc: { type: String, index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  subsections: [APIReference],
  url: { type: String, index: true },
});

export default mongoose.model('Rule', Rule, 'rules');
