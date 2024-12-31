import { Schema, model } from 'mongoose';
import { Alignment } from './types';

/**
 * Alignment Model
 * 
 * @typedef {object} Alignment
 * @property {string} desc - Description of the alignment.
 * @property {string} abbreviation - Abbreviation of the alignment.
 * @property {string} index - Index of the alignment.
 * @property {string} name - Name of the alignment.
 * @property {string} url - URL of the alignment.
 */
const AlignmentSchema = new Schema<Alignment>({
  _id: { type: String, select: false },
  desc: { type: String, index: true },
  abbreviation: { type: String, index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
});

export default model('Alignment', AlignmentSchema, '2014-alignments');
