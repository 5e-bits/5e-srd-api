import * as mongoose from 'mongoose';
import { APIReference, APIReferenceSchema } from './common';

interface Equipment {
  equipment: APIReference;
  quantity: number;
}

const Equipment = {
  equipment: APIReferenceSchema,
  quantity: { type: Number, index: true },
};

interface StartingEquipmentOption {
  equipment: APIReference;
  quantity: number;
}

const StartingEquipmentOption = {
  equipment: APIReferenceSchema,
  quantity: { type: Number, index: true },
};

interface StartingEquipmentOptions {
  choose: number;
  from: StartingEquipmentOption[];
  type: string;
}

const StartingEquipmentOptions = {
  choose: { type: Number, index: true },
  from: [StartingEquipmentOption],
  type: { type: String, index: true },
};

interface ProficiencyChoice {
  choose: number;
  from: APIReference[];
  type: string;
}

const ProficiencyChoice = {
  choose: { type: Number, index: true },
  from: [APIReferenceSchema],
  type: { type: String, index: true },
};

interface SpellcastingInfo {
  desc: string[];
  name: string;
}

const SpellcastingInfo = new mongoose.Schema({
  desc: { type: [String], index: true },
  name: { type: String, index: true },
});

interface Spellcasting {
  info: SpellcastingInfo[];
  level: number;
  spellcasting_ability: APIReference;
}

const Spellcasting = {
  info: [SpellcastingInfo],
  level: { type: Number, index: true },
  spellcasting_ability: APIReferenceSchema,
};

interface MultiClassingPrereq {
  ability_score: APIReference;
  minimum_score: number;
}

const MultiClassingPrereq = {
  ability_score: APIReferenceSchema,
  minimum_score: { type: Number, index: true },
};

interface MultiClassingPrereqOptions {
  choose: number;
  from: MultiClassingPrereq[];
  type: string;
}

const MultiClassingPrereqOptions = {
  choose: { type: Number, index: true },
  from: [MultiClassingPrereq],
  type: { type: String, index: true },
};

interface MultiClassing {
  prerequisites?: MultiClassingPrereq[];
  prerequisite_options?: MultiClassingPrereqOptions;
  proficiencies?: APIReference[];
  proficiency_choices?: ProficiencyChoice[];
}

const MultiClassing = {
  prerequisites: [MultiClassingPrereq],
  prerequisite_options: MultiClassingPrereqOptions,
  proficiencies: [APIReferenceSchema],
  proficiency_choices: [ProficiencyChoice],
};

interface Class {
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
}

const Class = new mongoose.Schema<Class>({
  _id: { type: String, select: false },
  class_levels: { type: String, index: true },
  multi_classing: MultiClassing,
  hit_die: { type: Number, index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  proficiencies: [APIReferenceSchema],
  proficiency_choices: [ProficiencyChoice],
  saving_throws: [APIReferenceSchema],
  spellcasting: Spellcasting,
  spells: { type: String, index: true },
  starting_equipment: [Equipment],
  starting_equipment_options: [StartingEquipmentOptions],
  subclasses: [APIReferenceSchema],
  url: { type: String, index: true },
});

export default mongoose.model<Class>('Class', Class, 'classes');
