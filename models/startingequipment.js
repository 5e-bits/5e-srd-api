var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var StartingEquipmentSchema   = new Schema({
});

module.exports = mongoose.model('StartingEquipment', StartingEquipmentSchema, 'startingequipment');