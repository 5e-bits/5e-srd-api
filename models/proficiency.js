var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ProficiencySchema   = new Schema({
});

module.exports = mongoose.model('Proficiency', ProficiencySchema, 'proficiencies');