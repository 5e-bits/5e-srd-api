var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ClassTableSchema   = new Schema({
});

module.exports = mongoose.model('ClassTable', ClassTableSchema, 'classtables');