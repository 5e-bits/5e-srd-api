const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { APIReference } = require('../common');

const Prerequisite = new Schema({
  _id: false,
  ability_score: APIReference,
  minimum_score: { type: Number, index: true },
});

const Feat = new Schema({
  _id: { type: String, select: false },
  index: { type: String, index: true },
  name: { type: String, index: true },
  prerequisites: [Prerequisite],
  desc: { type: [String], index: true },
  url: { type: String, index: true },
});

module.exports = mongoose.model('Feat', Feat, 'feats');
