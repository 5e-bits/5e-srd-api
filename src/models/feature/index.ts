import { Schema, model } from 'mongoose';
import { APIReferenceSchema, ChoiceSchema } from '../common/index.js';
import {
  Prerequisite,
  LevelPrerequisite,
  FeaturePrerequisite,
  SpellPrerequisite,
  FeatureSpecific,
  Feature,
} from './types';

const PrerequisiteSchema = new Schema<Prerequisite>(
  {
    _id: false,
    type: { type: String, index: true, required: true, enum: ['level', 'feature', 'spell'] },
  },
  { discriminatorKey: 'type', _id: false }
);

PrerequisiteSchema.discriminators = {};
PrerequisiteSchema.discriminators['level'] = new Schema<LevelPrerequisite>({
  level: { type: Number, index: true, required: true },
});
PrerequisiteSchema.discriminators['feature'] = new Schema<FeaturePrerequisite>({
  feature: { type: String, index: true, required: true },
});
PrerequisiteSchema.discriminators['spell'] = new Schema<SpellPrerequisite>({
  spell: { type: String, index: true, required: true },
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
