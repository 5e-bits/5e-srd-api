const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { APIReference, Choice } = require('../common');

const Equipment = new Schema({
  _id: false,
  equipment: APIReference,
  quantity: { type: Number, index: true },
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

const MultiClassing = new Schema({
  _id: false,
  prerequisites: { type: [MultiClassingPrereq], default: undefined },
  prerequisite_options: { type: Choice, default: undefined },
  proficiencies: { type: [APIReference], default: undefined },
  proficiency_choices: { type: [Choice], default: undefined },
});

const Class = new Schema({
  _id: { type: String, select: false },
  class_levels: { type: String, index: true },
  multi_classing: MultiClassing,
  hit_die: { type: Number, index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  proficiencies: [APIReference],
  proficiency_choices: [Choice],
  saving_throws: [APIReference],
  spellcasting: Spellcasting,
  spells: { type: String, index: true },
  starting_equipment: [Equipment],
  starting_equipment_options: [Choice],
  subclasses: [APIReference],
  url: { type: String, index: true },
});

module.exports = mongoose.model('Class', Class, 'classes');
