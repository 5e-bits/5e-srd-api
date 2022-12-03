import { Schema, model } from 'mongoose';
import { APIReferenceSchema, AreaOfEffectSchema } from '../common/index.js';
import { Damage, DC } from './types';

const DamageSchema = new Schema<Damage>({
  _id: false,
  // As this has keys that are numbers, we have to use an `Object`, which you can't query subfields
  damage_at_slot_level: Object,
  // As this has keys that are numbers, we have to use an `Object`, which you can't query subfields
  damage_at_character_level: Object,
  damage_type: APIReferenceSchema,
});

const DCSchema = new Schema<DC>({
  _id: false,
  dc_success: { type: String, index: true },
  dc_type: APIReferenceSchema,
  desc: { type: String, index: true },
});

const Spell = new Schema({
  _id: { type: String, select: false },
  area_of_effect: AreaOfEffectSchema,
  attack_type: { type: String, index: true },
  casting_time: { type: String, index: true },
  classes: [APIReferenceSchema],
  components: { type: [String], index: true },
  concentration: { type: Boolean, index: true },
  damage: DamageSchema,
  dc: DCSchema,
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
  school: APIReferenceSchema,
  subclasses: [APIReferenceSchema],
  url: { type: String, index: true },
});

export default model('Spell', Spell, 'spells');
