import * as mongoose from 'mongoose';
import { APIReference } from '@/models/2014/common/types';

type Reference = {
  _id: false;
  index: string;
  name: string;
  type: string;
  url: string;
};

export type Proficiency = {
  _id?: mongoose.Types.ObjectId;
  classes?: APIReference[];
  index: string;
  name: string;
  races?: APIReference[];
  reference: Reference;
  type: string;
  url: string;
  updated_at: string;
};
