import { APIReference, Choice } from '../common/index.js';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Equipment = new Schema({
  _id: false,
  equipment: APIReference,
  quantity: { type: Number, index: true },
});

const Feature = new Schema({
  _id: false,
  name: { type: String, index: true },
  desc: { type: [String], index: true },
});

const Background = new Schema({
  _id: { type: String, select: false },
  index: { type: String, index: true },
  name: { type: String, index: true },
  starting_proficiencies: [APIReference],
  language_options: Choice,
  url: { type: String, index: true },
  starting_equipment: [Equipment],
  starting_equipment_options: { type: [Choice], index: true },
  feature: Feature,
  personality_traits: Choice,
  ideals: Choice,
  bonds: Choice,
  flaws: Choice,
});

export default mongoose.model('Background', Background, 'backgrounds');
