const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { NamedAPIResource } = require('./common');

const TraitProficiency = new Schema({
  _id: false,
  index: String,
  name: String,
  url: String,
});

const TraitProficiencyChoice = new Schema({
  _id: false,
  choose: Number,
  from: [NamedAPIResource],
  type: String,
});

const Trait = new Schema({
  _id: {
    type: String,
    select: false,
  },
  desc: [String],
  index: String,
  name: String,
  proficiencies: [TraitProficiency],
  proficiency_choices: TraitProficiencyChoice,
  races: [NamedAPIResource],
  subraces: [NamedAPIResource],
  url: String,
});

module.exports = mongoose.model('Trait', Trait, 'traits');
