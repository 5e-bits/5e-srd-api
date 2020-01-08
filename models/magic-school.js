var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MagicSchoolSchema = new Schema({
  index: String,
  name: String,
  url: String
});

module.exports = mongoose.model('MagicSchool', MagicSchoolSchema, 'magic-schools');
