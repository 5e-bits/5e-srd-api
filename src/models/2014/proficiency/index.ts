import { Schema, model } from 'mongoose';
import { APIReferenceSchema } from '../common/index.js';
import { Reference, Proficiency } from './types.js';

const ReferenceSchema = new Schema<Reference>({
  _id: false,
  index: { type: String, index: true },
  name: { type: String, index: true },
  type: { type: String, index: true },
  url: { type: String, index: true },
});

const ProficiencySchema = new Schema<Proficiency>({
  _id: { type: String, select: false },
  classes: [APIReferenceSchema],
  index: { type: String, index: true },
  name: { type: String, index: true },
  races: [APIReferenceSchema],
  reference: ReferenceSchema,
  type: { type: String, index: true },
  url: { type: String, index: true },
  updated_at: { type: String, index: true },
});

export default model('Proficiency', ProficiencySchema, '2014-proficiencies');
