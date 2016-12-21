var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ClassSchema   = new Schema({
    name: String
});

module.exports = mongoose.model('Class', ClassSchema, 'spells');