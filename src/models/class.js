const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { APIReference } = require('./common');

const Equipment = new Schema({
  _id: false,
  equipment: APIReference,
  quantity: Number,
});

const StartingEquipmentOption = new Schema({
  _id: false,
  equipment: APIReference,
  quantity: Number,
});

const StartingEquipmentOptions = new Schema({
  _id: false,
  choose: Number,
  from: [StartingEquipmentOption],
  type: String,
});

const ProficiencyChoice = new Schema({
  _id: false,
  choose: Number,
  from: [APIReference],
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
  spellcasting_ability: APIReference,
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
  proficiencies: [APIReference],
  proficiency_choices: [ProficiencyChoice],
  saving_throws: [APIReference],
  spellcasting: Spellcasting,
  spells: String,
  starting_equipment: [Equipment],
  starting_equipment_options: [StartingEquipmentOptions],
  subclasses: [APIReference],
  url: String,
});

module.exports = mongoose.model('Class', Class, 'classes');
