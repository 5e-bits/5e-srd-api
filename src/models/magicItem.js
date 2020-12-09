const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { APIReference } = require('./common');

const MagicItem = new Schema({
  _id: {
    type: String,
    select: false,
  },
  desc: [String],
  equipment_category: APIReference,
  index: String,
  name: String,
  url: String,
});

module.exports = mongoose.model('MagicItem', MagicItem, 'magic-items');
