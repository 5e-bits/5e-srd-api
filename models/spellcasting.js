var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var SpellcastingSchema   = new Schema({
});

module.exports = mongoose.model('Spellcasting', SpellcastingSchema, 'spellcasting');