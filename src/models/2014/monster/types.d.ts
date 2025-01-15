import * as mongoose from 'mongoose';
import { APIReference, Choice, DifficultyClass, Damage } from '../common/types';

type ActionOption = {
  _id?: boolean;
  action_name: string;
  count: number | string;
  type: 'melee' | 'ranged' | 'ability' | 'magic';
};

type ActionUsage = {
  _id?: boolean;
  type: string;
  dice?: string;
  min_value?: number;
};

type Action = {
  _id?: boolean;
  name: string;
  desc: string;
  attack_bonus?: number;
  damage?: Damage[];
  dc?: DifficultyClass;
  options?: Choice;
  usage?: ActionUsage;
  multiattack_type: 'actions' | 'action_options';
  actions: ActionOption[];
  action_options: Choice;
};

type ArmorClass =
  | ArmorClassDex
  | ArmorClassNatural
  | ArmorClassArmor
  | ArmorClassSpell
  | ArmorClassCondition;

type ArmorClassDex = {
  _id?: boolean;
  type: 'dex';
  value: number;
  desc?: string;
};

type ArmorClassNatural = {
  _id?: boolean;
  type: 'natural';
  value: number;
  desc?: string;
};

type ArmorClassArmor = {
  _id?: boolean;
  type: 'armor';
  value: number;
  armor?: APIReference[]; // Equipment
  desc?: string;
};

type ArmorClassSpell = {
  _id?: boolean;
  type: 'spell';
  value: number;
  spell: APIReference; // Spell
  desc?: string;
};

type ArmorClassCondition = {
  _id?: boolean;
  type: 'condition';
  value: number;
  condition: APIReference; // Condition
  desc?: string;
};

type LegendaryAction = {
  _id?: boolean;
  name: string;
  desc: string;
  attack_bonus?: number;
  damage?: Damage[];
  dc?: DifficultyClass;
};

type Proficiency = {
  _id?: boolean;
  proficiency: APIReference;
  value: number;
};

type Reaction = {
  _id?: boolean;
  name: string;
  desc: string;
  dc?: DifficultyClass;
};

type Sense = {
  _id?: boolean;
  blindsight?: string;
  darkvision?: string;
  passive_perception: number;
  tremorsense?: string;
  truesight?: string;
};

type SpecialAbilityUsage = {
  _id?: boolean;
  type: string;
  times?: number;
  rest_types?: string[];
};

type SpecialAbilitySpell = {
  _id?: boolean;
  name: string;
  level: number;
  url: string;
  notes?: string;
  usage?: SpecialAbilityUsage;
};

type SpecialAbilitySpellcasting = {
  _id?: boolean;
  level?: number;
  ability: APIReference;
  dc?: number;
  modifier?: number;
  components_required: string[];
  school?: string;
  slots?: Record<string, number>;
  spells: SpecialAbilitySpell[];
};

type SpecialAbility = {
  _id?: boolean;
  name: string;
  desc: string;
  attack_bonus?: number;
  damage?: Damage[];
  dc?: DifficultyClass;
  spellcasting?: SpecialAbilitySpellcasting;
  usage: SpecialAbilityUsage;
};

type Speed = {
  _id?: boolean;
  burrow?: string;
  climb?: string;
  fly?: string;
  hover?: boolean;
  swim?: string;
  walk?: string;
};

export type Monster = {
  _id?: mongoose.Types.ObjectId;
  actions?: Action[];
  alignment: string;
  armor_class: ArmorClass[];
  challenge_rating: number;
  charisma: number;
  condition_immunities: APIReference[];
  constitution: number;
  damage_immunities: string[];
  damage_resistances: string[];
  damage_vulnerabilities: string[];
  dexterity: number;
  forms?: APIReference[];
  hit_dice: string;
  hit_points: number;
  hit_points_roll: string;
  image?: string;
  index: string;
  intelligence: number;
  languages: string;
  legendary_actions?: LegendaryAction[];
  name: string;
  proficiencies: Proficiency[];
  reactions?: Reaction[];
  senses: Sense;
  size: string;
  special_abilities?: SpecialAbility[];
  speed: Speed;
  strength: number;
  subtype?: string;
  type: string;
  url: string;
  wisdom: number;
  xp: number;
  updated_at: string;
};
