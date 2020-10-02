var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SpellSchema = new Schema({
  _id: {
    type: String,
    select: false
  },
  index: String,
  name: String,
  level: Number,
  url: String
});

module.exports = mongoose.model('Spell', SpellSchema, 'spells');
