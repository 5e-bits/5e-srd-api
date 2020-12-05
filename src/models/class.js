const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassProficiencyChoiceFrom = new Schema({
  index: String,
  name: String,
  url: String,
});

const ClassProficiencyChoice = new Schema({
  choose: Number,
  from: [ClassProficiencyChoiceFrom],
  type: String,
});

const ClassProficiency = new Schema({
  index: String,
  name: String,
  url: String,
});

const ClassSavingThrow = new Schema({
  index: String,
  name: String,
  url: String,
});

const ClassSpellcastingInfo = new Schema({
  desc: [String],
  name: String,
});

const ClassSpellcastingSpellcastingAbility = new Schema({
  index: String,
  name: String,
  url: String,
});

const ClassSpellcasting = new Schema({
  info: [ClassSpellcastingInfo],
  level: Number,
  spellcasting_ability: ClassSpellcastingSpellcastingAbility,
});

const ClassSubclass = new Schema({
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
