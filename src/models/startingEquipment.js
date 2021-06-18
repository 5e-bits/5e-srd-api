const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { APIReference } = require('./common');

const Equipment = {
  equipment: APIReference,
  quantity: { type: Number, index: true },
};

const StartingEquipmentOption = {
  equipment: APIReference,
  quantity: { type: Number, index: true },
};

const StartingEquipmentOptions = {
  choose: { type: Number, index: true },
  from: [StartingEquipmentOption],
  type: { type: String, index: true },
};

const StartingEquipment = new Schema({
  _id: { type: String, select: false },
  class: APIReference,
  index: { type: String, index: true },
  starting_equipment: [Equipment],
  starting_equipment_options: [StartingEquipmentOptions],
  url: { type: String, index: true },
});

module.exports = mongoose.model('StartingEquipment', StartingEquipment, 'startingequipment');
