var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RaceSchema = new Schema({
  index: String,
  name: String,
  url: String
});

module.exports = mongoose.model('Race', RaceSchema, 'races');
