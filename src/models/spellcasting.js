var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SpellcastingSchema = new Schema({
  index: String,
  class: {
    name: String,
    url: String
  },
  url: String
});

module.exports = mongoose.model('Spellcasting', SpellcastingSchema, 'spellcasting');
