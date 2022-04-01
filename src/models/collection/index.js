const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Collection = new Schema({
  _id: { type: String, select: false },
  index: { type: String, index: true },
});

module.exports = mongoose.model('Collection', Collection, 'collections');
