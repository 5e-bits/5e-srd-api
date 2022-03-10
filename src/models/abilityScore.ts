import mongoose from 'mongoose';
import { APIReference, APIReferenceSchema } from './common';

interface AbilityScore extends mongoose.Document {
  _id?: mongoose.Types.ObjectId;
  desc: string[];
  full_name: string;
  index: string;
  name: string;
  skills: APIReference[];
  url: string;
}

const AbilityScoreSchema = new mongoose.Schema<AbilityScore>({
  _id: { type: String, select: false },
  desc: { type: [String], index: true },
  full_name: { type: String, index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  skills: [APIReferenceSchema],
  url: { type: String, index: true },
});

export default mongoose.model<AbilityScore>('AbilityScore', AbilityScoreSchema, 'ability-scores');
