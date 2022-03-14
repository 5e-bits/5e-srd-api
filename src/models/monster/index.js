const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { APIReference } = require('../common');

const ActionDamage = new Schema({
  damage_dice: { type: String, index: true },
  damage_type: APIReference,
});

const Action = new Schema({
  attack_bonus: { type: Number, index: true },
  damage: [ActionDamage],
  desc: { type: String, index: true },
  name: { type: String, index: true },
});

const LegendaryAction = new Schema({
  attack_bonus: { type: Number, index: true },
  desc: { type: String, index: true },
  name: { type: String, index: true },
});

const Proficiency = new Schema({
  proficiency: APIReference,
  value: { type: Number, index: true },
});

const Reaction = new Schema({
  desc: { type: String, index: true },
  name: { type: String, index: true },
});

const Sense = new Schema({
  blindsight: { type: String, index: true },
  darkvision: { type: String, index: true },
  passive_perception: { type: Number, index: true },
  tremorsense: { type: String, index: true },
  truesight: { type: String, index: true },
});

const SpecialAbility = new Schema({
  desc: { type: String, index: true },
  name: { type: String, index: true },
});

const Speed = new Schema({
  burrow: { type: String, index: true },
  climb: { type: String, index: true },
  fly: { type: String, index: true },
  hover: { type: Boolean, index: true },
  swim: { type: String, index: true },
  walk: { type: String, index: true },
});

const MonsterSchema = new Schema({
  _id: { type: String, select: false },
  actions: [Action],
  alignment: { type: String, index: true },
  armor_class: { type: Number, index: true },
  challenge_rating: { type: Number, index: true },
  charisma: { type: Number, index: true },
  condition_immunities: [APIReference],
  constitution: { type: Number, index: true },
  damage_immunities: [String],
  damage_resistances: [String],
  damage_vulnerabilities: [String],
  dexterity: { type: Number, index: true },
  forms: [APIReference],
  hit_dice: { type: String, index: true },
  hit_points: { type: Number, index: true },
  index: { type: String, index: true },
  intelligence: { type: Number, index: true },
  languages: { type: String, index: true },
  legendary_actions: [LegendaryAction],
  name: { type: String, index: true },
  proficiencies: [Proficiency],
  reactions: [Reaction],
  senses: Sense,
  size: { type: String, index: true },
  special_abilities: [SpecialAbility],
  speed: Speed,
  strength: { type: Number, index: true },
  subtype: { type: String, index: true },
  type: { type: String, index: true },
  url: { type: String, index: true },
  wisdom: { type: Number, index: true },
  xp: { type: Number, index: true },
});

module.exports = mongoose.model('Monster', MonsterSchema, 'monsters');
