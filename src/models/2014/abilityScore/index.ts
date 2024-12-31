import { Schema, model } from 'mongoose';
import { APIReferenceSchema } from '../common/index.js';
import { AbilityScore } from './types.js';

/**
 * Ability Score Model
 * 
 * @typedef {object} AbilityScore
 * @property {string} desc - Description of the ability score.
 * @property {string} full_name - Full name of the ability score.
 * @property {string} index - Index of the ability score.
 * @property {string} name - Name of the ability score.
 * @property {array<APIReference>} skills - Skills associated with the ability score.
 * @property {string} url - URL of the ability score.
 */
const AbilityScoreSchema = new Schema<AbilityScore>({
  _id: { type: String, select: false },
  desc: { type: [String], index: true },
  full_name: { type: String, index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  skills: [APIReferenceSchema],
  url: { type: String, index: true },
});

export default model('AbilityScore', AbilityScoreSchema, '2014-ability-scores');
