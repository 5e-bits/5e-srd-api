import { getModelForClass, modelOptions, prop, Severity } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, Float, Int, ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { Choice } from '@/models/common/choice'
import { Damage } from '@/models/common/damage'
import { DifficultyClass } from '@/models/common/difficultyClass'
import { srdModelOptions } from '@/util/modelOptions'

import { Condition2024 } from './condition'
import { Equipment2024 } from './equipment'
import { Proficiency2024 } from './proficiency'

@ObjectType({ description: 'Monster movement speeds (2024)' })
export class MonsterSpeed2024 {
  @Field(() => String, { nullable: true })
  @prop({ index: true, type: () => String })
  public walk?: string

  @Field(() => String, { nullable: true })
  @prop({ index: true, type: () => String })
  public burrow?: string

  @Field(() => String, { nullable: true })
  @prop({ index: true, type: () => String })
  public climb?: string

  @Field(() => String, { nullable: true })
  @prop({ index: true, type: () => String })
  public fly?: string

  @Field(() => String, { nullable: true })
  @prop({ index: true, type: () => String })
  public swim?: string

  @Field(() => Boolean, { nullable: true })
  @prop({ index: true, type: () => Boolean })
  public hover?: boolean
}

@ObjectType({ description: 'Monster senses (2024)' })
export class MonsterSense2024 {
  @Field(() => Int)
  @prop({ required: true, index: true, type: () => Number })
  public passive_perception!: number

  @Field(() => String, { nullable: true })
  @prop({ index: true, type: () => String })
  public blindsight?: string

  @Field(() => String, { nullable: true })
  @prop({ index: true, type: () => String })
  public darkvision?: string

  @Field(() => String, { nullable: true })
  @prop({ index: true, type: () => String })
  public tremorsense?: string

  @Field(() => String, { nullable: true })
  @prop({ index: true, type: () => String })
  public truesight?: string
}

@ObjectType({ description: 'An armor class component for a 2024 monster' })
export class MonsterArmorClass2024 {
  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public type!: string

  @Field(() => Int)
  @prop({ required: true, index: true, type: () => Number })
  public value!: number

  // Resolved via MonsterArmorClass2024Resolver
  @Field(() => [Equipment2024], { nullable: true })
  @prop({ type: () => [APIReference] })
  public armor?: APIReference[]

  // Resolved via MonsterArmorClass2024Resolver
  @Field(() => Condition2024, { nullable: true })
  @prop({ type: () => APIReference })
  public condition?: APIReference

  // No 2024 spell model yet — exposed as raw reference
  @Field(() => APIReference, { nullable: true })
  @prop({ type: () => APIReference })
  public spell?: APIReference

  @Field(() => String, { nullable: true })
  @prop({ index: true, type: () => String })
  public desc?: string
}

@ObjectType({ description: "A monster's proficiency and its bonus value (2024)" })
export class MonsterProficiency2024 {
  @Field(() => Int)
  @prop({ required: true, index: true, type: () => Number })
  public value!: number

  // Resolved via MonsterProficiency2024Resolver
  @Field(() => Proficiency2024)
  @prop({ type: () => APIReference })
  public proficiency!: APIReference
}

@ObjectType({ description: 'Usage details for a spellcasting spell (2024)' })
export class SpellcastingSpellUsage2024 {
  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public type!: string

  @Field(() => Int, { nullable: true })
  @prop({ index: true, type: () => Number })
  public times?: number
}

@ObjectType({ description: 'A spell within monster spellcasting (2024)' })
export class SpellcastingSpell2024 {
  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => Int)
  @prop({ required: true, index: true, type: () => Number })
  public level!: number

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => SpellcastingSpellUsage2024, { nullable: true })
  @prop({ type: () => SpellcastingSpellUsage2024 })
  public usage?: SpellcastingSpellUsage2024

  @Field(() => String, { nullable: true })
  @prop({ index: true, type: () => String })
  public notes?: string
}

@ObjectType({ description: 'Spellcasting details for a 2024 monster' })
@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class Spellcasting2024 {
  // Resolved via Spellcasting2024Resolver
  @prop({ type: () => APIReference })
  public ability!: APIReference

  @Field(() => [String])
  @prop({ type: () => [String] })
  public components_required!: string[]

  @Field(() => [SpellcastingSpell2024])
  @prop({ type: () => [SpellcastingSpell2024] })
  public spells!: SpellcastingSpell2024[]

  @Field(() => Int, { nullable: true })
  @prop({ index: true, type: () => Number })
  public level?: number

  @Field(() => Int, { nullable: true })
  @prop({ index: true, type: () => Number })
  public dc?: number

  @Field(() => Int, { nullable: true })
  @prop({ index: true, type: () => Number })
  public modifier?: number

  @Field(() => String, { nullable: true })
  @prop({ index: true, type: () => String })
  public school?: string

  // Resolved via Spellcasting2024Resolver
  @prop({ type: () => Object, default: undefined })
  public slots?: Record<string, number>
}

@ObjectType({ description: 'Usage details for a 2024 monster action' })
export class ActionUsage2024 {
  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public type!: string

  @Field(() => String, { nullable: true })
  @prop({ index: true, type: () => String })
  public dice?: string

  @Field(() => Int, { nullable: true })
  @prop({ index: true, type: () => Number })
  public min_value?: number
}

@ObjectType({ description: 'An item within a 2024 monster multiattack action' })
export class MonsterActionItem2024 {
  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public action_name!: string

  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public count!: number | string

  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public type!: string
}

@ObjectType({ description: 'An attack within a 2024 monster action' })
export class MonsterAttack2024 {
  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => DifficultyClass)
  @prop({ type: () => DifficultyClass })
  public dc!: DifficultyClass

  @Field(() => [Damage], { nullable: true })
  @prop({ type: () => [Damage] })
  public damage?: Damage[]
}

@ObjectType({ description: 'An action a 2024 monster can perform' })
export class MonsterAction2024 {
  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public desc!: string

  @Field(() => Int, { nullable: true })
  @prop({ index: true, type: () => Number })
  public attack_bonus?: number

  @Field(() => DifficultyClass, { nullable: true })
  @prop({ type: () => DifficultyClass })
  public dc?: DifficultyClass

  @Field(() => ActionUsage2024, { nullable: true })
  @prop({ type: () => ActionUsage2024 })
  public usage?: ActionUsage2024

  @Field(() => String, { nullable: true })
  @prop({ index: true, type: () => String })
  public multiattack_type?: string

  @Field(() => [MonsterActionItem2024], { nullable: true })
  @prop({ type: () => [MonsterActionItem2024] })
  public actions?: MonsterActionItem2024[]

  // Handled by MonsterAction2024Resolver
  @prop({ type: () => Choice })
  public action_options?: Choice

  @Field(() => [MonsterAttack2024], { nullable: true })
  @prop({ type: () => [MonsterAttack2024] })
  public attacks?: MonsterAttack2024[]

  // Handled by MonsterAction2024Resolver
  @prop({ type: () => Choice })
  public options?: Choice

  // Handled by MonsterAction2024Resolver
  @prop({ type: () => [Object] })
  public damage?: (Damage | Choice)[]

  @Field(() => Spellcasting2024, { nullable: true })
  @prop({ type: () => Spellcasting2024 })
  public spellcasting?: Spellcasting2024
}

@ObjectType({ description: 'A legendary action a 2024 monster can perform' })
export class LegendaryAction2024 {
  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public desc!: string

  @Field(() => Int, { nullable: true })
  @prop({ index: true, type: () => Number })
  public attack_bonus?: number

  @Field(() => [Damage], { nullable: true })
  @prop({ type: () => [Damage] })
  public damage?: Damage[]

  @Field(() => DifficultyClass, { nullable: true })
  @prop({ type: () => DifficultyClass })
  public dc?: DifficultyClass
}

@ObjectType({ description: 'A reaction a 2024 monster can perform' })
export class Reaction2024 {
  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public desc!: string

  @Field(() => DifficultyClass, { nullable: true })
  @prop({ type: () => DifficultyClass })
  public dc?: DifficultyClass
}

@ObjectType({ description: 'Usage details for a 2024 monster special ability' })
export class SpecialAbilityUsage2024 {
  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public type!: string

  @Field(() => Int, { nullable: true })
  @prop({ index: true, type: () => Number })
  public times?: number

  @Field(() => Int, { nullable: true })
  @prop({ index: true, type: () => Number })
  public times_in_lair?: number

  @Field(() => [String], { nullable: true })
  @prop({ type: () => [String] })
  public rest_types?: string[]
}

@ObjectType({ description: 'A special ability of a 2024 monster' })
export class SpecialAbility2024 {
  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public desc!: string

  @Field(() => Int, { nullable: true })
  @prop({ index: true, type: () => Number })
  public attack_bonus?: number

  @Field(() => [Damage], { nullable: true })
  @prop({ type: () => [Damage] })
  public damage?: Damage[]

  @Field(() => DifficultyClass, { nullable: true })
  @prop({ type: () => DifficultyClass })
  public dc?: DifficultyClass

  @Field(() => SpecialAbilityUsage2024, { nullable: true })
  @prop({ type: () => SpecialAbilityUsage2024 })
  public usage?: SpecialAbilityUsage2024

  @Field(() => Spellcasting2024, { nullable: true })
  @prop({ type: () => Spellcasting2024 })
  public spellcasting?: Spellcasting2024
}

@ObjectType({ description: 'A D&D 2024 monster.' })
@srdModelOptions('2024-monsters')
export class Monster2024 {
  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public size!: string

  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public type!: string

  @Field(() => String, { nullable: true })
  @prop({ index: true, type: () => String })
  public subtype?: string

  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public alignment!: string

  @Field(() => [MonsterArmorClass2024])
  @prop({ type: () => [MonsterArmorClass2024], required: true })
  public armor_class!: MonsterArmorClass2024[]

  @Field(() => Int)
  @prop({ required: true, index: true, type: () => Number })
  public hit_points!: number

  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public hit_dice!: string

  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public hit_points_roll!: string

  @Field(() => MonsterSpeed2024)
  @prop({ type: () => MonsterSpeed2024 })
  public speed!: MonsterSpeed2024

  @Field(() => Int)
  @prop({ required: true, index: true, type: () => Number })
  public strength!: number

  @Field(() => Int)
  @prop({ required: true, index: true, type: () => Number })
  public dexterity!: number

  @Field(() => Int)
  @prop({ required: true, index: true, type: () => Number })
  public constitution!: number

  @Field(() => Int)
  @prop({ required: true, index: true, type: () => Number })
  public intelligence!: number

  @Field(() => Int)
  @prop({ required: true, index: true, type: () => Number })
  public wisdom!: number

  @Field(() => Int)
  @prop({ required: true, index: true, type: () => Number })
  public charisma!: number

  @Field(() => [MonsterProficiency2024])
  @prop({ type: () => [MonsterProficiency2024] })
  public proficiencies!: MonsterProficiency2024[]

  @Field(() => [String])
  @prop({ type: () => [String] })
  public damage_vulnerabilities!: string[]

  @Field(() => [String])
  @prop({ type: () => [String] })
  public damage_resistances!: string[]

  @Field(() => [String])
  @prop({ type: () => [String] })
  public damage_immunities!: string[]

  // Resolved via Monster2024Resolver
  @Field(() => [Condition2024])
  @prop({ type: () => [APIReference] })
  public condition_immunities!: APIReference[]

  @Field(() => MonsterSense2024)
  @prop({ type: () => MonsterSense2024 })
  public senses!: MonsterSense2024

  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public languages!: string

  @Field(() => Float)
  @prop({ required: true, index: true, type: () => Number })
  public challenge_rating!: number

  @Field(() => Int, { nullable: true })
  @prop({ index: true, type: () => Number })
  public proficiency_bonus?: number

  @Field(() => Int)
  @prop({ required: true, index: true, type: () => Number })
  public xp!: number

  @Field(() => Int, { nullable: true })
  @prop({ index: true, type: () => Number })
  public xp_in_lair?: number

  @Field(() => [SpecialAbility2024], { nullable: true })
  @prop({ type: () => [SpecialAbility2024] })
  public special_abilities?: SpecialAbility2024[]

  @Field(() => [MonsterAction2024], { nullable: true })
  @prop({ type: () => [MonsterAction2024] })
  public actions?: MonsterAction2024[]

  @Field(() => [LegendaryAction2024], { nullable: true })
  @prop({ type: () => [LegendaryAction2024] })
  public legendary_actions?: LegendaryAction2024[]

  @Field(() => [Reaction2024], { nullable: true })
  @prop({ type: () => [Reaction2024] })
  public reactions?: Reaction2024[]

  // Resolved via Monster2024Resolver
  @Field(() => [Monster2024], { nullable: true })
  @prop({ type: () => [APIReference] })
  public forms?: APIReference[]

  @Field(() => String, { nullable: true })
  @prop({ index: true, type: () => String })
  public image?: string

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type Monster2024Document = DocumentType<Monster2024>
const Monster2024Model = getModelForClass(Monster2024)

export default Monster2024Model
