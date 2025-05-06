import { getModelForClass, modelOptions, prop, Severity } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { APIReference } from '@/models/2014/types/apiReference'
import { Choice, DifficultyClass, Damage } from '@/models/2014/common'
import { srdModelOptions } from '@/util/modelOptions'
import { ObjectType, Field, Int, Float } from 'type-graphql'
import { Condition } from './condition'

// Export all nested classes/types
@ObjectType({ description: 'Option within a monster action' })
export class ActionOption {
  // TODO: Define complex types post-Pass 2 (ActionOption)
  @prop({ required: true, index: true, type: () => String })
  public action_name!: string

  // TODO: Define complex types post-Pass 2 (ActionOption)
  @prop({ required: true, index: true, type: () => String })
  public count!: number | string

  // TODO: Define complex types post-Pass 2 (ActionOption)
  @prop({ required: true, index: true, type: () => String })
  public type!: 'melee' | 'ranged' | 'ability' | 'magic'
}

@ObjectType({ description: 'Usage details for a monster action or ability' })
export class ActionUsage {
  // TODO: Define complex types post-Pass 2 (ActionUsage)
  @prop({ required: true, index: true, type: () => String })
  public type!: string

  // TODO: Define complex types post-Pass 2 (ActionUsage)
  @prop({ index: true, type: () => String })
  public dice?: string

  // TODO: Define complex types post-Pass 2 (ActionUsage)
  @prop({ index: true, type: () => Number })
  public min_value?: number
}

@ObjectType({ description: 'An action a monster can perform' })
export class Action {
  // TODO: Define complex types post-Pass 2 (Action)
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  // TODO: Define complex types post-Pass 2 (Action)
  @prop({ required: true, index: true, type: () => String })
  public desc!: string

  // TODO: Define complex types post-Pass 2 (Action)
  @prop({ index: true, type: () => Number })
  public attack_bonus?: number

  // TODO: Define complex types post-Pass 2 (Action - nested Damage)
  @prop({ type: () => [Damage] })
  public damage?: Damage[]

  // TODO: Define complex types post-Pass 2 (Action - nested DifficultyClass)
  @prop({ type: () => DifficultyClass })
  public dc?: DifficultyClass

  // TODO: Pass 3 - Implement choice resolver
  @prop({ type: () => Choice })
  public options?: Choice

  // TODO: Define complex types post-Pass 2 (Action - nested ActionUsage)
  @prop({ type: () => ActionUsage })
  public usage?: ActionUsage

  // TODO: Define complex types post-Pass 2 (Action)
  @prop({ required: true, index: true, type: () => String })
  public multiattack_type!: 'actions' | 'action_options'

  // TODO: Define complex types post-Pass 2 (Action - nested ActionOption array)
  @prop({ type: () => [ActionOption] })
  public actions!: ActionOption[]

  // TODO: Pass 3 - Implement choice resolver
  @prop({ type: () => Choice })
  public action_options!: Choice
}

@ObjectType({ description: 'Monster Armor Class component: Dexterity based' })
export class ArmorClassDex {
  // Note: Part of the ArmorClass union, defined post-Pass 2
  @prop({ required: true, index: true, type: () => String })
  public type!: 'dex'

  @prop({ required: true, index: true, type: () => Number })
  public value!: number

  @prop({ index: true, type: () => String })
  public desc?: string
}

@ObjectType({ description: 'Monster Armor Class component: Natural armor' })
export class ArmorClassNatural {
  // Note: Part of the ArmorClass union, defined post-Pass 2
  @prop({ required: true, index: true, type: () => String })
  public type!: 'natural'

  @prop({ required: true, index: true, type: () => Number })
  public value!: number

  @prop({ index: true, type: () => String })
  public desc?: string
}

@ObjectType({ description: 'Monster Armor Class component: Armor worn' })
export class ArmorClassArmor {
  // Note: Part of the ArmorClass union, defined post-Pass 2
  @prop({ required: true, index: true, type: () => String })
  public type!: 'armor'

  @prop({ required: true, index: true, type: () => Number })
  public value!: number

  // Reference resolver exists, but field exposed when ArmorClass union defined
  @prop({ type: () => [APIReference] })
  public armor?: APIReference[]

  @prop({ index: true, type: () => String })
  public desc?: string
}

@ObjectType({ description: 'Monster Armor Class component: Spell effect' })
export class ArmorClassSpell {
  // Note: Part of the ArmorClass union, defined post-Pass 2
  @prop({ required: true, index: true, type: () => String })
  public type!: 'spell'

  @prop({ required: true, index: true, type: () => Number })
  public value!: number

  // Reference resolver exists, but field exposed when ArmorClass union defined
  @prop({ type: () => APIReference })
  public spell!: APIReference

  @prop({ index: true, type: () => String })
  public desc?: string
}

@ObjectType({ description: 'Monster Armor Class component: Condition effect' })
export class ArmorClassCondition {
  // Note: Part of the ArmorClass union, defined post-Pass 2
  @prop({ required: true, index: true, type: () => String })
  public type!: 'condition'

  @prop({ required: true, index: true, type: () => Number })
  public value!: number

  // Reference resolver exists, but field exposed when ArmorClass union defined
  @prop({ type: () => APIReference })
  public condition!: APIReference

  @prop({ index: true, type: () => String })
  public desc?: string
}

// TODO: Define complex types post-Pass 2 (ArmorClass Union definition)
export type ArmorClass =
  | ArmorClassDex
  | ArmorClassNatural
  | ArmorClassArmor
  | ArmorClassSpell
  | ArmorClassCondition

@ObjectType({ description: 'A legendary action a monster can perform' })
export class LegendaryAction {
  // TODO: Define complex types post-Pass 2 (LegendaryAction)
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  // TODO: Define complex types post-Pass 2 (LegendaryAction)
  @prop({ required: true, index: true, type: () => String })
  public desc!: string

  // TODO: Define complex types post-Pass 2 (LegendaryAction)
  @prop({ index: true, type: () => Number })
  public attack_bonus?: number

  // TODO: Define complex types post-Pass 2 (LegendaryAction - nested Damage)
  @prop({ type: () => [Damage] })
  public damage?: Damage[]

  // TODO: Define complex types post-Pass 2 (LegendaryAction - nested DifficultyClass)
  @prop({ type: () => DifficultyClass })
  public dc?: DifficultyClass
}

@ObjectType({ description: 'A proficiency possessed by a monster' })
export class Proficiency {
  // This is the nested type for Monster.proficiencies
  // Note: Part of Monster.proficiencies array, defined post-Pass 2

  // Reference resolver exists, but field exposed when Monster.proficiencies defined
  @prop({ type: () => APIReference })
  public proficiency!: APIReference

  // Scalar field, exposed when Monster.proficiencies defined
  @prop({ required: true, index: true, type: () => Number })
  public value!: number
}

@ObjectType({ description: 'A reaction a monster can perform' })
export class Reaction {
  // TODO: Define complex types post-Pass 2 (Reaction)
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  // TODO: Define complex types post-Pass 2 (Reaction)
  @prop({ required: true, index: true, type: () => String })
  public desc!: string

  // TODO: Define complex types post-Pass 2 (Reaction - nested DifficultyClass)
  @prop({ type: () => DifficultyClass })
  public dc?: DifficultyClass
}

@ObjectType({ description: 'Monster senses details' })
export class Sense {
  // Note: All fields are simple scalars handled in Pass 1
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
  // TODO: Define complex types post-Pass 2 (SpecialAbilityUsage)
  @prop({ required: true, index: true, type: () => String })
  public type!: string

  // TODO: Define complex types post-Pass 2 (SpecialAbilityUsage)
  @prop({ index: true, type: () => Number })
  public times?: number

  // TODO: Define complex types post-Pass 2 (SpecialAbilityUsage)
  @prop({ type: () => [String] })
  public rest_types?: string[]
}

@ObjectType({ description: "A spell within a monster's special ability spellcasting" })
export class SpecialAbilitySpell {
  // TODO: Define complex types post-Pass 2 (SpecialAbilitySpell - possibly resolve name/url to actual Spell?)
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  // TODO: Define complex types post-Pass 2 (SpecialAbilitySpell)
  @prop({ required: true, index: true, type: () => Number })
  public level!: number

  // TODO: Define complex types post-Pass 2 (SpecialAbilitySpell)
  @prop({ required: true, index: true, type: () => String })
  public url!: string

  // TODO: Define complex types post-Pass 2 (SpecialAbilitySpell)
  @prop({ index: true, type: () => String })
  public notes?: string

  // TODO: Define complex types post-Pass 2 (SpecialAbilitySpell - nested SpecialAbilityUsage)
  @prop({ type: () => SpecialAbilityUsage })
  public usage?: SpecialAbilityUsage
}

@ObjectType({ description: 'Spellcasting details for a special ability' })
@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class SpecialAbilitySpellcasting {
  // Note: Part of SpecialAbility type, defined post-Pass 2

  // TODO: Define complex types post-Pass 2 (SpecialAbilitySpellcasting)
  @prop({ index: true, type: () => Number })
  public level?: number

  // Reference resolver exists, but field exposed when SpecialAbility.spellcasting defined
  @prop({ type: () => APIReference })
  public ability!: APIReference

  // TODO: Define complex types post-Pass 2 (SpecialAbilitySpellcasting)
  @prop({ index: true, type: () => Number })
  public dc?: number

  // TODO: Define complex types post-Pass 2 (SpecialAbilitySpellcasting)
  @prop({ index: true, type: () => Number })
  public modifier?: number

  // TODO: Define complex types post-Pass 2 (SpecialAbilitySpellcasting)
  @prop({ type: () => [String] })
  public components_required!: string[]

  // TODO: Define complex types post-Pass 2 (SpecialAbilitySpellcasting)
  @prop({ index: true, type: () => String })
  public school?: string

  // TODO: Define complex types post-Pass 2 (SpecialAbilitySpellcasting - slots object)
  @prop({ type: () => Object, default: undefined })
  public slots?: Record<string, number>

  // TODO: Define complex types post-Pass 2 (SpecialAbilitySpellcasting - nested SpecialAbilitySpell array)
  @prop({ type: () => [SpecialAbilitySpell] })
  public spells!: SpecialAbilitySpell[]
}

@ObjectType({ description: 'A special ability of the monster' })
export class SpecialAbility {
  // TODO: Define complex types post-Pass 2 (SpecialAbility)
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  // TODO: Define complex types post-Pass 2 (SpecialAbility)
  @prop({ required: true, index: true, type: () => String })
  public desc!: string

  // TODO: Define complex types post-Pass 2 (SpecialAbility)
  @prop({ index: true, type: () => Number })
  public attack_bonus?: number

  // TODO: Define complex types post-Pass 2 (SpecialAbility - nested Damage)
  @prop({ type: () => [Damage] })
  public damage?: Damage[]

  // TODO: Define complex types post-Pass 2 (SpecialAbility - nested DifficultyClass)
  @prop({ type: () => DifficultyClass })
  public dc?: DifficultyClass

  // TODO: Define complex types post-Pass 2 (SpecialAbility - nested SpecialAbilitySpellcasting)
  @prop({ type: () => SpecialAbilitySpellcasting })
  public spellcasting?: SpecialAbilitySpellcasting

  // TODO: Define complex types post-Pass 2 (SpecialAbility - nested SpecialAbilityUsage)
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
  // TODO: Define complex types post-Pass 2 (Action array)
  @prop({ type: () => [Action] })
  public actions?: Action[]

  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public alignment!: string

  // TODO: Define complex types post-Pass 2 (ArmorClass union array)
  @prop({ type: () => [Object], required: true })
  public armor_class!: ArmorClass[]

  @Field(() => Float)
  @prop({ required: true, index: true, type: () => Number })
  public challenge_rating!: number

  @Field(() => Int)
  @prop({ required: true, index: true, type: () => Number })
  public charisma!: number

  @Field(() => [Condition], { nullable: true, description: 'Conditions the monster is immune to.' })
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

  @Field(() => [Monster], { nullable: true, description: 'Other forms the monster can assume.' })
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

  // TODO: Define complex types post-Pass 2 (LegendaryAction array)
  @prop({ type: () => [LegendaryAction] })
  public legendary_actions?: LegendaryAction[]

  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  // TODO: Define complex types post-Pass 2 (Nested Proficiency array)
  @prop({ type: () => [Proficiency] })
  public proficiencies!: Proficiency[]

  // TODO: Define complex types post-Pass 2 (Reaction array)
  @prop({ type: () => [Reaction] })
  public reactions?: Reaction[]

  @Field(() => Sense)
  @prop({ type: () => Sense })
  public senses!: Sense

  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public size!: string

  // TODO: Define complex types post-Pass 2 (SpecialAbility array)
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
