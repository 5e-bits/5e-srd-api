import * as mongoose from 'mongoose';
import { APIReference } from '../common/types';

type SpellPrerequisite = {
  index: string;
  name: string;
  type: string;
  url: string;
};

type Spell = {
  prerequisites: SpellPrerequisite[];
  spell: APIReference;
};

export type Subclass = {
  _id?: mongoose.Types.ObjectId;
  class: APIReference;
  desc: string[];
  index: string;
  name: string;
  spells?: Spell[];
  subclass_flavor: string;
  subclass_levels: string;
  url: string;
};
