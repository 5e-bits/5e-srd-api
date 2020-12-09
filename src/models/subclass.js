const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { NamedAPIResource } = require('./common');

const SpellPrerequisite = new Schema({
  _id: false,
  index: String,
  name: String,
  type: String,
  url: String,
});

const Spell = new Schema({
  _id: false,
  prerequisites: [SpellPrerequisite],
  spell: NamedAPIResource,
});

const Subclass = new Schema({
  _id: {
    type: String,
    select: false,
  },
  class: NamedAPIResource,
  desc: [String],
  index: String,
  name: String,
  spells: [Spell],
  subclass_flavor: String,
  subclass_levels: String,
  url: String,
});

module.exports = mongoose.model('Subclass', Subclass, 'subclasses');
