var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TraitSchema   = new Schema({
    name: String,
    url: String
});

module.exports = mongoose.model('Trait', TraitSchema, 'traits');
