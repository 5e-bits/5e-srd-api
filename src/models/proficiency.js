var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProficiencySchema = new Schema({
  index: String,
  name: String,
  url: String
});

module.exports = mongoose.model('Proficiency', ProficiencySchema, 'proficiencies');
