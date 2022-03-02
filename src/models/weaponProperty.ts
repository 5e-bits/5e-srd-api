import * as mongoose from 'mongoose';

interface WeaponProperty {
  _id?: string;
  desc: string;
  index: string;
  name: string;
  url: string;
}

const WeaponProperty = new mongoose.Schema<WeaponProperty>({
  _id: { type: String, select: false },
  desc: { type: [String], index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
});

export default mongoose.model<WeaponProperty>(
  'WeaponProperty',
  WeaponProperty,
  'weapon-properties'
);
