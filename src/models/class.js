const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassSchema = new Schema({
  _id: {
    type: String,
    select: false,
  },
  index: String,
  name: String,
  spellcasting: Object,
  url: String,
});

module.exports = mongoose.model('Class', ClassSchema, 'classes');
