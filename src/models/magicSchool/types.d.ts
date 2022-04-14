import * as mongoose from 'mongoose';

export type MagicSchool = {
  _id?: mongoose.Types.ObjectId;
  desc: string;
  index: string;
  name: string;
  url: string;
};
