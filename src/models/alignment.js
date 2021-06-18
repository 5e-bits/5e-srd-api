const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Alignment = new Schema({
  _id: {
    type: String,
    select: false,
    index: false,
  },
  desc: {
    type: String,
    index: true,
  },
  abbreviation: {
    type: String,
    index: true,
  },
  index: {
    type: String,
    index: true,
  },
  name: {
    type: String,
    index: true,
  },
  url: {
    type: String,
    index: true,
  },
});

module.exports = mongoose.model('Alignment', Alignment, 'alignments');
