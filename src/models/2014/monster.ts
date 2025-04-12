import { getModelForClass, prop } from '@typegoose/typegoose';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { APIReference, Choice, DifficultyClass, Damage } from './common';
import { srdModelOptions } from '@/util/modelOptions';
class ActionOption {
  @prop({ required: true, index: true })
  public action_name!: string;

  @prop({ required: true, index: true })
  public count!: number | string;

  @prop({ required: true, index: true })
  public type!: 'melee' | 'ranged' | 'ability' | 'magic';
}

export class ActionUsage {
  @prop({ required: true, index: true })
  public type!: string;

  @prop({ index: true })
  public dice?: string;

  @prop({ index: true })
  public min_value?: number;
}

class Action {
  @prop({ required: true, index: true })
  public name!: string;

  @prop({ required: true, index: true })
  public desc!: string;

  @prop({ index: true })
  public attack_bonus?: number;

  @prop({ type: () => [Damage] })
  public damage?: Damage[];

  @prop({ type: () => DifficultyClass })
  public dc?: DifficultyClass;

  @prop({ type: () => Choice })
  public options?: Choice;

  @prop({ type: () => ActionUsage })
  public usage?: ActionUsage;

  @prop({ required: true, index: true })
  public multiattack_type!: 'actions' | 'action_options';

  @prop({ type: () => [ActionOption] })
  public actions!: ActionOption[];

  @prop({ type: () => Choice })
  public action_options!: Choice;
}

class ArmorClassDex {
  @prop({ required: true, index: true })
  public type!: 'dex';

  @prop({ required: true, index: true })
  public value!: number;

  @prop({ index: true })
  public desc?: string;
}

class ArmorClassNatural {
  @prop({ required: true, index: true })
  public type!: 'natural';

  @prop({ required: true, index: true })
  public value!: number;

  @prop({ index: true })
  public desc?: string;
}

class ArmorClassArmor {
  @prop({ required: true, index: true })
  public type!: 'armor';

  @prop({ required: true, index: true })
  public value!: number;

  @prop({ type: () => [APIReference] })
  public armor?: APIReference[];

  @prop({ index: true })
  public desc?: string;
}

class ArmorClassSpell {
  @prop({ required: true, index: true })
  public type!: 'spell';

  @prop({ required: true, index: true })
  public value!: number;

  @prop({ type: () => APIReference })
  public spell!: APIReference;

  @prop({ index: true })
  public desc?: string;
}

class ArmorClassCondition {
  @prop({ required: true, index: true })
  public type!: 'condition';

  @prop({ required: true, index: true })
  public value!: number;

  @prop({ type: () => APIReference })
  public condition!: APIReference;

  @prop({ index: true })
  public desc?: string;
}

class LegendaryAction {
  @prop({ required: true, index: true })
  public name!: string;

  @prop({ required: true, index: true })
  public desc!: string;

  @prop({ index: true })
  public attack_bonus?: number;

  @prop({ type: () => [Damage] })
  public damage?: Damage[];

  @prop({ type: () => DifficultyClass })
  public dc?: DifficultyClass;
}

class Proficiency {
  @prop({ type: () => APIReference })
  public proficiency!: APIReference;

  @prop({ required: true, index: true })
  public value!: number;
}

class Reaction {
  @prop({ required: true, index: true })
  public name!: string;

  @prop({ required: true, index: true })
  public desc!: string;

  @prop({ type: () => DifficultyClass })
  public dc?: DifficultyClass;
}

class Sense {
  @prop({ index: true })
  public blindsight?: string;

  @prop({ index: true })
  public darkvision?: string;

  @prop({ required: true, index: true })
  public passive_perception!: number;

  @prop({ index: true })
  public tremorsense?: string;

  @prop({ index: true })
  public truesight?: string;
}

export class SpecialAbilityUsage {
  @prop({ required: true, index: true })
  public type!: string;

  @prop({ index: true })
  public times?: number;

  @prop({ type: () => [String] })
  public rest_types?: string[];
}

class SpecialAbilitySpell {
  @prop({ required: true, index: true })
  public name!: string;

  @prop({ required: true, index: true })
  public level!: number;

  @prop({ required: true, index: true })
  public url!: string;

  @prop({ index: true })
  public notes?: string;

  @prop({ type: () => SpecialAbilityUsage })
  public usage?: SpecialAbilityUsage;
}

class SpecialAbilitySpellcasting {
  @prop({ index: true })
  public level?: number;

  @prop({ type: () => APIReference })
  public ability!: APIReference;

  @prop({ index: true })
  public dc?: number;

  @prop({ index: true })
  public modifier?: number;

  @prop({ type: () => [String] })
  public components_required!: string[];

  @prop({ index: true })
  public school?: string;

  @prop({ type: () => Object })
  public slots?: Record<string, number>;

  @prop({ type: () => [SpecialAbilitySpell] })
  public spells!: SpecialAbilitySpell[];
}

class SpecialAbility {
  @prop({ required: true, index: true })
  public name!: string;

  @prop({ required: true, index: true })
  public desc!: string;

  @prop({ index: true })
  public attack_bonus?: number;

  @prop({ type: () => [Damage] })
  public damage?: Damage[];

  @prop({ type: () => DifficultyClass })
  public dc?: DifficultyClass;

  @prop({ type: () => SpecialAbilitySpellcasting })
  public spellcasting?: SpecialAbilitySpellcasting;

  @prop({ type: () => SpecialAbilityUsage })
  public usage!: SpecialAbilityUsage;
}

class Speed {
  @prop({ index: true })
  public burrow?: string;

  @prop({ index: true })
  public climb?: string;

  @prop({ index: true })
  public fly?: string;

  @prop({ index: true })
  public hover?: boolean;

  @prop({ index: true })
  public swim?: string;

  @prop({ index: true })
  public walk?: string;
}

@srdModelOptions('2014-monsters')
export class Monster {
  @prop({ type: () => [Action] })
  public actions?: Action[];

  @prop({ required: true, index: true })
  public alignment!: string;

  @prop({ type: () => [Object], required: true })
  public armor_class!: (
    | ArmorClassDex
    | ArmorClassNatural
    | ArmorClassArmor
    | ArmorClassSpell
    | ArmorClassCondition
  )[];

  @prop({ required: true, index: true })
  public challenge_rating!: number;

  @prop({ required: true, index: true })
  public charisma!: number;

  @prop({ type: () => [APIReference] })
  public condition_immunities!: APIReference[];

  @prop({ required: true, index: true })
  public constitution!: number;

  @prop({ type: () => [String] })
  public damage_immunities!: string[];

  @prop({ type: () => [String] })
  public damage_resistances!: string[];

  @prop({ type: () => [String] })
  public damage_vulnerabilities!: string[];

  @prop({ required: true, index: true })
  public dexterity!: number;

  @prop({ type: () => [APIReference] })
  public forms?: APIReference[];

  @prop({ required: true, index: true })
  public hit_dice!: string;

  @prop({ required: true, index: true })
  public hit_points!: number;

  @prop({ required: true, index: true })
  public hit_points_roll!: string;

  @prop({ index: true })
  public image?: string;

  @prop({ required: true, index: true })
  public index!: string;

  @prop({ required: true, index: true })
  public intelligence!: number;

  @prop({ required: true, index: true })
  public languages!: string;

  @prop({ type: () => [LegendaryAction] })
  public legendary_actions?: LegendaryAction[];

  @prop({ required: true, index: true })
  public name!: string;

  @prop({ type: () => [Proficiency] })
  public proficiencies!: Proficiency[];

  @prop({ type: () => [Reaction] })
  public reactions?: Reaction[];

  @prop({ type: () => Sense })
  public senses!: Sense;

  @prop({ required: true, index: true })
  public size!: string;

  @prop({ type: () => [SpecialAbility] })
  public special_abilities?: SpecialAbility[];

  @prop({ type: () => Speed })
  public speed!: Speed;

  @prop({ required: true, index: true })
  public strength!: number;

  @prop({ index: true })
  public subtype?: string;

  @prop({ required: true, index: true })
  public type!: string;

  @prop({ required: true, index: true })
  public url!: string;

  @prop({ required: true, index: true })
  public wisdom!: number;

  @prop({ required: true, index: true })
  public xp!: number;

  @prop({ required: true, index: true })
  public updated_at!: string;
}

export type MonsterDocument = DocumentType<Monster>;
const MonsterModel = getModelForClass(Monster);

export default MonsterModel;
