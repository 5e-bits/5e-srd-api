const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SpellAreaOfEffect = new Schema({
  _id: false,
  size: Number,
  type: String,
});

const SpellClass = new Schema({
  _id: false,
  index: String,
  name: String,
  url: String,
});

const SpellDamageDamageType = new Schema({
  _id: false,
  index: String,
  name: String,
  url: String,
});

const SpellDamage = new Schema({
  _id: false,
  damage_type: SpellDamageDamageType,
   // As this has keys that are numbers, we have to use an `Object`, which you can't query subfields.
  damage_at_slot_level: Object,
  damage_at_character_level: Object,
});

const SpellDcDcType = new Schema({
  _id: false,
  index: String,
  name: String,
  url: String,
});

const SpellDc = new Schema({
  _id: false,
  dc_success: String,
  dc_type: SpellDcDcType,
  desc: String,
});

const SpellSchool = new Schema({
  _id: false,
  index: String,
  name: String,
  url: String,
});

const SpellSubclass = new Schema({
  _id: false,
  index: String,
  name: String,
  url: String,
});

const Spell = new Schema({
  _id: {
    type: String,
    select: false,
  },
  area_of_effect: SpellAreaOfEffect,
  attack_type: String,
  casting_time: String,
  classes: [SpellClass],
  components: [String],
  concentration: Boolean,
  damage: SpellDamage,
  dc: SpellDc,
  desc: [String],
  duration: String,
  // As this has keys that are
  heal_at_slot_level: Object,
  higher_level: [String],
  index: String,
  level: Number,
  material: String,
  name: String,
  range: String,
  ritual: Boolean,
  school: SpellSchool,
  subclasses: [SpellSubclass],
  url: String,
});

module.exports = mongoose.model('Spell', Spell, 'spells');
