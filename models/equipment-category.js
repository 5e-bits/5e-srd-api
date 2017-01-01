var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var EquipmentCategorySchema   = new Schema({
    name: String,
    url: String
});

module.exports = mongoose.model('EquipmentCategory', EquipmentCategorySchema, 'equipment-categories');