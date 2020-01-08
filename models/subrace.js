var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SubraceSchema = new Schema({
  index: String,
  name: String,
  url: String
});

module.exports = mongoose.model('Subrace', SubraceSchema, 'subraces');
