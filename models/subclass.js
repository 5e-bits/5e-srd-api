var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var SubclassSchema   = new Schema({
});

module.exports = mongoose.model('Subclass', SubclassSchema, 'subclasses');