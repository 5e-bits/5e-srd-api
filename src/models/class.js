const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { NamedAPIResource } = require('./common');

const ProficiencyChoice = new Schema({
  _id: false,
  choose: Number,
  from: [NamedAPIResource],
  type: String,
});

const SpellcastingInfo = new Schema({
  _id: false,
  desc: [String],
  name: String,
});

const Spellcasting = new Schema({
  _id: false,
  info: [SpellcastingInfo],
  level: Number,
  spellcasting_ability: NamedAPIResource,
});

const Class = new Schema({
  _id: {
    type: String,
    select: false,
  },
  class_levels: String,
  hit_die: Number,
  index: String,
  name: String,
  proficiencies: [NamedAPIResource],
  proficiency_choices: [ProficiencyChoice],
  saving_throws: [NamedAPIResource],
  spellcasting: Spellcasting,
  spells: String,
  starting_equipment: String,
  subclasses: [NamedAPIResource],
  url: String,
});

module.exports = mongoose.model('Class', Class, 'classes');
