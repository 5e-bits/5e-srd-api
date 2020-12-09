const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { NamedAPIResource } = require('./common');

const SubclassSpellPrerequisite = new Schema({
  _id: false,
  index: String,
  name: String,
  type: String,
  url: String,
});

const SubclassSpell = new Schema({
  _id: false,
  prerequisites: [SubclassSpellPrerequisite],
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
  spells: [SubclassSpell],
  subclass_flavor: String,
  subclass_levels: String,
  url: String,
});

module.exports = mongoose.model('Subclass', Subclass, 'subclasses');
