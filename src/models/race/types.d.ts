import * as mongoose from 'mongoose';
import { APIReference } from '../common/types';

type AbilityBonusOption = {
  ability_score: APIReference;
  bonus: number;
};

type RaceAbilityBonusOptions = {
  choose: number;
  from: AbilityBonusOption[];
  type: string;
};

type RaceAbilityBonus = {
  ability_score: APIReference;
  bonus: number;
};

type LanguageOptions = {
  choose: number;
  from: APIReference[];
  type: string;
};

type StartingProficiencyOptions = {
  choose: number;
  from: APIReference[];
  type: string;
};

export type Race = {
  _id?: mongoose.Types.ObjectId;
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
  starting_proficiencies?: APIReference[];
  starting_proficiency_options?: StartingProficiencyOptions;
  subraces?: APIReference[];
  traits?: APIReference[];
  url: string;
};
