import { Schema, model } from 'mongoose';
import { APIReferenceSchema, ChoiceSchema } from '../common/index.js';
import {
  Class,
  Equipment,
  SpellcastingInfo,
  Spellcasting,
  MultiClassingPrereq,
  MultiClassing,
} from './types';

const EquipmentSchema = new Schema<Equipment>({
  _id: false,
  equipment: APIReferenceSchema,
  quantity: { type: Number, index: true },
});

const SpellcastingInfoSchema = new Schema<SpellcastingInfo>({
  _id: false,
  desc: { type: [String], index: true },
  name: { type: String, index: true },
});

const SpellcastingSchema = new Schema<Spellcasting>({
  _id: false,
  info: [SpellcastingInfoSchema],
  level: { type: Number, index: true },
  spellcasting_ability: APIReferenceSchema,
});

const MultiClassingPrereqSchema = new Schema<MultiClassingPrereq>({
  _id: false,
  ability_score: APIReferenceSchema,
  minimum_score: { type: Number, index: true },
});

const MultiClassingSchema = new Schema<MultiClassing>({
  _id: false,
  prerequisites: { type: [MultiClassingPrereqSchema], default: undefined },
  prerequisite_options: { type: ChoiceSchema, default: undefined },
  proficiencies: { type: [APIReferenceSchema], default: undefined },
  proficiency_choices: { type: [ChoiceSchema], default: undefined },
});

const ClassSchema = new Schema<Class>({
  _id: { type: String, select: false },
  class_levels: { type: String, index: true },
  multi_classing: MultiClassingSchema,
  hit_die: { type: Number, index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  proficiencies: [APIReferenceSchema],
  proficiency_choices: [ChoiceSchema],
  saving_throws: [APIReferenceSchema],
  spellcasting: SpellcastingSchema,
  spells: { type: String, index: true },
  starting_equipment: [EquipmentSchema],
  starting_equipment_options: [ChoiceSchema],
  subclasses: [APIReferenceSchema],
  url: { type: String, index: true },
});

export default model('Class', ClassSchema, 'classes');
