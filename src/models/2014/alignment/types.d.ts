import * as mongoose from 'mongoose';

export type Alignment = {
  _id?: mongoose.Types.ObjectId;
  desc: string;
  abbreviation: string;
  index: string;
  name: string;
  url: string;
};
