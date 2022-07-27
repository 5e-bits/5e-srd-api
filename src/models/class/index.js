import { APIReference } from '../common/index.js';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Equipment = new Schema({
  _id: false,
  equipment: APIReference,
  quantity: { type: Number, index: true },
});

const StartingEquipmentOption = new Schema({
  _id: false,
  equipment: APIReference,
  quantity: { type: Number, index: true },
});

const StartingEquipmentOptions = new Schema({
  _id: false,
  choose: { type: Number, index: true },
  from: [StartingEquipmentOption],
  type: { type: String, index: true },
});

const ProficiencyChoice = new Schema({
  _id: false,
  choose: { type: Number, index: true },
  from: [APIReference],
  type: { type: String, index: true },
});

const SpellcastingInfo = new Schema({
  _id: false,
  desc: { type: [String], index: true },
  name: { type: String, index: true },
});

const Spellcasting = new Schema({
  _id: false,
  info: [SpellcastingInfo],
  level: { type: Number, index: true },
  spellcasting_ability: APIReference,
});

const MultiClassingPrereq = new Schema({
  _id: false,
  ability_score: APIReference,
  minimum_score: { type: Number, index: true },
});

const MultiClassingPrereqOptions = new Schema({
  _id: false,
  choose: { type: Number, index: true },
  from: [MultiClassingPrereq],
  type: { type: String, index: true },
});

const MultiClassing = new Schema({
  _id: false,
  prerequisites: { type: [MultiClassingPrereq], default: undefined },
  prerequisite_options: { type: MultiClassingPrereqOptions, default: undefined },
  proficiencies: { type: [APIReference], default: undefined },
  proficiency_choices: { type: [ProficiencyChoice], default: undefined },
});

const Class = new Schema({
  _id: { type: String, select: false },
  class_levels: { type: String, index: true },
  multi_classing: MultiClassing,
  hit_die: { type: Number, index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  proficiencies: [APIReference],
  proficiency_choices: [ProficiencyChoice],
  saving_throws: [APIReference],
  spellcasting: Spellcasting,
  spells: { type: String, index: true },
  starting_equipment: [Equipment],
  starting_equipment_options: [StartingEquipmentOptions],
  subclasses: [APIReference],
  url: { type: String, index: true },
});

export default mongoose.model('Class', Class, 'classes');
