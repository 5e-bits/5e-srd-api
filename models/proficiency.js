var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ProficiencySchema   = new Schema({
    name: String,
    type: String,
    classes: [String]
});

module.exports = mongoose.model('Proficiency', ProficiencySchema, 'proficiencies');