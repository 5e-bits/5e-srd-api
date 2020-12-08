const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StartingequipmentClass = new Schema({
  index: String,
  name: String,
  url: String,
});

const StartingequipmentStartingEquipmentEquipment = new Schema({
  index: String,
  name: String,
  url: String,
});

const StartingequipmentStartingEquipment = new Schema({
  equipment: StartingequipmentStartingEquipmentEquipment,
  quantity: Number,
});

const StartingequipmentStartingEquipmentOptionFromEquipment = new Schema({
  index: String,
  name: String,
  url: String,
});

const StartingequipmentStartingEquipmentOptionFrom = new Schema({
  equipment: StartingequipmentStartingEquipmentOptionFromEquipment,
  quantity: Number,
});

const StartingequipmentStartingEquipmentOption = new Schema({
  choose: Number,
  from: [StartingequipmentStartingEquipmentOptionFrom],
  type: String,
});

const StartingEquipment = new Schema({
  _id: {
    type: String,
    select: false,
  },
  class: StartingequipmentClass,
  index: String,
  starting_equipment: [StartingequipmentStartingEquipment],
  starting_equipment_options: [StartingequipmentStartingEquipmentOption],
  url: String,
});

module.exports = mongoose.model('StartingEquipment', StartingEquipment, 'startingequipment');
