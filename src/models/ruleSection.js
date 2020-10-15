var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RuleSectionSchema = new Schema({
  _id: {
    type: String,
    select: false
  },
  index: String,
  name: String,
  url: String
});

module.exports = mongoose.model('RuleSection', RuleSectionSchema, 'rule-sections');
