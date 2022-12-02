import * as mongoose from 'mongoose';

export interface Collection {
  _id?: mongoose.Types.ObjectId;
  index: string;
}
