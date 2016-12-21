var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ClassTableSchema   = new Schema({
    name: String,
    class: String
});

module.exports = mongoose.model('ClassTable', ClassTableSchema, 'classtables');