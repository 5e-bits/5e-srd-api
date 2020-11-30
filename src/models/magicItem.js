const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MagicItemSchema = new Schema({
  _id: {
    type: String,
    select: false
  },
  index: String,
  name: String,
  url: String
});

module.exports = mongoose.model('MagicItem', MagicItemSchema, 'magic-items');
