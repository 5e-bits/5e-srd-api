import mongoose from 'mongoose';
import { APIReference } from '@/models/2014/common/types';

export type AbilityScore = {
  _id?: mongoose.Types.ObjectId;
  desc: string[];
  full_name: string;
  index: string;
  name: string;
  skills: APIReference[] | [];
  url: string;
  updated_at: string;
};
