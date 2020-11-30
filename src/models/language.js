const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Language = new Schema({
  _id: {
    type: String,
    select: false
  },
  desc: String,
  index: String,
  name: String,
  script: String,
  type: String,
  typical_speakers: [String],
  url: String
});

module.exports = mongoose.model('Language', Language, 'languages');
