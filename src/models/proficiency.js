const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { APIReference } = require('./common');

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
  classes: [APIReference],
  index: String,
  name: String,
  races: [APIReference],
  references: [Reference],
  type: String,
  url: String,
});

module.exports = mongoose.model('Proficiency', Proficiency, 'proficiencies');
