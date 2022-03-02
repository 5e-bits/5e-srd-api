import * as mongoose from 'mongoose';
import { APIReference, APIReferenceSchema } from './common';

interface Skill {
  _id?: mongoose.Types.ObjectId;
  ability_score: APIReference;
  desc: string[];
  index: string;
  name: string;
  url: string;
}

const Skill = new mongoose.Schema<Skill>({
  _id: { type: String, select: false },
  ability_score: APIReferenceSchema,
  desc: { type: [String], index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
});

export default mongoose.model<Skill>('Skill', Skill, 'skills');
