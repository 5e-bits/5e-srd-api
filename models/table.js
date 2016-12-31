var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TableSchema   = new Schema({
    class: {
        name: String,
        url: String
    },
    url: String
});

module.exports = mongoose.model('Table', TableSchema, 'tables');