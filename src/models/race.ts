import * as mongoose from 'mongoose';
import { APIReference } from './common';

const AbilityBonusOption = {
  ability_score: APIReference,
  bonus: { type: Number, index: true },
};

const RaceAbilityBonusOptions = {
  choose: { type: Number, index: true },
  from: [AbilityBonusOption],
  type: { type: String, index: true },
};

const RaceAbilityBonus = {
  ability_score: APIReference,
  bonus: { type: Number, index: true },
};

const LanguageOptions = {
  choose: { type: Number, index: true },
  from: [APIReference],
  type: { type: String, index: true },
};

const StartingProficiencyOptions = {
  choose: { type: Number, index: true },
  from: [APIReference],
  type: { type: String, index: true },
};

const Race = new mongoose.Schema({
  _id: { type: String, select: false },
  ability_bonus_options: RaceAbilityBonusOptions,
  ability_bonuses: [RaceAbilityBonus],
  age: { type: String, index: true },
  alignment: { type: String, index: true },
  index: { type: String, index: true },
  language_desc: { type: String, index: true },
  language_options: LanguageOptions,
  languages: [APIReference],
  name: { type: String, index: true },
  size: { type: String, index: true },
  size_description: { type: String, index: true },
  speed: { type: Number, index: true },
  starting_proficiencies: [APIReference],
  starting_proficiency_options: StartingProficiencyOptions,
  subraces: [APIReference],
  traits: [APIReference],
  url: { type: String, index: true },
});

module.exports = mongoose.model('Race', Race, 'races');
