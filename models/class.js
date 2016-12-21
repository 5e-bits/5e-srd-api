var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ClassSchema   = new Schema({
    name: String,
    hit_die: Number,
    flavor_text: String,
});

module.exports = mongoose.model('Class', ClassSchema, 'classes');