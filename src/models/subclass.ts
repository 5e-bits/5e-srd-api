import * as mongoose from 'mongoose';
import { APIReference, APIReferenceSchema } from './common';

interface SpellPrerequisite {
  index: string;
  name: string;
  type: string;
  url: string;
}

const SpellPrerequisite = {
  index: { type: String, index: true },
  name: { type: String, index: true },
  type: { type: String, index: true },
  url: { type: String, index: true },
};

interface Spell {
  prerequisites: SpellPrerequisite[];
  spell: APIReference;
}

const Spell = {
  prerequisites: [SpellPrerequisite],
  spell: APIReferenceSchema,
};

interface Subclass {
  _id?: string;
  class: APIReference;
  desc: string[];
  index: string;
  name: string;
  spells?: Spell[];
  subclass_flavor: string;
  subclass_levels: string;
  url: string;
}

const Subclass = new mongoose.Schema<Subclass>({
  _id: { type: String, select: false },
  class: APIReferenceSchema,
  desc: { type: [String], index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  spells: [Spell],
  subclass_flavor: { type: String, index: true },
  subclass_levels: { type: String, index: true },
  url: { type: String, index: true },
});

export default mongoose.model<Subclass>('Subclass', Subclass, 'subclasses');
