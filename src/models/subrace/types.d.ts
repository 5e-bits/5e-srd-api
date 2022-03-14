import * as mongoose from 'mongoose';
import { APIReference } from '../common/types';

type AbilityBonus = {
  ability_score: APIReference;
  bonus: number;
};

type LanguageOptions = {
  choose: number;
  from: APIReference[];
  type: string;
};

export type Subrace = {
  _id?: mongoose.Types.ObjectId;
  ability_bonuses: AbilityBonus[];
  desc: string;
  index: string;
  language_options?: LanguageOptions;
  name: string;
  race: APIReference;
  racial_traits: APIReference[];
  starting_proficiencies?: APIReference[];
  url: string;
};
