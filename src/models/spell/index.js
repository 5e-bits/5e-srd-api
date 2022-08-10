import { APIReference, AreaOfEffect } from '../common/index.js';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Damage = new Schema({
  _id: false,
  // As this has keys that are numbers, we have to use an `Object`, which you can't query subfields
  damage_at_slot_level: Object,
  // As this has keys that are numbers, we have to use an `Object`, which you can't query subfields
  damage_at_character_level: Object,
  damage_type: APIReference,
});

const DC = new Schema({
  _id: false,
  dc_success: { type: String, index: true },
  dc_type: APIReference,
  desc: { type: String, index: true },
});

const Spell = new Schema({
  _id: {
    type: { type: String, index: true },
    select: false,
  },
  area_of_effect: AreaOfEffect,
  attack_type: { type: String, index: true },
  casting_time: { type: String, index: true },
  classes: [APIReference],
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
  level: { type: Number, required: true },
  material: { type: String, index: true },
  name: { type: String, index: true },
  range: { type: String, index: true },
  ritual: { type: Boolean, index: true },
  school: APIReference,
  subclasses: [APIReference],
  url: { type: String, index: true },
});

export default mongoose.model('Spell', Spell, 'spells');
