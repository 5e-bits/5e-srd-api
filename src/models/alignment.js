const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Alignment = new Schema({
  _id: {
    type: String,
    select: false,
  },
  desc: String,
  abbreviation: String,
  index: String,
  name: String,
  url: String,
});

module.exports = mongoose.model('Alignment', Alignment, 'alignments');
