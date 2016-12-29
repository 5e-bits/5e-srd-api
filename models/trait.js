var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TraitSchema   = new Schema({
});

module.exports = mongoose.model('Trait', TraitSchema, 'traits');
