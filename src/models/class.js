const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { APIReference } = require('./common');

const Equipment = {
  equipment: APIReference,
  quantity: {
    type: Number,
    index: true,
  },
};

const StartingEquipmentOption = {
  equipment: APIReference,
  quantity: {
    type: Number,
    index: true,
  },
};

const StartingEquipmentOptions = {
  choose: {
    type: Number,
    index: true,
  },
  from: [StartingEquipmentOption],
  type: {
    type: String,
    index: true,
  },
};

const ProficiencyChoice = {
  choose: {
    type: Number,
    index: true,
  },
  from: [APIReference],
  type: {
    type: String,
    index: true,
  },
};

const SpellcastingInfo = new Schema({
  desc: {
    type: [String],
    index: true,
  },
  name: {
    type: String,
    index: true,
  },
});

const Spellcasting = {
  info: [SpellcastingInfo],
  level: {
    type: Number,
    index: true,
  },
  spellcasting_ability: APIReference,
};

const Class = new Schema({
  _id: {
    type: String,
    select: false,
  },
  class_levels: {
    type: String,
    index: true,
  },
  hit_die: {
    type: Number,
    index: true,
  },
  index: {
    type: String,
    index: true,
  },
  name: {
    type: String,
    index: true,
  },
  proficiencies: [APIReference],
  proficiency_choices: [ProficiencyChoice],
  saving_throws: [APIReference],
  spellcasting: Spellcasting,
  spells: {
    type: String,
    index: true,
  },
  starting_equipment: [Equipment],
  starting_equipment_options: [StartingEquipmentOptions],
  subclasses: [APIReference],
  url: {
    type: String,
    index: true,
  },
});

module.exports = mongoose.model('Class', Class, 'classes');
