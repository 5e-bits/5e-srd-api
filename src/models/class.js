const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassSchema = new Schema({
  index: String,
  name: String,
  url: String
});

module.exports = mongoose.model('Class', ClassSchema, 'classes');
