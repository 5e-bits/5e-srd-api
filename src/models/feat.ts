import * as mongoose from 'mongoose';
import { APIReference, APIReferenceSchema } from './common';

interface Prerequisite {
  ability_score: APIReference;
  minimum_score: number;
}

const Prerequisite = {
  ability_score: APIReferenceSchema,
  minimum_score: { type: Number, index: true },
};

interface Feat {
  _id?: string;
  index: string;
  name: string;
  prerequisites: Prerequisite[];
  desc: string[];
  url: string;
}

const Feat = new mongoose.Schema<Feat>({
  _id: { type: String, select: false },
  index: { type: String, index: true },
  name: { type: String, index: true },
  prerequisites: [Prerequisite],
  desc: { type: [String], index: true },
  url: { type: String, index: true },
});

export default mongoose.model<Feat>('Feat', Feat, 'feats');
