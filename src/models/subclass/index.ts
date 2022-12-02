import { Schema, model } from 'mongoose';
import { APIReferenceSchema } from '../common/index.js';
import { SpellPrerequisite, Spell, Subclass } from './types';

const SpellPrerequisiteSchema = new Schema<SpellPrerequisite>({
  _id: false,
  index: { type: String, index: true },
  name: { type: String, index: true },
  type: { type: String, index: true },
  url: { type: String, index: true },
});

const SpellSchema = new Schema<Spell>({
  _id: false,
  prerequisites: [SpellPrerequisiteSchema],
  spell: APIReferenceSchema,
});

const SubclassSchema = new Schema<Subclass>({
  _id: { type: String, select: false },
  class: APIReferenceSchema,
  desc: { type: [String], index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  spells: [SpellSchema],
  subclass_flavor: { type: String, index: true },
  subclass_levels: { type: String, index: true },
  url: { type: String, index: true },
});

export default model('Subclass', SubclassSchema, 'subclasses');
