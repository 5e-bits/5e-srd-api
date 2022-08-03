import { APIReference } from '../common/index.js';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const SpellPrerequisite = new Schema({
  _id: false,
  index: { type: String, index: true },
  name: { type: String, index: true },
  type: { type: String, index: true },
  url: { type: String, index: true },
});

const Spell = new Schema({
  _id: false,
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

export default mongoose.model('Subclass', Subclass, 'subclasses');
