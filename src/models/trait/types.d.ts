import * as mongoose from 'mongoose';
import { APIReference, Choice, AreaOfEffect } from '../common/types';

type ActionDamage = {
  damage_type: APIReference;
  damage_at_character_level: Record<number, string>;
};

type Usage = {
  type: string;
  times: string;
};

type DC = {
  dc_type: APIReference;
  success_type: string;
};

type Action = {
  name: string;
  desc: string;
  usage: Usage;
  dc: DC;
  damage: ActionDamage[];
  area_of_effect: AreaOfEffect;
};

type TraitSpecific = {
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
  races?: APIReference[];
  subraces?: APIReference[];
  parent?: APIReference;
  trait_specific?: TraitSpecific;
  url: string;
};
