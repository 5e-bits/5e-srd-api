const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { APIReference } = require('./common');

const Proficiency = new Schema({
  _id: false,
  index: String,
  name: String,
  url: String,
});

const ProficiencyChoices = new Schema({
  _id: false,
  choose: Number,
  from: [APIReference],
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
  races: [APIReference],
  subraces: [APIReference],
  url: String,
});

module.exports = mongoose.model('Trait', Trait, 'traits');
