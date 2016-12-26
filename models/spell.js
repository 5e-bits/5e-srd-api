var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var SpellSchema   = new Schema({
    index: Number,
    name: String,
    desc: [String],
    higher_level: [String],
    page: String,
    range: String,
    components: [String],
    ritual: String,
    duration: String,
    concentration: String,
    casting_time: String,
    level: Number,
    school: String,
    classes: [String]
});

module.exports = mongoose.model('Spell', SpellSchema, 'spells');