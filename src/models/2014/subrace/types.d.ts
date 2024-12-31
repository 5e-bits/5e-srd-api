import * as mongoose from 'mongoose';
import { APIReference, Choice } from '../common/types';

type AbilityBonus = {
  _id?: boolean;
  ability_score: APIReference;
  bonus: number;
};

export type Subrace = {
  _id?: mongoose.Types.ObjectId;
  ability_bonuses: AbilityBonus[];
  desc: string;
  index: string;
  language_options?: Choice;
  name: string;
  race: APIReference;
  racial_traits: APIReference[];
  starting_proficiencies?: APIReference[];
  url: string;
};
