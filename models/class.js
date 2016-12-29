var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ClassSchema   = new Schema({
});

module.exports = mongoose.model('Class', ClassSchema, 'classes');