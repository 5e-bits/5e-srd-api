import * as mongoose from 'mongoose';
import { APIReference, APIReferenceSchema } from './common';

interface ActionDamage {
  damage_dice: string;
  damage_type: APIReference;
}

const ActionDamage = {
  damage_dice: { type: String, index: true },
  damage_type: APIReferenceSchema,
};

interface ActionDC {
  dc_type: APIReference;
  dc_value: number;
  success_type: string;
}

const ActionDC = {
  dc_type: APIReferenceSchema,
  dc_value: { type: Number, index: true },
  success_type: { type: String, index: true },
};

interface ActionAttack {
  name: string;
  dc: ActionDC;
  damage?: ActionDamage[];
}

const ActionAttack = {
  name: { type: String, index: true },
  dc: ActionDC,
  damage: [ActionDamage],
};

interface ActionAttackOptions {
  choose: number;
  type: string;
  from: ActionAttack[];
}

const ActionAttackOptions = {
  choose: { type: Number, required: true },
  type: { type: String, required: true },
  from: [ActionAttack],
};

interface ActionOption {
  name: string;
  count: number;
  type: string;
}

const ActionOption = {
  name: { type: String, index: true },
  count: { type: Number, index: true },
  type: { type: String, index: true },
};

interface ActionOptions {
  choose: number;
  from: ActionOption[];
}

const ActionOptions = {
  choose: { type: Number, index: true },
  from: [ActionOption],
};

interface ActionUsage {
  type: string;
  dice: string;
  min_value?: number;
}

const ActionUsage = {
  type: { type: String, index: true },
  dice: { type: String, index: true },
  min_value: { type: Number, index: true },
};

interface Action {
  name: string;
  desc: string;
  attack_bonus?: number;
  damage?: ActionDamage[];
  dc?: ActionDC;
  options?: ActionOptions[];
  usage?: ActionUsage;
  attack_options?: ActionAttackOptions[];
  attacks?: ActionAttack[];
}

const Action = {
  name: { type: String, index: true },
  desc: { type: String, index: true },
  attack_bonus: { type: Number, index: true },
  damage: [ActionDamage],
  dc: ActionDC,
  options: [ActionOptions],
  usage: ActionUsage,
  attack_options: [ActionAttackOptions],
  attacks: [ActionAttack],
};

const LegendaryAction = {
  attack_bonus: { type: Number, index: true },
  desc: { type: String, index: true },
  name: { type: String, index: true },
};

interface Proficiency {
  proficiency: APIReference;
  value: number;
}

const Proficiency = {
  proficiency: APIReferenceSchema,
  value: { type: Number, index: true },
};

const Reaction = {
  desc: { type: String, index: true },
  name: { type: String, index: true },
};

interface Sense {
  blindsight?: string;
  darkvision?: string;
  passive_perception: number;
  tremorsense?: string;
  truesight?: string;
}

const Sense = {
  blindsight: { type: String, index: true },
  darkvision: { type: String, index: true },
  passive_perception: { type: Number, index: true },
  tremorsense: { type: String, index: true },
  truesight: { type: String, index: true },
};

const SpecialAbility = {
  desc: { type: String, index: true },
  name: { type: String, index: true },
};

interface Speed {
  burrow?: string;
  climb?: string;
  fly?: string;
  hover?: string;
  swim?: string;
  walk?: string;
}

const Speed = {
  burrow: { type: String, index: true },
  climb: { type: String, index: true },
  fly: { type: String, index: true },
  hover: { type: Boolean, index: true },
  swim: { type: String, index: true },
  walk: { type: String, index: true },
};

interface Monster {
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
  index: string;
  intelligence: number;
  languages: string[];
  // TODO: This needs to be analyzed because we're missing stuff
  // legendary_actions?: LegendaryAction[];
  name: string;
  proficiencies: Proficiency[];
  // TODO: This needs to be analyzed because we're missing stuff
  // reactions?: Reaction[];
  senses: Sense;
  size: string;
  // TODO: This needs to be analyzed because we're missing stuff
  // special_abilities?: SpecialAbility[];
  speed: Speed;
  strength: number;
  subtype: string;
  type: string;
  url: string;
  wisdom: number;
  xp: number;
}

const Monster = new mongoose.Schema<Monster>({
  _id: { type: String, select: false },
  actions: [Action],
  alignment: { type: String, index: true },
  armor_class: { type: Number, index: true },
  challenge_rating: { type: Number, index: true },
  charisma: { type: Number, index: true },
  condition_immunities: [APIReferenceSchema],
  constitution: { type: Number, index: true },
  damage_immunities: [String],
  damage_resistances: [String],
  damage_vulnerabilities: [String],
  dexterity: { type: Number, index: true },
  forms: [APIReferenceSchema],
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

export default mongoose.model<Monster>('Monster', Monster, 'monsters');
