const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { NamedAPIResource } = require('./common');

const EquipmentCategory = new Schema({
  _id: {
    type: String,
    select: false,
  },
  equipment: [NamedAPIResource],
  index: String,
  name: String,
  url: String,
});

module.exports = mongoose.model('EquipmentCategory', EquipmentCategory, 'equipment-categories');
