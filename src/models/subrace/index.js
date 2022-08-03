import { APIReference, Choice } from '../common/index.js';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AbilityBonus = new Schema({
  _id: false,
  ability_score: APIReference,
  bonus: { type: Number, index: true },
});

const Subrace = new Schema({
  _id: { type: String, select: false },
  ability_bonuses: [AbilityBonus],
  desc: { type: String, index: true },
  index: { type: String, index: true },
  language_options: Choice,
  name: { type: String, index: true },
  race: APIReference,
  racial_traits: [APIReference],
  starting_proficiencies: [APIReference],
  url: { type: String, index: true },
});

export default mongoose.model('Subrace', Subrace, 'subraces');
