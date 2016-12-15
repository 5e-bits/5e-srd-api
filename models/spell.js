var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var SpellSchema   = new Schema({
    name: String,
    desc: String,
    level: Number
});

module.exports = mongoose.model('Spell', SpellSchema, 'spells');