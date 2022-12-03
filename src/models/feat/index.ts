import { Schema, model } from 'mongoose';
import { APIReferenceSchema } from '../common/index.js';
import { Prerequisite, Feat } from './types';

const PrerequisiteSchema = new Schema<Prerequisite>({
  _id: false,
  ability_score: APIReferenceSchema,
  minimum_score: { type: Number, index: true },
});

const FeatSchema = new Schema<Feat>({
  _id: { type: String, select: false },
  index: { type: String, index: true },
  name: { type: String, index: true },
  prerequisites: [PrerequisiteSchema],
  desc: { type: [String], index: true },
  url: { type: String, index: true },
});

export default model('Feat', FeatSchema, 'feats');
