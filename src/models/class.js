const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { NamedAPIResource } = require('./common');

const ClassProficiencyChoice = new Schema({
  _id: false,
  choose: Number,
  from: [NamedAPIResource],
  type: String,
});

const ClassSpellcastingInfo = new Schema({
  _id: false,
  desc: [String],
  name: String,
});

const ClassSpellcasting = new Schema({
  _id: false,
  info: [ClassSpellcastingInfo],
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
  proficiency_choices: [ClassProficiencyChoice],
  saving_throws: [NamedAPIResource],
  spellcasting: ClassSpellcasting,
  spells: String,
  starting_equipment: String,
  subclasses: [NamedAPIResource],
  url: String,
});

module.exports = mongoose.model('Class', Class, 'classes');
