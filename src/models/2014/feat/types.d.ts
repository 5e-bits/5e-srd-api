import * as mongoose from 'mongoose';
import { APIReference } from '@/models/2014/common/types';

type Prerequisite = {
  _id?: boolean;
  ability_score: APIReference;
  minimum_score: number;
};

export type Feat = {
  _id?: mongoose.Types.ObjectId;
  index: string;
  name: string;
  prerequisites: Prerequisite[];
  desc: string[];
  url: string;
  updated_at: string;
};
