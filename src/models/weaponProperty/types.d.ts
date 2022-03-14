import * as mongoose from 'mongoose';

export type WeaponProperty = {
  _id?: mongoose.Types.ObjectId;
  desc: string[];
  index: string;
  name: string;
  url: string;
};
