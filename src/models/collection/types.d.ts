import * as mongoose from 'mongoose';

export type Collection = {
  _id?: mongoose.Types.ObjectId;
  index: string;
};
