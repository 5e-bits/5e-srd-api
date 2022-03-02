import * as mongoose from 'mongoose';
import { APIReference, APIReferenceSchema } from './common';

interface Choice {
  choose: number;
  from: APIReference[];
  type: string;
}

const Choice = {
  choose: { type: Number, index: true },
  from: [APIReferenceSchema],
  type: { type: String, index: true },
};

interface Prerequisite {
  level: number;
  type: string;
}

const Prerequisite = {
  level: { type: Number, index: true },
  type: { type: String, index: true },
};

interface FeatureSpecific {
  subfeature_options: Choice;
  expertise_options: Choice;
}

const FeatureSpecific = {
  subfeature_options: Choice,
  expertise_options: Choice,
};

interface Feature {
  _id?: string;
  class: APIReference;
  desc: string[];
  parent?: APIReference;
  index: string;
  level: number;
  name: string;
  prerequisites: Prerequisite[];
  reference?: string;
  subclass?: APIReference;
  feature_specific?: FeatureSpecific;
  url: string;
}

const Feature = new mongoose.Schema<Feature>({
  _id: { type: String, select: false },
  class: APIReferenceSchema,
  desc: { type: [String], index: true },
  parent: APIReferenceSchema,
  index: { type: String, index: true },
  level: { type: Number, index: true },
  name: { type: String, index: true },
  prerequisites: [Prerequisite],
  reference: { type: String, index: true },
  subclass: APIReferenceSchema,
  feature_specific: FeatureSpecific,
  url: { type: String, index: true },
});

export default mongoose.model<Feature>('Feature', Feature, 'features');
