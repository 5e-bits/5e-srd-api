const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { NamedAPIResource } = require('./common');

const StartingequipmentStartingEquipment = new Schema({
  _id: false,
  equipment: NamedAPIResource,
  quantity: Number,
});

const StartingequipmentStartingEquipmentOptionFrom = new Schema({
  _id: false,
  equipment: NamedAPIResource,
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
  class: NamedAPIResource,
  index: String,
  starting_equipment: [StartingequipmentStartingEquipment],
  starting_equipment_options: [StartingequipmentStartingEquipmentOption],
  url: String,
});

module.exports = mongoose.model('StartingEquipment', StartingEquipment, 'startingequipment');
