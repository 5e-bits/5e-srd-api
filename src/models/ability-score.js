var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AbilityScoreSchema = new Schema({
  index: String,
  name: String,
  url: String
});

module.exports = mongoose.model('AbilityScore', AbilityScoreSchema, 'ability-scores');
