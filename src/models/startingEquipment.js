const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { APIReference } = require('./common');

const Equipment = new Schema({
  _id: false,
  equipment: APIReference,
  quantity: Number,
});

const StartingEquipmentOption = new Schema({
  _id: false,
  equipment: APIReference,
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
  class: APIReference,
  index: String,
  starting_equipment: [Equipment],
  starting_equipment_options: [StartingEquipmentOptions],
  url: String,
});

module.exports = mongoose.model('StartingEquipment', StartingEquipment, 'startingequipment');
