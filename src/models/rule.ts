import * as mongoose from 'mongoose';
import { APIReference, APIReferenceSchema } from './common';

interface Rule extends mongoose.Document {
  _id?: mongoose.Types.ObjectId;
  desc: string;
  index: string;
  name: string;
  subsections: APIReference[];
  url: string;
}

const RuleSchema = new mongoose.Schema<Rule>({
  _id: { type: String, select: false },
  desc: { type: String, index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  subsections: [APIReferenceSchema],
  url: { type: String, index: true },
});

export default mongoose.model<Rule>('Rule', RuleSchema, 'rules');
