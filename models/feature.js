var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FeatureSchema = new Schema({
  index: String,
  name: String,
  class: {
    name: String,
    url: String
  },
  subclass: {
    name: String,
    url: String
  },
  level: Number,
  desc: [String],
  url: String
});

module.exports = mongoose.model('Feature', FeatureSchema, 'features');
