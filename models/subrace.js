var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var SubraceSchema   = new Schema({
});

module.exports = mongoose.model('Subrace', SubraceSchema, 'subraces');