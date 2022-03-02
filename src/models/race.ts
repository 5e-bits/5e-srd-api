import * as mongoose from 'mongoose';
import { APIReference, APIReferenceSchema } from './common';

interface AbilityBonusOption {
  ability_score: APIReference;
  bonus: number;
}

const AbilityBonusOption = {
  ability_score: APIReferenceSchema,
  bonus: { type: Number, index: true },
};

interface RaceAbilityBonusOptions {
  choose: number;
  from: AbilityBonusOption[];
  type: string;
}

const RaceAbilityBonusOptions = {
  choose: { type: Number, index: true },
  from: [AbilityBonusOption],
  type: { type: String, index: true },
};

interface RaceAbilityBonus {
  ability_score: APIReference;
  bonus: number;
}

const RaceAbilityBonus = {
  ability_score: APIReferenceSchema,
  bonus: { type: Number, index: true },
};

interface LanguageOptions {
  choose: number;
  from: APIReference[];
  type: string;
}

const LanguageOptions = {
  choose: { type: Number, index: true },
  from: [APIReferenceSchema],
  type: { type: String, index: true },
};

interface StartingProficiencyOptions {
  choose: number;
  from: APIReference[];
  type: string;
}

const StartingProficiencyOptions = {
  choose: { type: Number, index: true },
  from: [APIReferenceSchema],
  type: { type: String, index: true },
};

interface Race {
  _id?: string;
  ability_bonus_options?: RaceAbilityBonusOptions;
  ability_bonuses: RaceAbilityBonus[];
  age: string;
  alignment: string;
  index: string;
  language_desc: string;
  language_options: LanguageOptions;
  languages: APIReference[];
  name: string;
  size: string;
  size_description: string;
  speed: number;
  starting_proficiencies: APIReference[];
  starting_proficiency_options?: StartingProficiencyOptions;
  subraces: APIReference[];
  traits: APIReference[];
  url: string;
}

const Race = new mongoose.Schema<Race>({
  _id: { type: String, select: false },
  ability_bonus_options: RaceAbilityBonusOptions,
  ability_bonuses: [RaceAbilityBonus],
  age: { type: String, index: true },
  alignment: { type: String, index: true },
  index: { type: String, index: true },
  language_desc: { type: String, index: true },
  language_options: LanguageOptions,
  languages: [APIReferenceSchema],
  name: { type: String, index: true },
  size: { type: String, index: true },
  size_description: { type: String, index: true },
  speed: { type: Number, index: true },
  starting_proficiencies: [APIReferenceSchema],
  starting_proficiency_options: StartingProficiencyOptions,
  subraces: [APIReferenceSchema],
  traits: [APIReferenceSchema],
  url: { type: String, index: true },
});

export default mongoose.model<Race>('Race', Race, 'races');
