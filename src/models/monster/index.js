import { APIReference } from '../common/index.js';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ActionDamage = new Schema({
  _id: false,
  damage_dice: { type: String, index: true },
  damage_type: APIReference,
});

const ActionDC = new Schema({
  _id: false,
  dc_type: APIReference,
  dc_value: { type: Number, index: true },
  success_type: { type: String, index: true },
});

const ActionAttack = new Schema({
  _id: false,
  name: { type: String, index: true },
  dc: ActionDC,
  damage: [ActionDamage],
});

const ActionAttackOptions = new Schema({
  _id: false,
  choose: { type: Number, required: true },
  type: { type: String, required: true },
  from: [ActionAttack],
});

const ActionOption = new Schema({
  _id: false,
  name: { type: String, index: true },
  count: { type: Schema.Types.Mixed, index: true },
  type: { type: String, index: true },
});

const ActionOptions = new Schema({
  _id: false,
  choose: { type: Number, index: true },
  from: [ActionOption],
});

const ActionUsage = new Schema({
  _id: false,
  type: { type: String, index: true },
  dice: { type: String, index: true },
  min_value: { type: Number, index: true },
});

const Action = new Schema({
  _id: false,
  name: { type: String, index: true },
  desc: { type: String, index: true },
  attack_bonus: { type: Number, index: true },
  damage: { type: [ActionDamage], default: undefined },
  dc: ActionDC,
  options: ActionOptions,
  usage: ActionUsage,
  attack_options: ActionAttackOptions,
  attacks: { type: [ActionAttack], default: undefined },
});

const LegendaryAction = new Schema({
  _id: false,
  name: { type: String, index: true },
  desc: { type: String, index: true },
  attack_bonus: { type: Number, index: true },
  damage: { type: [ActionDamage], default: undefined },
  dc: ActionDC,
});

const Proficiency = new Schema({
  _id: false,
  proficiency: APIReference,
  value: { type: Number, index: true },
});

const Reaction = new Schema({
  _id: false,
  name: { type: String, index: true },
  desc: { type: String, index: true },
  dc: ActionDC,
});

const Sense = new Schema({
  _id: false,
  blindsight: { type: String, index: true },
  darkvision: { type: String, index: true },
  passive_perception: { type: Number, index: true },
  tremorsense: { type: String, index: true },
  truesight: { type: String, index: true },
});

const SpecialAbilityUsage = new Schema({
  _id: false,
  type: { type: String, index: true },
  times: { type: Number, index: true },
  rest_types: { type: [String], index: true },
});

const SpecialAbilitySpell = new Schema({
  _id: false,
  name: { type: String, index: true },
  level: { type: Number, index: true },
  url: { type: String, index: true },
  notes: { type: String, index: true },
  usage: SpecialAbilityUsage,
});

const SpecialAbilitySpellcasting = new Schema({
  _id: false,
  level: { type: Number, index: true },
  ability: APIReference,
  dc: { type: Number, index: true },
  modifier: { type: Number, index: true },
  components_required: { type: [String], index: true },
  school: { type: String, index: true },
  // As this has keys that are numbers, we have to use an `Object`, which you can't query subfields
  slots: Object,
  spells: [SpecialAbilitySpell],
});

const SpecialAbility = new Schema({
  _id: false,
  name: { type: String, index: true },
  desc: { type: String, index: true },
  attack_bonus: { type: Number, index: true },
  damage: { type: [ActionDamage], default: undefined },
  dc: ActionDC,
  spellcasting: SpecialAbilitySpellcasting,
  usage: SpecialAbilityUsage,
});

const Speed = new Schema({
  _id: false,
  burrow: { type: String, index: true },
  climb: { type: String, index: true },
  fly: { type: String, index: true },
  hover: { type: Boolean, index: true },
  swim: { type: String, index: true },
  walk: { type: String, index: true },
});

const Monster = new Schema({
  _id: { type: String, select: false },
  actions: [Action],
  alignment: { type: String, index: true },
  armor_class: { type: Number, index: true },
  challenge_rating: { type: Number, index: true },
  charisma: { type: Number, index: true },
  condition_immunities: [APIReference],
  constitution: { type: Number, index: true },
  damage_immunities: { type: [String], index: true },
  damage_resistances: { type: [String], index: true },
  damage_vulnerabilities: { type: [String], index: true },
  dexterity: { type: Number, index: true },
  forms: { type: [APIReference], default: undefined },
  hit_dice: { type: String, index: true },
  hit_points: { type: Number, index: true },
  index: { type: String, index: true },
  intelligence: { type: Number, index: true },
  languages: { type: String, index: true },
  legendary_actions: [LegendaryAction],
  name: { type: String, index: true },
  proficiencies: [Proficiency],
  reactions: { type: [Reaction], default: undefined },
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

export default mongoose.model('Monster', Monster, 'monsters');
