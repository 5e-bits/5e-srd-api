var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TableSchema   = new Schema({
});

module.exports = mongoose.model('Table', TableSchema, 'tables');