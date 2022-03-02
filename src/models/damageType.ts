import * as mongoose from 'mongoose';

interface DamageType {
  _id?: mongoose.Types.ObjectId;
  desc: string[];
  index: string;
  name: string;
  url: string;
}

const DamageType = new mongoose.Schema<DamageType>({
  _id: { type: String, select: false },
  desc: { type: [String], index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
});

export default mongoose.model<DamageType>('DamageType', DamageType, 'damage-types');
