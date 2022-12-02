import { Schema, model } from 'mongoose';
import { APIReferenceSchema, ChoiceSchema } from '../common/index.js';
import { RaceAbilityBonus, Race } from './types';

const RaceAbilityBonusSchema = new Schema<RaceAbilityBonus>({
  _id: false,
  ability_score: APIReferenceSchema,
  bonus: { type: Number, index: true },
});

const RaceSchema = new Schema<Race>({
  _id: { type: String, select: false },
  ability_bonus_options: ChoiceSchema,
  ability_bonuses: [RaceAbilityBonusSchema],
  age: { type: String, index: true },
  alignment: { type: String, index: true },
  index: { type: String, index: true },
  language_desc: { type: String, index: true },
  language_options: ChoiceSchema,
  languages: [APIReferenceSchema],
  name: { type: String, index: true },
  size: { type: String, index: true },
  size_description: { type: String, index: true },
  speed: { type: Number, index: true },
  starting_proficiencies: [APIReferenceSchema],
  starting_proficiency_options: ChoiceSchema,
  subraces: [APIReferenceSchema],
  traits: [APIReferenceSchema],
  url: { type: String, index: true },
});

export default model('Race', RaceSchema, 'races');
