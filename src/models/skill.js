const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { APIReference } = require('./common');

const Skill = new Schema({
  _id: {
    type: String,
    select: false,
  },
  ability_score: APIReference,
  desc: {
    type: [String],
    index: true,
  },
  index: {
    type: String,
    index: true,
  },
  name: {
    type: String,
    index: true,
  },
  url: {
    type: String,
    index: true,
  },
});

module.exports = mongoose.model('Skill', Skill, 'skills');
