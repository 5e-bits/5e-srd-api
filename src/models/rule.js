const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RuleSubsection = new Schema({
  index: String,
  name: String,
  url: String,
});

const Rule = new Schema({
  _id: {
    type: String,
    select: false,
  },
  desc: String,
  index: String,
  name: String,
  subsections: [RuleSubsection],
  url: String,
});

module.exports = mongoose.model('Rule', Rule, 'rules');
