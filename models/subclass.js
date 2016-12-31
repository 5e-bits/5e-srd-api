var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var SubclassSchema   = new Schema({
    name: String,
    url: String
});

module.exports = mongoose.model('Subclass', SubclassSchema, 'subclasses');