const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { APIReference } = require('../common');

const SpellPrerequisite = new Schema({
  index: { type: String, index: true },
  name: { type: String, index: true },
  type: { type: String, index: true },
  url: { type: String, index: true },
});

const Spell = new Schema({
  prerequisites: [SpellPrerequisite],
  spell: APIReference,
});

const Subclass = new Schema({
  _id: { type: String, select: false },
  class: APIReference,
  desc: { type: [String], index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  spells: [Spell],
  subclass_flavor: { type: String, index: true },
  subclass_levels: { type: String, index: true },
  url: { type: String, index: true },
});

module.exports = mongoose.model('Subclass', Subclass, 'subclasses');
