var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var StartingEquipmentSchema   = new Schema({
    class: String
});

module.exports = mongoose.model('StartingEquipment', StartingEquipmentSchema, 'startingequipment');