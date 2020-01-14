var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConditionSchema = new Schema({
  index: String,
  name: String,
  url: String
});

module.exports = mongoose.model('Condition', ConditionSchema, 'conditions');
