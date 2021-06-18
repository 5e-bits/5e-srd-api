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

const Trait = new Schema({
  _id: { type: String, select: false },
  desc: { type: [String], index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  proficiencies: [Proficiency],
  proficiency_choices: ProficiencyChoices,
  races: [APIReference],
  subraces: [APIReference],
  url: { type: String, index: true },
});

module.exports = mongoose.model('Trait', Trait, 'traits');
