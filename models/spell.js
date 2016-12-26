var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var SpellSchema   = new Schema({
});

module.exports = mongoose.model('Spell', SpellSchema, 'spells');