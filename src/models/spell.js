const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SpellAreaOfEffect = new Schema({
  size: Number,
  type: String,
});

const SpellClass = new Schema({
  index: String,
  name: String,
  url: String,
});

const SpellDamageDamageType = new Schema({
  index: String,
  name: String,
  url: String,
});

const SpellDamage = new Schema({
  damage_type: SpellDamageDamageType,
});

const SpellDcDcType = new Schema({
  index: String,
  name: String,
  url: String,
});

const SpellDc = new Schema({
  dc_success: String,
  dc_type: SpellDcDcType,
  desc: String,
});

const SpellSchool = new Schema({
  index: String,
  name: String,
  url: String,
});

const SpellSubclass = new Schema({
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
