const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MonsterActionDamageType = new Schema({
  _id: false,
  index: String,
  name: String,
  url: String,
});

const MonsterActionDamage = new Schema({
  _id: false,
  damage_dice: String,
  damage_type: MonsterActionDamageType,
});

const MonsterAction = new Schema({
  _id: false,
  attack_bonus: Number,
  damage: [MonsterActionDamage],
  desc: String,
  name: String,
});

const MonsterConditionImmunity = new Schema({
  _id: false,
  index: String,
  name: String,
  url: String,
});

const MonsterLegendaryAction = new Schema({
  _id: false,
  attack_bonus: Number,
  desc: String,
  name: String,
});

const MonsterOtherSpeedSpeed = new Schema({
  _id: false,
  walk: String,
});

const MonsterOtherSpeed = new Schema({
  _id: false,
  form: String,
  speed: MonsterOtherSpeedSpeed,
});

const MonsterProficiencyProficiency = new Schema({
  _id: false,
  index: String,
  name: String,
  url: String,
});

const MonsterProficiency = new Schema({
  _id: false,
  proficiency: MonsterProficiencyProficiency,
  value: Number,
});

const MonsterReaction = new Schema({
  _id: false,
  desc: String,
  name: String,
});

const MonsterSense = new Schema({
  _id: false,
  blindsight: String,
  darkvision: String,
  passive_perception: Number,
  tremorsense: String,
  truesight: String,
});

const MonsterSpecialAbility = new Schema({
  _id: false,
  desc: String,
  name: String,
});

const MonsterSpeed = new Schema({
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
  actions: [MonsterAction],
  alignment: String,
  armor_class: Number,
  challenge_rating: Number,
  charisma: Number,
  condition_immunities: [MonsterConditionImmunity],
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
  legendary_actions: [MonsterLegendaryAction],
  name: String,
  other_speeds: [MonsterOtherSpeed],
  proficiencies: [MonsterProficiency],
  reactions: [MonsterReaction],
  senses: MonsterSense,
  size: String,
  special_abilities: [MonsterSpecialAbility],
  speed: MonsterSpeed,
  strength: Number,
  subtype: String,
  type: String,
  url: String,
  wisdom: Number,
  xp: Number,
});

module.exports = mongoose.model('Monster', MonsterSchema, 'monsters');
