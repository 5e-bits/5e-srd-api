import * as mongoose from 'mongoose';
import { APIReference } from '../common/types';

type Equipment = {
  equipment: APIReference;
  quantity: number;
};

type StartingEquipmentOption = {
  equipment: APIReference;
  quantity: number;
};

type StartingEquipmentOptions = {
  choose: number;
  from: StartingEquipmentOption[];
  type: string;
};

type ProficiencyChoice = {
  choose: number;
  from: APIReference[];
  type: string;
};

type SpellcastingInfo = {
  desc: string[];
  name: string;
};

type Spellcasting = {
  info: SpellcastingInfo[];
  level: number;
  spellcasting_ability: APIReference;
};

type MultiClassingPrereq = {
  ability_score: APIReference;
  minimum_score: number;
};

type MultiClassingPrereqOptions = {
  choose: number;
  from: MultiClassingPrereq[];
  type: string;
};

type MultiClassing = {
  prerequisites?: MultiClassingPrereq[];
  prerequisite_options?: MultiClassingPrereqOptions;
  proficiencies?: APIReference[];
  proficiency_choices?: ProficiencyChoice[];
};

export type Class = {
  _id?: mongoose.Types.ObjectId;
  class_levels: string;
  multi_classing: MultiClassing;
  hit_die: number;
  index: string;
  name: string;
  proficiencies: APIReference[];
  proficiency_choices: ProficiencyChoice[];
  saving_throws: APIReference[];
  spellcasting?: Spellcasting;
  spells?: string;
  starting_equipment?: Equipment[];
  starting_equipment_options: StartingEquipmentOptions[];
  subclasses: APIReference[];
  url: string;
};
