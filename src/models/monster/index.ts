import { Schema, model } from 'mongoose';
import {
  APIReferenceSchema,
  ChoiceSchema,
  DifficultyClassSchema,
  DamageSchema,
} from '../common/index.js';
import {
  Action,
  ActionOption,
  ActionUsage,
  ArmorClass,
  ArmorClassArmor,
  ArmorClassCondition,
  ArmorClassDex,
  ArmorClassNatural,
  ArmorClassSpell,
  LegendaryAction,
  Proficiency,
  Reaction,
  Sense,
  SpecialAbilityUsage,
  SpecialAbilitySpell,
  SpecialAbilitySpellcasting,
  SpecialAbility,
  Speed,
  Monster,
} from './types';

const ActionOptionSchema = new Schema<ActionOption>({
  _id: false,
  action_name: { type: String, index: true },
  count: { type: Schema.Types.Mixed, index: true },
  type: { type: String, index: true, enum: ['melee', 'ranged', 'ability', 'magic'] },
});

const ActionUsageSchema = new Schema<ActionUsage>({
  _id: false,
  type: { type: String, index: true },
  dice: { type: String, index: true },
  min_value: { type: Number, index: true },
});

const ActionSchema = new Schema<Action>({
  _id: false,
  name: { type: String, index: true },
  desc: { type: String, index: true },
  attack_bonus: { type: Number, index: true },
  damage: { type: [DamageSchema], default: undefined },
  dc: DifficultyClassSchema,
  usage: ActionUsageSchema,
  multiattack_type: { type: String, index: true, enum: ['actions', 'action_options'] },
  action_options: { type: ChoiceSchema, index: true },
  actions: { type: [ActionOptionSchema], index: true },
});

const ArmorClassSchema = new Schema<ArmorClass>(
  {
    _id: false,
    type: { type: String, index: true, enum: ['dex', 'natural', 'armor', 'spell', 'condition'] },
    desc: { type: String, index: true },
    value: { type: Number, index: true },
  },
  { discriminatorKey: 'type', _id: false }
);

ArmorClassSchema.discriminators = {};
ArmorClassSchema.discriminators.dex = new Schema<ArmorClassDex>({});

ArmorClassSchema.discriminators.natural = new Schema<ArmorClassNatural>({});

ArmorClassSchema.discriminators.armor = new Schema<ArmorClassArmor>({
  armor: { type: [APIReferenceSchema], index: true },
});

ArmorClassSchema.discriminators.spell = new Schema<ArmorClassSpell>({
  spell: { type: APIReferenceSchema, index: true },
});

ArmorClassSchema.discriminators.condition = new Schema<ArmorClassCondition>({
  condition: { type: APIReferenceSchema, index: true },
});

const LegendaryActionSchema = new Schema<LegendaryAction>({
  _id: false,
  name: { type: String, index: true },
  desc: { type: String, index: true },
  attack_bonus: { type: Number, index: true },
  damage: { type: [DamageSchema], default: undefined },
  dc: DifficultyClassSchema,
});

const ProficiencySchema = new Schema<Proficiency>({
  _id: false,
  proficiency: APIReferenceSchema,
  value: { type: Number, index: true },
});

const ReactionSchema = new Schema<Reaction>({
  _id: false,
  name: { type: String, index: true },
  desc: { type: String, index: true },
  dc: DifficultyClassSchema,
});

const SenseSchema = new Schema<Sense>({
  _id: false,
  blindsight: { type: String, index: true },
  darkvision: { type: String, index: true },
  passive_perception: { type: Number, index: true },
  tremorsense: { type: String, index: true },
  truesight: { type: String, index: true },
});

const SpecialAbilityUsageSchema = new Schema<SpecialAbilityUsage>({
  _id: false,
  type: { type: String, index: true },
  times: { type: Number, index: true },
  rest_types: { type: [String], index: true },
});

const SpecialAbilitySpellSchema = new Schema<SpecialAbilitySpell>({
  _id: false,
  name: { type: String, index: true },
  level: { type: Number, index: true },
  url: { type: String, index: true },
  notes: { type: String, index: true },
  usage: SpecialAbilityUsageSchema,
});

const SpecialAbilitySpellcastingSchema = new Schema<SpecialAbilitySpellcasting>({
  _id: false,
  level: { type: Number, index: true },
  ability: APIReferenceSchema,
  dc: { type: Number, index: true },
  modifier: { type: Number, index: true },
  components_required: { type: [String], index: true },
  school: { type: String, index: true },
  // As this has keys that are numbers, we have to use an `Object`, which you can't query subfields
  slots: Object,
  spells: [SpecialAbilitySpellSchema],
});

const SpecialAbilitySchema = new Schema<SpecialAbility>({
  _id: false,
  name: { type: String, index: true },
  desc: { type: String, index: true },
  attack_bonus: { type: Number, index: true },
  damage: { type: [DamageSchema], default: undefined },
  dc: DifficultyClassSchema,
  spellcasting: SpecialAbilitySpellcastingSchema,
  usage: SpecialAbilityUsageSchema,
});

const SpeedSchema = new Schema<Speed>({
  _id: false,
  burrow: { type: String, index: true },
  climb: { type: String, index: true },
  fly: { type: String, index: true },
  hover: { type: Boolean, index: true },
  swim: { type: String, index: true },
  walk: { type: String, index: true },
});

const Monster = new Schema<Monster>({
  _id: { type: String, select: false },
  actions: [ActionSchema],
  alignment: { type: String, index: true },
  armor_class: [ArmorClassSchema],
  challenge_rating: { type: Number, index: true },
  charisma: { type: Number, index: true },
  condition_immunities: [APIReferenceSchema],
  constitution: { type: Number, index: true },
  damage_immunities: { type: [String], index: true },
  damage_resistances: { type: [String], index: true },
  damage_vulnerabilities: { type: [String], index: true },
  dexterity: { type: Number, index: true },
  forms: { type: [APIReferenceSchema], default: undefined },
  hit_dice: { type: String, index: true },
  hit_points: { type: Number, index: true },
  hit_points_roll: { type: String, index: true },
  image: { type: String, index: true },
  index: { type: String, index: true },
  intelligence: { type: Number, index: true },
  languages: { type: String, index: true },
  legendary_actions: [LegendaryActionSchema],
  name: { type: String, index: true },
  proficiencies: [ProficiencySchema],
  reactions: { type: [ReactionSchema], default: undefined },
  senses: SenseSchema,
  size: { type: String, index: true },
  special_abilities: [SpecialAbilitySchema],
  speed: SpeedSchema,
  strength: { type: Number, index: true },
  subtype: { type: String, index: true },
  type: { type: String, index: true },
  url: { type: String, index: true },
  wisdom: { type: Number, index: true },
  xp: { type: Number, index: true },
});

export default model('Monster', Monster, 'monsters');
