var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TraitSchema = new Schema({
  index: String,
  name: String,
  url: String
});

module.exports = mongoose.model('Trait', TraitSchema, 'traits');
