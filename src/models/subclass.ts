import * as mongoose from 'mongoose';
import { APIReference } from './common';

const SpellPrerequisite = {
  index: { type: String, index: true },
  name: { type: String, index: true },
  type: { type: String, index: true },
  url: { type: String, index: true },
};

const Spell = {
  prerequisites: [SpellPrerequisite],
  spell: APIReference,
};

const Subclass = new mongoose.Schema({
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
