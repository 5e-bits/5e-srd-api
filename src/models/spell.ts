import * as mongoose from 'mongoose';
import { APIReference, APIReferenceSchema } from './common';

interface AreaOfEffect {
  _id?: mongoose.Types.ObjectId;
  size: number;
  type: string;
}

const AreaOfEffect = new mongoose.Schema({
  _id: { type: String, select: false },
  size: { type: Number, index: true },
  type: { type: String, index: true },
});

interface Damage {
  _id?: mongoose.Types.ObjectId;
  damage_at_slot_level?: {
    2?: string;
    3?: string;
    4?: string;
    5?: string;
    6?: string;
    7?: string;
    8?: string;
    9?: string;
  };
  damage_at_character_level?: {
    1: string;
    5: string;
    11: string;
    17: string;
  };
  damage_type?: APIReference;
}

const Damage = new mongoose.Schema({
  _id: { type: String, select: false },
  // As this has keys that are numbers, we have to use an `Object`, which you can't query subfields
  damage_at_slot_level: Object,
  // As this has keys that are numbers, we have to use an `Object`, which you can't query subfields
  damage_at_character_level: Object,
  damage_type: APIReferenceSchema,
});

interface DC {
  _id?: mongoose.Types.ObjectId;
  dc_success: string;
  dc_type: APIReference;
  desc?: string;
}

const DC = new mongoose.Schema({
  _id: { type: String, select: false },
  dc_success: { type: String, index: true },
  dc_type: APIReferenceSchema,
  desc: { type: String, index: true },
});

interface Spell {
  _id?: mongoose.Types.ObjectId;
  area_of_effect?: AreaOfEffect;
  attack_type?: string;
  casting_time: string;
  classes: APIReference[];
  components: string[];
  concentration: boolean;
  damage?: Damage;
  dc?: DC;
  desc: string[];
  duration: string;
  heal_at_slot_level?: {
    1?: string;
    2?: string;
    3?: string;
    4?: string;
    5?: string;
    6?: string;
    7?: string;
    8?: string;
    9?: string;
  };
  higher_level?: string;
  index: string;
  level: number;
  material?: string;
  name: string;
  range: string;
  ritual: boolean;
  school: APIReference;
  url: string;
}

const Spell = new mongoose.Schema<Spell>({
  _id: { type: String, select: false },
  area_of_effect: AreaOfEffect,
  attack_type: { type: String, index: true },
  casting_time: { type: String, index: true },
  classes: [APIReferenceSchema],
  components: { type: [String], index: true },
  concentration: { type: Boolean, index: true },
  damage: Damage,
  dc: DC,
  desc: { type: [String], index: true },
  duration: { type: String, index: true },
  // As this has keys that are numbers, we have to use an `Object`, which you can't query subfields
  heal_at_slot_level: Object,
  higher_level: { type: [String], index: true },
  index: { type: String, index: true },
  level: { type: Number, index: true },
  material: { type: String, index: true },
  name: { type: String, index: true },
  range: { type: String, index: true },
  ritual: { type: Boolean, index: true },
  school: APIReferenceSchema,
  subclasses: [APIReferenceSchema],
  url: { type: String, index: true },
});

export default mongoose.model<Spell>('Spell', Spell, 'spells');
