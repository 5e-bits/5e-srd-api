import { Schema, model } from 'mongoose';
import { Alignment } from './types';

const AlignmentSchema = new Schema<Alignment>({
  _id: { type: String, select: false },
  desc: { type: String, index: true },
  abbreviation: { type: String, index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
});

export default model('Alignment', AlignmentSchema, 'alignments');
