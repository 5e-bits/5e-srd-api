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
  count: number | string;
  type: string;
}

const ActionOption = {
  name: { type: String, index: true },
  count: { type: mongoose.Schema.Types.Mixed, index: true },
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
  dice?: string;
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
  options?: ActionOptions;
  usage?: ActionUsage;
  attack_options?: ActionAttackOptions;
  attacks?: ActionAttack[];
}

const Action = {
  name: { type: String, index: true },
  desc: { type: String, index: true },
  attack_bonus: { type: Number, index: true },
  damage: [ActionDamage],
  dc: ActionDC,
  options: ActionOptions,
  usage: ActionUsage,
  attack_options: ActionAttackOptions,
  attacks: [ActionAttack],
};

interface LegendaryAction {
  name: string;
  desc: string;
  attack_bonus?: number;
  damage?: ActionDamage[];
  dc?: ActionDC;
}

const LegendaryAction = {
  name: { type: String, index: true },
  desc: { type: String, index: true },
  attack_bonus: { type: Number, index: true },
  damage: [ActionDamage],
  dc: ActionDC,
};

interface Proficiency {
  proficiency: APIReference;
  value: number;
}

const Proficiency = {
  proficiency: APIReferenceSchema,
  value: { type: Number, index: true },
};

interface Reaction {
  name: string;
  desc: string;
  dc?: ActionDC;
}

const Reaction = {
  name: { type: String, index: true },
  desc: { type: String, index: true },
  dc: ActionDC,
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

interface SpecialAbilityUsage {
  type: string;
  times?: number;
  rest_types?: string[];
}

const SpecialAbilityUsage = {
  type: { type: String, index: true },
  times: { type: Number, index: true },
  rest_types: { type: [String], index: true },
};

interface SpecialAbilitySpell {
  name: string;
  level: number;
  url: string;
  notes?: string;
  usage?: SpecialAbilityUsage;
}

const SpecialAbilitySpell = {
  name: { type: String, index: true },
  level: { type: Number, index: true },
  url: { type: String, index: true },
  notes: { type: String, index: true },
  usage: SpecialAbilityUsage,
};

interface SpecialAbilitySpellcasting {
  level?: number;
  ability: APIReference;
  dc?: number;
  modifier?: number;
  components_required?: string[];
  school?: string;
  slots?: {
    1: number;
    2?: number;
    3?: number;
    4?: number;
    5?: number;
    6?: number;
    7?: number;
    8?: number;
    9?: number;
  };
  spells: SpecialAbilitySpell[];
}

const SpecialAbilitySpellcasting = {
  level: { type: Number, index: true },
  ability: APIReferenceSchema,
  dc: { type: Number, index: true },
  modifier: { type: Number, index: true },
  components_required: { type: [String], index: true },
  school: { type: String, index: true },
  // As this has keys that are numbers, we have to use an `Object`, which you can't query subfields
  slots: Object,
  spells: [SpecialAbilitySpell],
};

interface SpecialAbility {
  name: string;
  desc: string;
  attack_bonus?: number;
  damage?: ActionDamage[];
  dc?: ActionDC;
  spellcasting?: SpecialAbilitySpellcasting;
  usage: SpecialAbilityUsage;
}

const SpecialAbility = {
  name: { type: String, index: true },
  desc: { type: String, index: true },
  attack_bonus: { type: Number, index: true },
  damage: [ActionDamage],
  dc: ActionDC,
  spellcasting: SpecialAbilitySpellcasting,
  usage: SpecialAbilityUsage,
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
  condition_immunities?: string[];
  constitution: number;
  damage_immunities?: string[];
  damage_resistances?: string[];
  damage_vulnerabilities?: string[];
  dexterity: number;
  forms?: APIReference[];
  hit_dice: string;
  hit_points: number;
  index: string;
  intelligence: number;
  languages: string;
  legendary_actions?: LegendaryAction[];
  name: string;
  proficiencies?: Proficiency[];
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
