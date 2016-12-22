var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var StartingEquipmentSchema   = new Schema({
    class: String,
    equipment: [[[String]]]
});

module.exports = mongoose.model('StartingEquipment', StartingEquipmentSchema, 'startingequipment');