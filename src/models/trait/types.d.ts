import * as mongoose from 'mongoose';
import { APIReference } from '../common/types';

type ProficiencyChoices = {
  choose: number;
  from: APIReference[];
  type: string;
};

type Choice = {
  choose: number;
  from: APIReference[];
  type: string;
};

type ActionDamage = {
  damage_type: APIReference;
  damage_at_character_level: Record<number, string>;
};

type Useage = {
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
  usage: Useage;
  dc: DC;
  damage: ActionDamage[];
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
  proficiency_choices?: ProficiencyChoices;
  races?: APIReference[];
  subraces?: APIReference[];
  parent?: APIReference;
  trait_specific?: TraitSpecific;
  url: string;
};
