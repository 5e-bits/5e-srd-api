import * as mongoose from 'mongoose';
import { APIReference } from '../common/types';

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
};
