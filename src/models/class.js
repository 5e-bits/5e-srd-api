const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassProficiency = new Schema({
  _id: false,
  index: String,
  name: String,
  url: String,
});

const ClassProficiencyChoiceFrom = new Schema({
  _id: false,
  index: String,
  name: String,
  url: String,
});

const ClassProficiencyChoice = new Schema({
  _id: false,
  choose: Number,
  from: [ClassProficiencyChoiceFrom],
  type: String,
});

const ClassSavingThrow = new Schema({
  _id: false,
  index: String,
  name: String,
  url: String,
});

const ClassSpellcastingInfo = new Schema({
  _id: false,
  desc: [String],
  name: String,
});

const ClassSpellcastingSpellcastingAbility = new Schema({
  _id: false,
  index: String,
  name: String,
  url: String,
});

const ClassSpellcasting = new Schema({
  _id: false,
  info: [ClassSpellcastingInfo],
  level: Number,
  spellcasting_ability: ClassSpellcastingSpellcastingAbility,
});

const ClassSubclass = new Schema({
  _id: false,
  index: String,
  name: String,
  url: String,
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
  proficiencies: [ClassProficiency],
  proficiency_choices: [ClassProficiencyChoice],
  saving_throws: [ClassSavingThrow],
  spellcasting: ClassSpellcasting,
  spells: String,
  starting_equipment: String,
  subclasses: [ClassSubclass],
  url: String,
});

module.exports = mongoose.model('Class', Class, 'classes');
