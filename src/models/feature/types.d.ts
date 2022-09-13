import * as mongoose from 'mongoose';
import { APIReference, Choice } from '../common/types';

type Prerequisite = {
  level: number;
  type: string;
};

type FeatureSpecific = {
  subfeature_options?: Choice;
  expertise_options?: Choice;
  invocations?: APIReference[];
};

export type Feature = {
  _id?: mongoose.Types.ObjectId;
  class: APIReference;
  desc: string[];
  parent?: APIReference;
  index: string;
  level: number;
  name: string;
  prerequisites?: Prerequisite[];
  reference?: string;
  subclass?: APIReference;
  feature_specific?: FeatureSpecific;
  url: string;
};
