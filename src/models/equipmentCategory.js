const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { APIReference } = require('./common');

const EquipmentCategory = new Schema({
  _id: {
    type: String,
    select: false,
  },
  equipment: [APIReference],
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

module.exports = mongoose.model('EquipmentCategory', EquipmentCategory, 'equipment-categories');
