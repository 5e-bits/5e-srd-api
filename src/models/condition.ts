import * as mongoose from 'mongoose';

interface Condition extends mongoose.Document {
  _id?: mongoose.Types.ObjectId;
  desc: string[];
  index: string;
  name: string;
  url: string;
}

const ConditionSchema = new mongoose.Schema<Condition>({
  _id: { type: String, select: false },
  desc: { type: [String], index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
});

export default mongoose.model<Condition>('Condition', ConditionSchema, 'conditions');
