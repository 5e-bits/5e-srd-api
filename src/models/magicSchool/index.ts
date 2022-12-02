import { Schema, model } from 'mongoose';
import { MagicSchool } from './types';

const MagicSchoolSchema = new Schema<MagicSchool>({
  _id: { type: String, select: false },
  desc: { type: String, index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
});

export default model('MagicSchool', MagicSchoolSchema, 'magic-schools');
