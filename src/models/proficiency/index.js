const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { APIReference } = require('../common');

const Reference = new Schema({
  _id: false,
  index: { type: String, index: true },
  name: { type: String, index: true },
  type: { type: String, index: true },
  url: { type: String, index: true },
});

const Proficiency = new Schema({
  _id: { type: String, select: false },
  classes: [APIReference],
  index: { type: String, index: true },
  name: { type: String, index: true },
  races: [APIReference],
  reference: Reference,
  type: { type: String, index: true },
  url: { type: String, index: true },
});

module.exports = mongoose.model('Proficiency', Proficiency, 'proficiencies');
