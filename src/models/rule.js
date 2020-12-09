const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { NamedAPIResource } = require('./common');

const Rule = new Schema({
  _id: {
    type: String,
    select: false,
  },
  desc: String,
  index: String,
  name: String,
  subsections: [NamedAPIResource],
  url: String,
});

module.exports = mongoose.model('Rule', Rule, 'rules');
