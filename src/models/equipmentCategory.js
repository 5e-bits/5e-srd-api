const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EquipmentCategorySchema = new Schema({
  _id: {
    type: String,
    select: false
  },
  index: String,
  name: String,
  url: String
});

module.exports = mongoose.model(
  'EquipmentCategory',
  EquipmentCategorySchema,
  'equipment-categories'
);
