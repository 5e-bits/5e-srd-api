var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var SpellcastingSchema   = new Schema({
    class: String,
    spellcasting_ability: String,
    level: Number
});

module.exports = mongoose.model('Spellcasting', SpellcastingSchema, 'spellcasting');