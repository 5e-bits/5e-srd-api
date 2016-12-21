var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ClassTableSchema   = new Schema({
    name: String,
    class: String,
    subclass: String,
    level: Number,
    desc: String,
});

module.exports = mongoose.model('ClassTable', ClassTableSchema, 'classtables');