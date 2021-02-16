const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { APIReference } = require('./common');

const LanguageOptions = new Schema({
  _id: false,
  choose: Number,
  from: [APIReference],
  type: String,
});

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

const Ideal = new Schema({
  _id: false,
  desc: String,
  alignments: [APIReference],
});

const CharacteristicOptions = new Schema({
  _id: false,
  choose: Number,
  from: [String],
  type: String,
});

const IdealOptions = new Schema({
  _id: false,
  choose: Number,
  from: [Ideal],
  type: String,
});

const BackgroundFeature = new Schema({
  _id: false,
  name: String,
  desc: [String]
});

const Background = new Schema({
  _id: {
    type: String,
    select: false,
  },
  index: String,
  name: String,
  starting_proficiencies: [APIReference],
  language_options: LanguageOptions,
  url: String,
  starting_equipment: [Equipment],
  starting_equipment_options: [StartingEquipmentOptions],
  feature: BackgroundFeature,
  personality_traits: CharacteristicOptions,
  ideals: IdealOptions,
  bonds: CharacteristicOptions,
  flaws: CharacteristicOptions,
});

module.exports = mongoose.model('Background', Background, 'backgrounds');
