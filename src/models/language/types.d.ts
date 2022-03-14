import * as mongoose from 'mongoose';

export type Language = {
  _id?: mongoose.Types.ObjectId;
  desc?: string;
  index: string;
  name: string;
  script?: string;
  type: string;
  typical_speakers: string[];
  url: string;
};
