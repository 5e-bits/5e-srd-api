const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { NamedAPIResource } = require('./common');

const Skill = new Schema({
  _id: {
    type: String,
    select: false,
  },
  ability_score: NamedAPIResource,
  desc: [String],
  index: String,
  name: String,
  url: String,
});

module.exports = mongoose.model('Skill', Skill, 'skills');
