var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StartingEquipmentSchema = new Schema({
  _id: {
    type: String,
    select: false,
  },
  index: String,
  class: {
    name: String,
    url: String,
  },
  url: String,
});

module.exports = mongoose.model('StartingEquipment', StartingEquipmentSchema, 'startingequipment');
