import * as mongoose from 'mongoose';

export type DamageType = {
  _id?: mongoose.Types.ObjectId;
  desc: string[];
  index: string;
  name: string;
  url: string;
};
