import * as mongoose from 'mongoose';
import { APIReference, APIReferenceSchema } from './common';

interface AbilityBonus {
  ability_score: APIReference;
  bonus: number;
}

const AbilityBonus = {
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

interface Subrace {
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
}

const Subrace = new mongoose.Schema<Subrace>({
  _id: { type: String, select: false },
  ability_bonuses: [AbilityBonus],
  desc: { type: String, index: true },
  index: { type: String, index: true },
  language_options: LanguageOptions,
  name: { type: String, index: true },
  race: APIReferenceSchema,
  racial_traits: [APIReferenceSchema],
  starting_proficiencies: [APIReferenceSchema],
  url: { type: String, index: true },
});

export default mongoose.model<Subrace>('Subrace', Subrace, 'subraces');
