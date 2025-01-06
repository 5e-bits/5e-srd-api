import * as mongoose from 'mongoose';
import { APIReference, Choice } from '../common/types';

type Equipment = {
  _id?: boolean;
  equipment: APIReference;
  quantity: number;
};

type StartingEquipmentOption = {
  equipment: APIReference;
  quantity: number;
};

type SpellcastingInfo = {
  _id?: boolean;
  desc: string[];
  name: string;
};

type Spellcasting = {
  _id?: boolean;
  info: SpellcastingInfo[];
  level: number;
  spellcasting_ability: APIReference;
};

type MultiClassingPrereq = {
  _id?: boolean;
  ability_score: APIReference;
  minimum_score: number;
};

type MultiClassing = {
  _id?: boolean;
  prerequisites?: MultiClassingPrereq[];
  prerequisite_options?: Choice;
  proficiencies?: APIReference[];
  proficiency_choices?: Choice[];
};

export type Class = {
  _id?: mongoose.Types.ObjectId;
  class_levels: string;
  multi_classing: MultiClassing;
  hit_die: number;
  index: string;
  name: string;
  proficiencies: APIReference[];
  proficiency_choices: Choice[];
  saving_throws: APIReference[];
  spellcasting?: Spellcasting;
  spells?: string;
  starting_equipment?: Equipment[];
  starting_equipment_options: Choice[];
  subclasses: APIReference[];
  url: string;
};
