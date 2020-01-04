var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MonsterSchema   = new Schema({
  index: String,
  name: String,
  url: String
});

module.exports = mongoose.model('Monster', MonsterSchema, 'monsters');
