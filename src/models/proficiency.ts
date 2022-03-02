import * as mongoose from 'mongoose';
import { APIReference, APIReferenceSchema } from './common';

interface Reference {
  index: string;
  name: string;
  type: string;
  url: string;
}

const Reference = {
  index: { type: String, index: true },
  name: { type: String, index: true },
  type: { type: String, index: true },
  url: { type: String, index: true },
};

interface Proficiency {
  _id?: string;
  classes: APIReference[];
  index: string;
  name: string;
  races: APIReference[];
  reference: Reference;
  type: string;
  url: string;
}

const Proficiency = new mongoose.Schema<Proficiency>({
  _id: { type: String, select: false },
  classes: [APIReferenceSchema],
  index: { type: String, index: true },
  name: { type: String, index: true },
  races: [APIReferenceSchema],
  reference: Reference,
  type: { type: String, index: true },
  url: { type: String, index: true },
});

export default mongoose.model<Proficiency>('Proficiency', Proficiency, 'proficiencies');
