import * as mongoose from 'mongoose';

interface WeaponProperty extends mongoose.Document {
  _id?: mongoose.Types.ObjectId;
  desc: string[];
  index: string;
  name: string;
  url: string;
}

const WeaponPropertySchema = new mongoose.Schema<WeaponProperty>({
  _id: { type: String, select: false },
  desc: { type: [String], index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
});

export default mongoose.model<WeaponProperty>(
  'WeaponProperty',
  WeaponPropertySchema,
  'weapon-properties'
);
