import * as mongoose from 'mongoose';
import { APIReference } from './common';

const AreaOfEffect = new mongoose.Schema({
  _id: false,
  size: Number,
  type: String,
});

const Damage = new mongoose.Schema({
  _id: false,
  // As this has keys that are numbers, we have to use an `Object`, which you can't query subfields
  damage_at_slot_level: Object,
  // As this has keys that are numbers, we have to use an `Object`, which you can't query subfields
  damage_at_character_level: Object,
  damage_type: APIReference,
});

const DC = new mongoose.Schema({
  _id: false,
  dc_success: String,
  dc_type: APIReference,
  desc: String,
});

const Spell = new mongoose.Schema({
  _id: {
    type: String,
    select: false,
  },
  area_of_effect: AreaOfEffect,
  attack_type: String,
  casting_time: String,
  classes: [APIReference],
  components: [String],
  concentration: Boolean,
  damage: Damage,
  dc: DC,
  desc: [String],
  duration: String,
  // As this has keys that are numbers, we have to use an `Object`, which you can't query subfields
  heal_at_slot_level: Object,
  higher_level: [String],
  index: String,
  level: Number,
  material: String,
  name: String,
  range: String,
  ritual: Boolean,
  school: APIReference,
  subclasses: [APIReference],
  url: String,
});

export default mongoose.model('Spell', Spell, 'spells');
