const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { APIReference } = require('./common');

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

const SuggestedCharacteristics = new Schema({
  _id: {
    type: String,
    select: false,
  },
  personality_traits: CharacteristicOptions,
  ideals: IdealOptions,
  bonds: CharacteristicOptions,
  flaws: CharacteristicOptions,
});

module.exports = mongoose.model(
  'SuggestedCharacteristics',
  SuggestedCharacteristics,
  'suggested-characteristics'
);
