import { Schema, model } from 'mongoose';
import {
  APIReferenceSchema,
  ChoiceSchema,
  AreaOfEffectSchema,
  DifficultyClassSchema,
} from '../common/index.js';
import { Proficiency, ActionDamage, Usage, Action, TraitSpecific, Trait } from './types';

const ProficiencySchema = new Schema<Proficiency>({
  _id: false,
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
});

const ActionDamageSchema = new Schema<ActionDamage>({
  _id: false,
  damage_type: APIReferenceSchema,
  // As this has keys that are numbers, we have to use an `Object`, which you can't query subfields
  damage_at_character_level: Object,
});

const UsageSchema = new Schema<Usage>({
  _id: false,
  type: { type: String, index: true },
  times: { type: Number, index: true },
});

const ActionSchema = new Schema<Action>({
  _id: false,
  name: { type: String, index: true },
  desc: { type: String, index: true },
  usage: UsageSchema,
  dc: DifficultyClassSchema,
  damage: [ActionDamageSchema],
  area_of_effect: AreaOfEffectSchema,
});

const TraitSpecificSchema = new Schema<TraitSpecific>({
  _id: false,
  subtrait_options: ChoiceSchema,
  spell_options: ChoiceSchema,
  damage_type: APIReferenceSchema,
  breath_weapon: ActionSchema,
});

const TraitSchema = new Schema<Trait>({
  _id: { type: String, select: false },
  desc: { type: [String], index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  proficiencies: [ProficiencySchema],
  proficiency_choices: ChoiceSchema,
  language_options: ChoiceSchema,
  races: [APIReferenceSchema],
  subraces: [APIReferenceSchema],
  parent: APIReferenceSchema,
  trait_specific: TraitSpecificSchema,
  url: { type: String, index: true },
});

export default model('Trait', TraitSchema, 'traits');
