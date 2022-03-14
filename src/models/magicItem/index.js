const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { APIReference } = require('../common');

const MagicItem = new Schema({
  _id: { type: String, select: false },
  desc: { type: [String], index: true },
  equipment_category: APIReference,
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
});

module.exports = mongoose.model('MagicItem', MagicItem, 'magic-items');
