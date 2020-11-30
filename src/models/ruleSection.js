const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RuleSectionSchema = new Schema({
  _id: {
    type: String,
    select: false
  },
  desc: String,
  index: String,
  name: String,
  url: String
});

module.exports = mongoose.model('RuleSection', RuleSectionSchema, 'rule-sections');
