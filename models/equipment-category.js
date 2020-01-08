var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EquipmentCategorySchema = new Schema({
  index: String,
  name: String,
  url: String
});

module.exports = mongoose.model(
  'EquipmentCategory',
  EquipmentCategorySchema,
  'equipment-categories'
);
