var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var SubclassSchema   = new Schema({
    class: String,
    name: String,
});

module.exports = mongoose.model('Subclass', SubclassSchema, 'subclasses');