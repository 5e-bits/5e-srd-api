var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LevelSchema = new Schema({
  index: String,
  level: Number,
  url: String
});

module.exports = mongoose.model('Level', LevelSchema, 'levels');
