import { getModelForClass, modelOptions, prop, Severity } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { APIReference, Choice, DifficultyClass, Damage } from './common'
import { srdModelOptions } from '@/util/modelOptions'

// Export all nested classes/types
export class ActionOption {
  @prop({ required: true, type: () => String })
  public action_name!: string

  @prop({ required: true, type: () => String })
  public count!: number | string

  @prop({ required: true, type: () => String })
  public type!: 'melee' | 'ranged' | 'ability' | 'magic'
}

export class ActionUsage {
  @prop({ required: true, type: () => String })
  public type!: string

  @prop({ type: () => String })
  public dice?: string

  @prop({ type: () => Number })
  public min_value?: number
}

export class Action {
  @prop({ required: true, type: () => String })
  public name!: string

  @prop({ required: true, type: () => String })
  public desc!: string

  @prop({ type: () => Number })
  public attack_bonus?: number

  @prop({ type: () => [Damage] })
  public damage?: Damage[]

  @prop({ type: () => DifficultyClass })
  public dc?: DifficultyClass

  @prop({ type: () => Choice })
  public options?: Choice

  @prop({ type: () => ActionUsage })
  public usage?: ActionUsage

  @prop({ required: true, type: () => String })
  public multiattack_type!: 'actions' | 'action_options'

  @prop({ type: () => [ActionOption] })
  public actions!: ActionOption[]

  @prop({ type: () => Choice })
  public action_options!: Choice
}

export class ArmorClassDex {
  @prop({ required: true, type: () => String })
  public type!: 'dex'

  @prop({ required: true, type: () => Number })
  public value!: number

  @prop({ type: () => String })
  public desc?: string
}

export class ArmorClassNatural {
  @prop({ required: true, type: () => String })
  public type!: 'natural'

  @prop({ required: true, type: () => Number })
  public value!: number

  @prop({ type: () => String })
  public desc?: string
}

export class ArmorClassArmor {
  @prop({ required: true, type: () => String })
  public type!: 'armor'

  @prop({ required: true, type: () => Number })
  public value!: number

  @prop({ type: () => [APIReference] })
  public armor?: APIReference[]

  @prop({ type: () => String })
  public desc?: string
}

export class ArmorClassSpell {
  @prop({ required: true, type: () => String })
  public type!: 'spell'

  @prop({ required: true, type: () => Number })
  public value!: number

  @prop({ type: () => APIReference })
  public spell!: APIReference

  @prop({ type: () => String })
  public desc?: string
}

export class ArmorClassCondition {
  @prop({ required: true, type: () => String })
  public type!: 'condition'

  @prop({ required: true, type: () => Number })
  public value!: number

  @prop({ type: () => APIReference })
  public condition!: APIReference

  @prop({ type: () => String })
  public desc?: string
}

export type ArmorClass =
  | ArmorClassDex
  | ArmorClassNatural
  | ArmorClassArmor
  | ArmorClassSpell
  | ArmorClassCondition

export class LegendaryAction {
  @prop({ required: true, type: () => String })
  public name!: string

  @prop({ required: true, type: () => String })
  public desc!: string

  @prop({ type: () => Number })
  public attack_bonus?: number

  @prop({ type: () => [Damage] })
  public damage?: Damage[]

  @prop({ type: () => DifficultyClass })
  public dc?: DifficultyClass
}

export class Proficiency {
  @prop({ type: () => APIReference })
  public proficiency!: APIReference

  @prop({ required: true, type: () => Number })
  public value!: number
}

export class Reaction {
  @prop({ required: true, type: () => String })
  public name!: string

  @prop({ required: true, type: () => String })
  public desc!: string

  @prop({ type: () => DifficultyClass })
  public dc?: DifficultyClass
}

export class Sense {
  @prop({ type: () => String })
  public blindsight?: string

  @prop({ type: () => String })
  public darkvision?: string

  @prop({ required: true, type: () => Number })
  public passive_perception!: number

  @prop({ type: () => String })
  public tremorsense?: string

  @prop({ type: () => String })
  public truesight?: string
}

export class SpecialAbilityUsage {
  @prop({ required: true, type: () => String })
  public type!: string

  @prop({ type: () => Number })
  public times?: number

  @prop({ type: () => [String] })
  public rest_types?: string[]
}

export class SpecialAbilitySpell {
  @prop({ required: true, type: () => String })
  public name!: string

  @prop({ required: true, type: () => Number })
  public level!: number

  @prop({ required: true, type: () => String })
  public url!: string

  @prop({ type: () => String })
  public notes?: string

  @prop({ type: () => SpecialAbilityUsage })
  public usage?: SpecialAbilityUsage
}

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class SpecialAbilitySpellcasting {
  @prop({ type: () => Number })
  public level?: number

  @prop({ type: () => APIReference })
  public ability!: APIReference

  @prop({ type: () => Number })
  public dc?: number

  @prop({ type: () => Number })
  public modifier?: number

  @prop({ type: () => [String] })
  public components_required!: string[]

  @prop({ type: () => String })
  public school?: string

  @prop({ type: () => Object, default: undefined })
  public slots?: Record<string, number>

  @prop({ type: () => [SpecialAbilitySpell] })
  public spells!: SpecialAbilitySpell[]
}

export class SpecialAbility {
  @prop({ required: true, type: () => String })
  public name!: string

  @prop({ required: true, type: () => String })
  public desc!: string

  @prop({ type: () => Number })
  public attack_bonus?: number

  @prop({ type: () => [Damage] })
  public damage?: Damage[]

  @prop({ type: () => DifficultyClass })
  public dc?: DifficultyClass

  @prop({ type: () => SpecialAbilitySpellcasting })
  public spellcasting?: SpecialAbilitySpellcasting

  @prop({ type: () => SpecialAbilityUsage })
  public usage!: SpecialAbilityUsage
}

export class Speed {
  @prop({ type: () => String })
  public burrow?: string

  @prop({ type: () => String })
  public climb?: string

  @prop({ type: () => String })
  public fly?: string

  @prop({ type: () => Boolean })
  public hover?: boolean

  @prop({ type: () => String })
  public swim?: string

  @prop({ type: () => String })
  public walk?: string
}

@srdModelOptions('2014-monsters')
export class Monster {
  @prop({ type: () => [Action] })
  public actions?: Action[]

  @prop({ required: true, type: () => String })
  public alignment!: string

  @prop({ type: () => [Object], required: true })
  public armor_class!: ArmorClass[]

  @prop({ required: true, index: true, type: () => Number })
  public challenge_rating!: number

  @prop({ required: true, type: () => Number })
  public charisma!: number

  @prop({ type: () => [APIReference] })
  public condition_immunities!: APIReference[]

  @prop({ required: true, type: () => Number })
  public constitution!: number

  @prop({ type: () => [String] })
  public damage_immunities!: string[]

  @prop({ type: () => [String] })
  public damage_resistances!: string[]

  @prop({ type: () => [String] })
  public damage_vulnerabilities!: string[]

  @prop({ required: true, type: () => Number })
  public dexterity!: number

  @prop({ type: () => [APIReference] })
  public forms?: APIReference[]

  @prop({ required: true, type: () => String })
  public hit_dice!: string

  @prop({ required: true, type: () => Number })
  public hit_points!: number

  @prop({ required: true, type: () => String })
  public hit_points_roll!: string

  @prop({ type: () => String })
  public image?: string

  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @prop({ required: true, type: () => Number })
  public intelligence!: number

  @prop({ required: true, type: () => String })
  public languages!: string

  @prop({ type: () => [LegendaryAction] })
  public legendary_actions?: LegendaryAction[]

  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @prop({ type: () => [Proficiency] })
  public proficiencies!: Proficiency[]

  @prop({ type: () => [Reaction] })
  public reactions?: Reaction[]

  @prop({ type: () => Sense })
  public senses!: Sense

  @prop({ required: true, index: true, type: () => String })
  public size!: string

  @prop({ type: () => [SpecialAbility] })
  public special_abilities?: SpecialAbility[]

  @prop({ type: () => Speed })
  public speed!: Speed

  @prop({ required: true, type: () => Number })
  public strength!: number

  @prop({ type: () => String })
  public subtype?: string

  @prop({ required: true, index: true, type: () => String })
  public type!: string

  @prop({ required: true, type: () => String })
  public url!: string

  @prop({ required: true, type: () => Number })
  public wisdom!: number

  @prop({ required: true, type: () => Number })
  public xp!: number

  @prop({ required: true, type: () => String })
  public updated_at!: string
}

export type MonsterDocument = DocumentType<Monster>
const MonsterModel = getModelForClass(Monster)

export default MonsterModel
