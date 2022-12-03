import { Schema, model } from 'mongoose';
import { APIReferenceSchema, ChoiceSchema } from '../common/index.js';
import { Prerequisite, FeatureSpecific, Feature } from './types';

const PrerequisiteSchema = new Schema<Prerequisite>({
  _id: false,
  level: { type: Number, index: true },
  type: { type: String, index: true },
});

const FeatureSpecificSchema = new Schema<FeatureSpecific>({
  _id: false,
  subfeature_options: ChoiceSchema,
  expertise_options: ChoiceSchema,
  invocations: [APIReferenceSchema],
});

const FeatureSchema = new Schema<Feature>({
  _id: { type: String, select: false },
  class: APIReferenceSchema,
  desc: { type: [String], index: true },
  parent: APIReferenceSchema,
  index: { type: String, index: true },
  level: { type: Number, index: true },
  name: { type: String, index: true },
  prerequisites: [PrerequisiteSchema],
  reference: { type: String, index: true },
  subclass: APIReferenceSchema,
  feature_specific: FeatureSpecificSchema,
  url: { type: String, index: true },
});

export default model('Feature', FeatureSchema, 'features');
