import * as mongoose from 'mongoose';
import { APIReference } from '../common/types';

export type Rule = {
  _id?: mongoose.Types.ObjectId;
  desc: string;
  index: string;
  name: string;
  subsections: APIReference[];
  url: string;
};
