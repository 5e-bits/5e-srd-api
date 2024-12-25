import * as mongoose from 'mongoose';
import { APIReference } from '../common/types';

export type Skill = {
  _id?: mongoose.Types.ObjectId;
  ability_score: APIReference;
  desc: string[];
  index: string;
  name: string;
  url: string;
};
