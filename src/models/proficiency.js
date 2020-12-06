const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProficiencyClass = new Schema({
  index: String,
  name: String,
  url: String
});

const ProficiencyRace = new Schema({
  index: String,
  name: String,
  url: String
});

const ProficiencyReference = new Schema({
  index: String,
  name: String,
  type: String,
  url: String
});

const Proficiency = new Schema({
  _id: {
    type: String,
    select: false
  },
  classes: [ProficiencyClass],
  index: String,
  name: String,
  races: [ProficiencyRace],
  references: [ProficiencyReference],
  type: String,
  url: String
});

module.exports = mongoose.model('Proficiency', Proficiency, 'proficiencies');
