const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { NamedAPIResource } = require('./common');

const Proficiency = new Schema({
  _id: false,
  index: String,
  name: String,
  url: String,
});

const ProficiencyChoices = new Schema({
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
  proficiencies: [Proficiency],
  proficiency_choices: ProficiencyChoices,
  races: [NamedAPIResource],
  subraces: [NamedAPIResource],
  url: String,
});

module.exports = mongoose.model('Trait', Trait, 'traits');
