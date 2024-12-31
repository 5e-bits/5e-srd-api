import * as mongoose from 'mongoose';
import { APIReference, Choice, AreaOfEffect, DifficultyClass } from '../common/types';

type Proficiency = {
  _id?: boolean;
  index: string;
  name: string;
  url: string;
};

export type ActionDamage = {
  _id?: boolean;
  damage_type: APIReference;
  damage_at_character_level: Record<string, string>;
};

export type Usage = {
  _id?: boolean;
  type: string;
  times: number;
};

type Action = {
  _id?: boolean;
  name: string;
  desc: string;
  usage: Usage;
  dc: DifficultyClass;
  damage: ActionDamage[];
  area_of_effect: AreaOfEffect;
};

type TraitSpecific = {
  _id?: boolean;
  subtrait_options?: Choice;
  spell_options?: Choice;
  damage_type?: APIReference;
  breath_weapon?: Action;
};

export type Trait = {
  _id?: mongoose.Types.ObjectId;
  desc: string[];
  index: string;
  name: string;
  proficiencies?: APIReference[];
  proficiency_choices?: Choice;
  language_options?: Choice;
  races?: APIReference[];
  subraces?: APIReference[];
  parent?: APIReference;
  trait_specific?: TraitSpecific;
  url: string;
};
