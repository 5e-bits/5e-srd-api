var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MagicSchoolSchema = new Schema({
  _id: {
    type: String,
    select: false
  },
  index: String,
  name: String,
  url: String
});

module.exports = mongoose.model('MagicSchool', MagicSchoolSchema, 'magic-schools');
