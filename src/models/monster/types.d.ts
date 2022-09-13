import * as mongoose from 'mongoose';
import { APIReference, Choice } from '../common/types';

type ActionDamage = {
  damage_dice: string;
  damage_type: APIReference;
};

type ActionDC = {
  dc_type: APIReference;
  dc_value: number;
  success_type: string;
};

type ActionAttack = {
  name: string;
  dc: ActionDC;
  damage?: ActionDamage[];
};

type ActionOption = {
  action_name: string;
  count: number | string;
  type: 'melee' | 'ranged' | 'ability' | 'magic';
};

type ActionUsage = {
  type: string;
  dice?: string;
  min_value?: number;
};

type Action = {
  name: string;
  desc: string;
  attack_bonus?: number;
  damage?: ActionDamage[];
  dc?: ActionDC;
  options?: Choice;
  usage?: ActionUsage;
  multiattack_type: 'actions' | 'action_options';
  actions: ActionOption[];
  action_options: Choice;
};

type LegendaryAction = {
  name: string;
  desc: string;
  attack_bonus?: number;
  damage?: ActionDamage[];
  dc?: ActionDC;
};

type Proficiency = {
  proficiency: APIReference;
  value: number;
};

type Reaction = {
  name: string;
  desc: string;
  dc?: ActionDC;
};

type Sense = {
  blindsight?: string;
  darkvision?: string;
  passive_perception: number;
  tremorsense?: string;
  truesight?: string;
};

type SpecialAbilityUsage = {
  type: string;
  times?: number;
  rest_types?: string[];
};

type SpecialAbilitySpell = {
  name: string;
  level: number;
  url: string;
  notes?: string;
  usage?: SpecialAbilityUsage;
};

type SpecialAbilitySpellcasting = {
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
  name: string;
  desc: string;
  attack_bonus?: number;
  damage?: ActionDamage[];
  dc?: ActionDC;
  spellcasting?: SpecialAbilitySpellcasting;
  usage: SpecialAbilityUsage;
};

type Speed = {
  burrow?: string;
  climb?: string;
  fly?: string;
  hover?: string;
  swim?: string;
  walk?: string;
};

export type Monster = {
  _id?: mongoose.Types.ObjectId;
  actions?: Action[];
  alignment: string;
  armor_class: number;
  challenge_rating: number;
  charisma: number;
  condition_immunities: string[];
  constitution: number;
  damage_immunities: string[];
  damage_resistances: string[];
  damage_vulnerabilities: string[];
  dexterity: number;
  forms?: APIReference[];
  hit_dice: string;
  hit_points: number;
  hit_points_roll: string;
  index: string;
  intelligence: number;
  languages: string[];
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
};
