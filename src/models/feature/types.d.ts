import * as mongoose from 'mongoose';
import { APIReference, Choice } from '../common/types';

type Prerequisite = LevelPrerequisite | FeaturePrerequisite | SpellPrerequisite;

type LevelPrerequisite = {
  _id?: boolean;
  type: string;
  level: number;
};

type FeaturePrerequisite = {
  _id?: boolean;
  type: string;
  feature: string;
};

type SpellPrerequisite = {
  _id?: boolean;
  type: string;
  spell: string;
};

type FeatureSpecific = {
  _id?: boolean;
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
