const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { NamedAPIResource } = require('./common');

const SpellAreaOfEffect = new Schema({
  _id: false,
  size: Number,
  type: String,
});

const SpellDamage = new Schema({
  _id: false,
  // As this has keys that are numbers, we have to use an `Object`, which you can't query subfields
  damage_at_slot_level: Object,
  // As this has keys that are numbers, we have to use an `Object`, which you can't query subfields
  damage_at_character_level: Object,
  damage_type: NamedAPIResource,
});

const SpellDc = new Schema({
  _id: false,
  dc_success: String,
  dc_type: NamedAPIResource,
  desc: String,
});

const Spell = new Schema({
  _id: {
    type: String,
    select: false,
  },
  area_of_effect: SpellAreaOfEffect,
  attack_type: String,
  casting_time: String,
  classes: [NamedAPIResource],
  components: [String],
  concentration: Boolean,
  damage: SpellDamage,
  dc: SpellDc,
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
  school: NamedAPIResource,
  subclasses: [NamedAPIResource],
  url: String,
});

module.exports = mongoose.model('Spell', Spell, 'spells');
