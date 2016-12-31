var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var SkillSchema   = new Schema({
    name: String,
    url: String
});

module.exports = mongoose.model('Skill', SkillSchema, 'skills');