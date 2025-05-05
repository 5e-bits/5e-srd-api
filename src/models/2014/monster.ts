import { getModelForClass, modelOptions, prop, Severity } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { APIReference, Choice, DifficultyClass, Damage } from './common'
import { srdModelOptions } from '@/util/modelOptions'
import { ObjectType, Field, Int, Float } from 'type-graphql'

// Export all nested classes/types
@ObjectType({ description: 'Option within a monster action' })
export class ActionOption {
  @prop({ required: true, index: true, type: () => String })
  public action_name!: string

  @prop({ required: true, index: true, type: () => String })
  public count!: number | string

  @prop({ required: true, index: true, type: () => String })
  public type!: 'melee' | 'ranged' | 'ability' | 'magic'
}

@ObjectType({ description: 'Usage details for a monster action or ability' })
export class ActionUsage {
  @prop({ required: true, index: true, type: () => String })
  public type!: string

  @prop({ index: true, type: () => String })
  public dice?: string

  @prop({ index: true, type: () => Number })
  public min_value?: number
}

@ObjectType({ description: 'An action a monster can perform' })
export class Action {
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @prop({ required: true, index: true, type: () => String })
  public desc!: string

  @prop({ index: true, type: () => Number })
  public attack_bonus?: number

  @prop({ type: () => [Damage] })
  public damage?: Damage[]

  @prop({ type: () => DifficultyClass })
  public dc?: DifficultyClass

  @prop({ type: () => Choice })
  public options?: Choice

  @prop({ type: () => ActionUsage })
  public usage?: ActionUsage

  @prop({ required: true, index: true, type: () => String })
  public multiattack_type!: 'actions' | 'action_options'

  @prop({ type: () => [ActionOption] })
  public actions!: ActionOption[]

  @prop({ type: () => Choice })
  public action_options!: Choice
}

@ObjectType({ description: 'Monster Armor Class component: Dexterity based' })
export class ArmorClassDex {
  @prop({ required: true, index: true, type: () => String })
  public type!: 'dex'

  @prop({ required: true, index: true, type: () => Number })
  public value!: number

  @prop({ index: true, type: () => String })
  public desc?: string
}

@ObjectType({ description: 'Monster Armor Class component: Natural armor' })
export class ArmorClassNatural {
  @prop({ required: true, index: true, type: () => String })
  public type!: 'natural'

  @prop({ required: true, index: true, type: () => Number })
  public value!: number

  @prop({ index: true, type: () => String })
  public desc?: string
}

@ObjectType({ description: 'Monster Armor Class component: Armor worn' })
export class ArmorClassArmor {
  @prop({ required: true, index: true, type: () => String })
  public type!: 'armor'

  @prop({ required: true, index: true, type: () => Number })
  public value!: number

  @prop({ type: () => [APIReference] })
  public armor?: APIReference[]

  @prop({ index: true, type: () => String })
  public desc?: string
}

@ObjectType({ description: 'Monster Armor Class component: Spell effect' })
export class ArmorClassSpell {
  @prop({ required: true, index: true, type: () => String })
  public type!: 'spell'

  @prop({ required: true, index: true, type: () => Number })
  public value!: number

  @prop({ type: () => APIReference })
  public spell!: APIReference

  @prop({ index: true, type: () => String })
  public desc?: string
}

@ObjectType({ description: 'Monster Armor Class component: Condition effect' })
export class ArmorClassCondition {
  @prop({ required: true, index: true, type: () => String })
  public type!: 'condition'

  @prop({ required: true, index: true, type: () => Number })
  public value!: number

  @prop({ type: () => APIReference })
  public condition!: APIReference

  @prop({ index: true, type: () => String })
  public desc?: string
}

export type ArmorClass =
  | ArmorClassDex
  | ArmorClassNatural
  | ArmorClassArmor
  | ArmorClassSpell
  | ArmorClassCondition

@ObjectType({ description: 'A legendary action a monster can perform' })
export class LegendaryAction {
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @prop({ required: true, index: true, type: () => String })
  public desc!: string

  @prop({ index: true, type: () => Number })
  public attack_bonus?: number

  @prop({ type: () => [Damage] })
  public damage?: Damage[]

  @prop({ type: () => DifficultyClass })
  public dc?: DifficultyClass
}

@ObjectType({ description: 'A proficiency possessed by a monster' })
export class Proficiency {
  @prop({ type: () => APIReference })
  public proficiency!: APIReference

  @prop({ required: true, index: true, type: () => Number })
  public value!: number
}

@ObjectType({ description: 'A reaction a monster can perform' })
export class Reaction {
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @prop({ required: true, index: true, type: () => String })
  public desc!: string

  @prop({ type: () => DifficultyClass })
  public dc?: DifficultyClass
}

@ObjectType({ description: 'Monster senses details' })
export class Sense {
  @Field(() => String, { nullable: true })
  @prop({ index: true, type: () => String })
  public blindsight?: string

  @Field(() => String, { nullable: true })
  @prop({ index: true, type: () => String })
  public darkvision?: string

  @Field(() => Int)
  @prop({ required: true, index: true, type: () => Number })
  public passive_perception!: number

  @Field(() => String, { nullable: true })
  @prop({ index: true, type: () => String })
  public tremorsense?: string

  @Field(() => String, { nullable: true })
  @prop({ index: true, type: () => String })
  public truesight?: string
}

@ObjectType({ description: 'Usage details for a special ability' })
export class SpecialAbilityUsage {
  @prop({ required: true, index: true, type: () => String })
  public type!: string

  @prop({ index: true, type: () => Number })
  public times?: number

  @prop({ type: () => [String] })
  public rest_types?: string[]
}

@ObjectType({ description: "A spell within a monster's special ability spellcasting" })
export class SpecialAbilitySpell {
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @prop({ required: true, index: true, type: () => Number })
  public level!: number

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @prop({ index: true, type: () => String })
  public notes?: string

  @prop({ type: () => SpecialAbilityUsage })
  public usage?: SpecialAbilityUsage
}

@ObjectType({ description: 'Spellcasting details for a special ability' })
@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class SpecialAbilitySpellcasting {
  @prop({ index: true, type: () => Number })
  public level?: number

  @prop({ type: () => APIReference })
  public ability!: APIReference

  @prop({ index: true, type: () => Number })
  public dc?: number

  @prop({ index: true, type: () => Number })
  public modifier?: number

  @prop({ type: () => [String] })
  public components_required!: string[]

  @prop({ index: true, type: () => String })
  public school?: string

  @prop({ type: () => Object, default: undefined })
  public slots?: Record<string, number>

  @prop({ type: () => [SpecialAbilitySpell] })
  public spells!: SpecialAbilitySpell[]
}

@ObjectType({ description: 'A special ability of the monster' })
export class SpecialAbility {
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @prop({ required: true, index: true, type: () => String })
  public desc!: string

  @prop({ index: true, type: () => Number })
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

@ObjectType({ description: 'Monster movement speeds' })
export class MonsterSpeed {
  @Field(() => String, { nullable: true })
  @prop({ index: true, type: () => String })
  public burrow?: string

  @Field(() => String, { nullable: true })
  @prop({ index: true, type: () => String })
  public climb?: string

  @Field(() => String, { nullable: true })
  @prop({ index: true, type: () => String })
  public fly?: string

  @Field(() => Boolean, { nullable: true })
  @prop({ index: true, type: () => Boolean })
  public hover?: boolean

  @Field(() => String, { nullable: true })
  @prop({ index: true, type: () => String })
  public swim?: string

  @Field(() => String, { nullable: true })
  @prop({ index: true, type: () => String })
  public walk?: string
}

@ObjectType({ description: 'Represents a creature in the D&D SRD' })
@srdModelOptions('2014-monsters')
export class Monster {
  @prop({ type: () => [Action] })
  public actions?: Action[]

  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public alignment!: string

  @prop({ type: () => [Object], required: true })
  public armor_class!: ArmorClass[]

  @Field(() => Float)
  @prop({ required: true, index: true, type: () => Number })
  public challenge_rating!: number

  @Field(() => Int)
  @prop({ required: true, index: true, type: () => Number })
  public charisma!: number

  @prop({ type: () => [APIReference] })
  public condition_immunities!: APIReference[]

  @Field(() => Int)
  @prop({ required: true, index: true, type: () => Number })
  public constitution!: number

  @Field(() => [String])
  @prop({ type: () => [String] })
  public damage_immunities!: string[]

  @Field(() => [String])
  @prop({ type: () => [String] })
  public damage_resistances!: string[]

  @Field(() => [String])
  @prop({ type: () => [String] })
  public damage_vulnerabilities!: string[]

  @Field(() => Int)
  @prop({ required: true, index: true, type: () => Number })
  public dexterity!: number

  @prop({ type: () => [APIReference] })
  public forms?: APIReference[]

  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public hit_dice!: string

  @Field(() => Int)
  @prop({ required: true, index: true, type: () => Number })
  public hit_points!: number

  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public hit_points_roll!: string

  @Field(() => String, { nullable: true })
  @prop({ index: true, type: () => String })
  public image?: string

  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => Int)
  @prop({ required: true, index: true, type: () => Number })
  public intelligence!: number

  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public languages!: string

  @prop({ type: () => [LegendaryAction] })
  public legendary_actions?: LegendaryAction[]

  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @prop({ type: () => [Proficiency] })
  public proficiencies!: Proficiency[]

  @prop({ type: () => [Reaction] })
  public reactions?: Reaction[]

  @Field(() => Sense)
  @prop({ type: () => Sense })
  public senses!: Sense

  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public size!: string

  @prop({ type: () => [SpecialAbility] })
  public special_abilities?: SpecialAbility[]

  @Field(() => MonsterSpeed)
  @prop({ type: () => MonsterSpeed })
  public speed!: MonsterSpeed

  @Field(() => Int)
  @prop({ required: true, index: true, type: () => Number })
  public strength!: number

  @Field(() => String, { nullable: true })
  @prop({ index: true, type: () => String })
  public subtype?: string

  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public type!: string

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => Int)
  @prop({ required: true, index: true, type: () => Number })
  public wisdom!: number

  @Field(() => Int)
  @prop({ required: true, index: true, type: () => Number })
  public xp!: number

  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type MonsterDocument = DocumentType<Monster>
const MonsterModel = getModelForClass(Monster)

export default MonsterModel
