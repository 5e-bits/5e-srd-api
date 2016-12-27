var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var RaceSchema   = new Schema({
});

module.exports = mongoose.model('Race', RaceSchema, 'races');