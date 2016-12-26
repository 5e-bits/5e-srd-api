var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var EquipmentSchema   = new Schema({
});

module.exports = mongoose.model('Equipment', EquipmentSchema, 'equipment');