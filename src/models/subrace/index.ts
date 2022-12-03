import { Schema, model } from 'mongoose';
import { APIReferenceSchema, ChoiceSchema } from '../common/index.js';
import { AbilityBonus, Subrace } from './types';

const AbilityBonus = new Schema<AbilityBonus>({
  _id: false,
  ability_score: APIReferenceSchema,
  bonus: { type: Number, index: true },
});

const Subrace = new Schema<Subrace>({
  _id: { type: String, select: false },
  ability_bonuses: [AbilityBonus],
  desc: { type: String, index: true },
  index: { type: String, index: true },
  language_options: ChoiceSchema,
  name: { type: String, index: true },
  race: APIReferenceSchema,
  racial_traits: [APIReferenceSchema],
  starting_proficiencies: [APIReferenceSchema],
  url: { type: String, index: true },
});

export default model('Subrace', Subrace, 'subraces');
