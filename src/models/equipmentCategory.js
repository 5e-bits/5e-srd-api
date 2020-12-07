const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EquipmentCategoryEquipment = new Schema({
  index: String,
  name: String,
  url: String
});
const EquipmentCategory = new Schema({
  _id: {
    type: String,
    select: false
  },
  equipment: [EquipmentCategoryEquipment],
  index: String,
  name: String,
  url: String
});

module.exports = mongoose.model('EquipmentCategory', EquipmentCategory, 'equipment-categories');
