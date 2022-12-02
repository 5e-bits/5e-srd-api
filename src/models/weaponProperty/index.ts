import { Schema, model } from 'mongoose';
import { WeaponProperty } from './types';

const WeaponPropertySchema = new Schema<WeaponProperty>({
  _id: { type: String, select: false },
  desc: { type: [String], index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
});

export default model('WeaponProperty', WeaponPropertySchema, 'weapon-properties');
