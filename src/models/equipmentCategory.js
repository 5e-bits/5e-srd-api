const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { APIReference } = require('./common');

const EquipmentCategory = new Schema({
  _id: {
    type: String,
    select: false,
  },
  equipment: [APIReference],
  index: String,
  name: String,
  url: String,
});

module.exports = mongoose.model('EquipmentCategory', EquipmentCategory, 'equipment-categories');
