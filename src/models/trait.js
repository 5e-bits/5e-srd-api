const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { APIReference } = require('./common');

const Proficiency = {
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
};

const ProficiencyChoices = {
  choose: { type: Number, index: true },
  from: [APIReference],
  type: { type: String, index: true },
};

const Choice = {
  choose: { type: Number, index: true },
  from: [APIReference],
  type: { type: String, index: true },
};

const ActionDamage = {
  damage_type: APIReference,
  // As this has keys that are numbers, we have to use an `Object`, which you can't query subfields
  damage_at_character_level: Object
};

const Usage = {
  type: { type: String, index: true },
  times: { type: Number, index: true }
};

const DC = {
  dc_type: APIReference,
  success_type: { type: String, index: true }
};

const Action = {
  name: { type: String, index: true },
  desc: { type: String, index: true },
  usage: Usage,
  dc: DC,
  damage: [ActionDamage],
};

const TraitSpecific = {
  subtrait_options: Choice,
  spell_options: Choice,
  damage_type: APIReference,
  breath_weapon: Action
};

const Trait = new Schema({
  _id: { type: String, select: false },
  desc: { type: [String], index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  proficiencies: [Proficiency],
  proficiency_choices: ProficiencyChoices,
  races: [APIReference],
  subraces: [APIReference],
  parent: APIReference,
  trait_specific: TraitSpecific,
  url: { type: String, index: true },
});

module.exports = mongoose.model('Trait', Trait, 'traits');
