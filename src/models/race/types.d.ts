import * as mongoose from 'mongoose';
import { APIReference, Choice } from '../common/types';

type RaceAbilityBonus = {
  _id?: boolean;
  ability_score: APIReference;
  bonus: number;
};

export type Race = {
  _id?: mongoose.Types.ObjectId;
  ability_bonus_options?: Choice;
  ability_bonuses: RaceAbilityBonus[];
  age: string;
  alignment: string;
  index: string;
  language_desc: string;
  language_options: Choice;
  languages: APIReference[];
  name: string;
  size: string;
  size_description: string;
  speed: number;
  starting_proficiencies?: APIReference[];
  starting_proficiency_options?: Choice;
  subraces?: APIReference[];
  traits?: APIReference[];
  url: string;
};
