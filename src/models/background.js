const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { APIReference } = require('./common');

const LanguageOptions = new Schema({
  _id: false,
  choose: Number,
  from: [APIReference],
  type: String,
});

const Background = new Schema({
  _id: {
    type: String,
    select: false,
  },
  index: String,
  name: String,
  starting_proficiencies: [APIReference],
  language_options: LanguageOptions,
  url: String,
  starting_equipment: String,
  feature: APIReference,
  suggested_characteristics: String,
});

module.exports = mongoose.model('Background', Background, 'backgrounds');
