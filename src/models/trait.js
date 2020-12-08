const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TraitProficiency = new Schema({
  _id: false,
  index: String,
  name: String,
  url: String,
});

const TraitProficiency_choiceFrom = new Schema({
  _id: false,
  index: String,
  name: String,
  url: String,
});

const TraitProficiency_choice = new Schema({
  _id: false,
  choose: Number,
  from: [TraitProficiency_choiceFrom],
  type: String,
});

const TraitRace = new Schema({
  _id: false,
  index: String,
  name: String,
  url: String,
});

const TraitSubrace = new Schema({
  _id: false,
  index: String,
  name: String,
  url: String,
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
  proficiency_choices: TraitProficiency_choice,
  races: [TraitRace],
  subraces: [TraitSubrace],
  url: String,
});

module.exports = mongoose.model('Trait', Trait, 'traits');
