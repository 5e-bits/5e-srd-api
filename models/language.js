var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LanguageSchema = new Schema({
  index: String,
  name: String,
  url: String
});

module.exports = mongoose.model('Language', LanguageSchema, 'languages');
