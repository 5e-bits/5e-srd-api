var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SkillSchema = new Schema({
  index: String,
  name: String,
  url: String
});

module.exports = mongoose.model('Skill', SkillSchema, 'skills');
