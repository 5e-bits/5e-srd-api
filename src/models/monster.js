const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { NamedAPIResource } = require('./common');

const ActionDamage = new Schema({
  _id: false,
  damage_dice: String,
  damage_type: NamedAPIResource,
});

const Action = new Schema({
  _id: false,
  attack_bonus: Number,
  damage: [ActionDamage],
  desc: String,
  name: String,
});

const LegendaryAction = new Schema({
  _id: false,
  attack_bonus: Number,
  desc: String,
  name: String,
});

const OtherSpeedSpeed = new Schema({
  _id: false,
  walk: String,
});

const OtherSpeed = new Schema({
  _id: false,
  form: String,
  speed: OtherSpeedSpeed,
});

const Proficiency = new Schema({
  _id: false,
  proficiency: NamedAPIResource,
  value: Number,
});

const Reaction = new Schema({
  _id: false,
  desc: String,
  name: String,
});

const Sense = new Schema({
  _id: false,
  blindsight: String,
  darkvision: String,
  passive_perception: Number,
  tremorsense: String,
  truesight: String,
});

const SpecialAbility = new Schema({
  _id: false,
  desc: String,
  name: String,
});

const Speed = new Schema({
  _id: false,
  burrow: String,
  climb: String,
  fly: String,
  hover: Boolean,
  swim: String,
  walk: String,
});

const MonsterSchema = new Schema({
  _id: {
    type: String,
    select: false,
  },
  actions: [Action],
  alignment: String,
  armor_class: Number,
  challenge_rating: Number,
  charisma: Number,
  condition_immunities: [NamedAPIResource],
  constitution: Number,
  damage_immunities: [String],
  damage_resistances: [String],
  damage_vulnerabilities: [String],
  dexterity: Number,
  hit_dice: String,
  hit_points: Number,
  index: String,
  intelligence: Number,
  languages: String,
  legendary_actions: [LegendaryAction],
  name: String,
  other_speeds: [OtherSpeed],
  proficiencies: [Proficiency],
  reactions: [Reaction],
  senses: Sense,
  size: String,
  special_abilities: [SpecialAbility],
  speed: Speed,
  strength: Number,
  subtype: String,
  type: String,
  url: String,
  wisdom: Number,
  xp: Number,
});

module.exports = mongoose.model('Monster', MonsterSchema, 'monsters');
