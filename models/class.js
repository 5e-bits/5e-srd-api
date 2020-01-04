var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ClassSchema   = new Schema({
  index: String,
  name: String,
  url: String
});

module.exports = mongoose.model('Class', ClassSchema, 'classes');
