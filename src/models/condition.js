const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Condition = new Schema({
  _id: {
    type: String,
    select: false,
  },
  desc: {
    type: [String],
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

module.exports = mongoose.model('Condition', Condition, 'conditions');
