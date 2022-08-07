import { APIReference, Choice } from '../common/index.js';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Proficiency = new Schema({
  _id: false,
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
});

const ActionDamage = new Schema({
  _id: false,
  damage_type: APIReference,
  // As this has keys that are numbers, we have to use an `Object`, which you can't query subfields
  damage_at_character_level: Object,
});

const Usage = new Schema({
  _id: false,
  type: { type: String, index: true },
  times: { type: Number, index: true },
});

const DC = new Schema({
  _id: false,
  dc_type: APIReference,
  success_type: { type: String, index: true },
});

const Action = new Schema({
  _id: false,
  name: { type: String, index: true },
  desc: { type: String, index: true },
  usage: Usage,
  dc: DC,
  damage: [ActionDamage],
  size_and_shape: { type: String, index: true },
});

const TraitSpecific = new Schema({
  _id: false,
  subtrait_options: Choice,
  spell_options: Choice,
  damage_type: APIReference,
  breath_weapon: Action,
});

const Trait = new Schema({
  _id: { type: String, select: false },
  desc: { type: [String], index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  proficiencies: [Proficiency],
  proficiency_choices: Choice,
  language_options: Choice,
  races: [APIReference],
  subraces: [APIReference],
  parent: APIReference,
  trait_specific: TraitSpecific,
  url: { type: String, index: true },
});

export default mongoose.model('Trait', Trait, 'traits');
