const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { NamedAPIResource } = require('./common');

const Reference = new Schema({
  _id: false,
  index: String,
  name: String,
  type: String,
  url: String,
});

const Proficiency = new Schema({
  _id: {
    type: String,
    select: false,
  },
  classes: [NamedAPIResource],
  index: String,
  name: String,
  races: [NamedAPIResource],
  references: [Reference],
  type: String,
  url: String,
});

module.exports = mongoose.model('Proficiency', Proficiency, 'proficiencies');
