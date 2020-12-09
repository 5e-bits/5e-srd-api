const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { NamedAPIResource } = require('./common');

const Equipment = new Schema({
  _id: false,
  equipment: NamedAPIResource,
  quantity: Number,
});

const StartingEquipmentOption = new Schema({
  _id: false,
  equipment: NamedAPIResource,
  quantity: Number,
});

const StartingEquipmentOptions = new Schema({
  _id: false,
  choose: Number,
  from: [StartingEquipmentOption],
  type: String,
});

const StartingEquipment = new Schema({
  _id: {
    type: String,
    select: false,
  },
  class: NamedAPIResource,
  index: String,
  starting_equipment: [Equipment],
  starting_equipment_options: [StartingEquipmentOptions],
  url: String,
});

module.exports = mongoose.model('StartingEquipment', StartingEquipment, 'startingequipment');
