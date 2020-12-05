const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubclassClass = new Schema({
  index: String,
  name: String,
  url: String
});

const SubclassSpellPrerequisite = new Schema({
  index: String,
  name: String,
  type: String,
  url: String
});

const SubclassSpellSpell = new Schema({
  index: String,
  name: String,
  url: String
});

const SubclassSpell = new Schema({
  prerequisites: [SubclassSpellPrerequisite],
  spell: SubclassSpellSpell
});

const Subclass = new Schema({
  _id: {
    type: String,
    select: false
  },
  class: SubclassClass,
  desc: [String],
  index: String,
  name: String,
  spells: [SubclassSpell],
  subclass_flavor: String,
  subclass_levels: String,
  url: String
});

module.exports = mongoose.model('Subclass', Subclass, 'subclasses');
