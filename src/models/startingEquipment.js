const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StartingequipmentClass = new Schema({
  _id: false,
  index: String,
  name: String,
  url: String,
});

const StartingequipmentStartingEquipmentEquipment = new Schema({
  _id: false,
  index: String,
  name: String,
  url: String,
});

const StartingequipmentStartingEquipment = new Schema({
  _id: false,
  equipment: StartingequipmentStartingEquipmentEquipment,
  quantity: Number,
});

const StartingequipmentStartingEquipmentOptionFromEquipment = new Schema({
  _id: false,
  index: String,
  name: String,
  url: String,
});

const StartingequipmentStartingEquipmentOptionFrom = new Schema({
  _id: false,
  equipment: StartingequipmentStartingEquipmentOptionFromEquipment,
  quantity: Number,
});

const StartingequipmentStartingEquipmentOption = new Schema({
  _id: false,
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
