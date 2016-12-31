var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var SubraceSchema   = new Schema({
    name: String,
    url: String
});

module.exports = mongoose.model('Subrace', SubraceSchema, 'subraces');