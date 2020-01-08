var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StartingEquipmentSchema = new Schema({
  index: Number,
  class: {
    name: String,
    url: String
  },
  url: String
});

module.exports = mongoose.model('StartingEquipment', StartingEquipmentSchema, 'startingequipment');
