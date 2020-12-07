const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MagicItemEquipmentCategory = new Schema({
  index: String,
  name: String,
  url: String,
});

const MagicItem = new Schema({
  _id: {
    type: String,
    select: false,
  },
  desc: [String],
  equipment_category: MagicItemEquipmentCategory,
  index: String,
  name: String,
  url: String,
});

module.exports = mongoose.model('MagicItem', MagicItem, 'magic-items');
