import { getModelForClass, modelOptions, prop, Severity } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, Float, Int, ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { Choice } from '@/models/common/choice'
import { Damage } from '@/models/common/damage'
import { DifficultyClass } from '@/models/common/difficultyClass'
import { srdModelOptions } from '@/util/modelOptions'

import { AbilityScore } from './abilityScore'
import { Condition } from './condition'
import { Proficiency } from './proficiency'
import { Spell } from './spell'

// Export all nested classes/types
@ObjectType({ description: 'Option within a monster action' })
export class ActionOption {
  @Field(() => String, { description: 'The name of the action.' })
  @prop({ required: true, index: true, type: () => String })
  public action_name!: string

  @Field(() => String, { description: 'Number of times the action can be used.' })
  @prop({ required: true, index: true, type: () => String })
  public count!: number | string

  @Field(() => String, { description: 'The type of action.' })
  @prop({ required: true, index: true, type: () => String })
  public type!: 'melee' | 'ranged' | 'ability' | 'magic'
}

@ObjectType({ description: 'Usage details for a monster action or ability' })
export class ActionUsage {
  @Field(() => String, { description: 'The type of action usage.' })
  @prop({ required: true, index: true, type: () => String })
  public type!: string

  @Field(() => String, { nullable: true, description: 'The dice roll for the action usage.' })
  @prop({ index: true, type: () => String })
  public dice?: string

  @Field(() => Int, { nullable: true, description: 'The minimum value for the action usage.' })
  @prop({ index: true, type: () => Number })
  public min_value?: number
}

@ObjectType({ description: 'An action a monster can perform' })
export class MonsterAction {
  @Field(() => String, { description: 'The name of the action.' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => String, { description: 'The description of the action.' })
  @prop({ required: true, index: true, type: () => String })
  public desc!: string

  @Field(() => Int, { nullable: true, description: 'The attack bonus for the action.' })
  @prop({ index: true, type: () => Number })
  public attack_bonus?: number

  // Handled by MonsterActionResolver
  @prop({ type: () => [Object] })
  public damage?: (Damage | Choice)[]

  @Field(() => DifficultyClass, {
    nullable: true,
    description: 'The difficulty class for the action.'
  })
  @prop({ type: () => DifficultyClass })
  public dc?: DifficultyClass

  // Handled by MonsterActionResolver
  @prop({ type: () => Choice })
  public options?: Choice

  @Field(() => ActionUsage, { nullable: true, description: 'The usage for the action.' })
  @prop({ type: () => ActionUsage })
  public usage?: ActionUsage

  @Field(() => String, { nullable: true, description: 'The type of multiattack for the action.' })
  @prop({ required: true, index: true, type: () => String })
  public multiattack_type?: 'actions' | 'action_options'

  @Field(() => [ActionOption], { nullable: true, description: 'The actions for the action.' })
  @prop({ type: () => [ActionOption] })
  public actions?: ActionOption[]

  // Handled by MonsterActionResolver
  @prop({ type: () => Choice })
  public action_options?: Choice
}

@ObjectType({ description: 'Monster Armor Class component: Dexterity based' })
export class ArmorClassDex {
  @Field(() => String, { description: "Type of AC component: 'dex'" })
  @prop({ required: true, index: true, type: () => String })
  public type!: 'dex'

  @Field(() => Int, { description: 'AC value from dexterity.' })
  @prop({ required: true, index: true, type: () => Number })
  public value!: number

  @Field(() => String, {
    nullable: true,
    description: 'Optional description for this AC component.'
  })
  @prop({ index: true, type: () => String })
  public desc?: string
}

@ObjectType({ description: 'Monster Armor Class component: Natural armor' })
export class ArmorClassNatural {
  @Field(() => String, { description: "Type of AC component: 'natural'" })
  @prop({ required: true, index: true, type: () => String })
  public type!: 'natural'

  @Field(() => Int, { description: 'AC value from natural armor.' })
  @prop({ required: true, index: true, type: () => Number })
  public value!: number

  @Field(() => String, {
    nullable: true,
    description: 'Optional description for this AC component.'
  })
  @prop({ index: true, type: () => String })
  public desc?: string
}

@ObjectType({ description: 'Monster Armor Class component: Armor worn' })
export class ArmorClassArmor {
  @Field(() => String, { description: "Type of AC component: 'armor'" })
  @prop({ required: true, index: true, type: () => String })
  public type!: 'armor'

  @Field(() => Int, { description: 'AC value from worn armor.' })
  @prop({ required: true, index: true, type: () => Number })
  public value!: number

  // Handled by MonsterArmorClassResolver
  @prop({ type: () => [APIReference] })
  public armor?: APIReference[]

  @Field(() => String, {
    nullable: true,
    description: 'Optional description for this AC component.'
  })
  @prop({ index: true, type: () => String })
  public desc?: string
}

@ObjectType({ description: 'Monster Armor Class component: Spell effect' })
export class ArmorClassSpell {
  @Field(() => String, { description: "Type of AC component: 'spell'" })
  @prop({ required: true, index: true, type: () => String })
  public type!: 'spell'

  @Field(() => Int, { description: 'AC value from spell effect.' })
  @prop({ required: true, index: true, type: () => Number })
  public value!: number

  @Field(() => Spell, {
    description: 'The spell providing the AC bonus. Resolved via resolver.'
  })
  @prop({ type: () => APIReference })
  public spell!: APIReference

  @Field(() => String, {
    nullable: true,
    description: 'Optional description for this AC component.'
  })
  @prop({ index: true, type: () => String })
  public desc?: string
}

@ObjectType({ description: 'Monster Armor Class component: Condition effect' })
export class ArmorClassCondition {
  @Field(() => String, { description: "Type of AC component: 'condition'" })
  @prop({ required: true, index: true, type: () => String })
  public type!: 'condition'

  @Field(() => Int, { description: 'AC value from condition effect.' })
  @prop({ required: true, index: true, type: () => Number })
  public value!: number

  @Field(() => Condition, {
    description: 'The condition providing the AC bonus. Resolved via resolver.'
  })
  @prop({ type: () => APIReference })
  public condition!: APIReference

  @Field(() => String, {
    nullable: true,
    description: 'Optional description for this AC component.'
  })
  @prop({ index: true, type: () => String })
  public desc?: string
}

@ObjectType({ description: 'A legendary action a monster can perform' })
export class LegendaryAction {
  @Field(() => String, { description: 'The name of the legendary action.' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => String, { description: 'The description of the legendary action.' })
  @prop({ required: true, index: true, type: () => String })
  public desc!: string

  @Field(() => Int, { nullable: true, description: 'The attack bonus for the legendary action.' })
  @prop({ index: true, type: () => Number })
  public attack_bonus?: number

  @Field(() => [Damage], { nullable: true, description: 'The damage for the legendary action.' })
  @prop({ type: () => [Damage] })
  public damage?: Damage[]

  @Field(() => DifficultyClass, {
    nullable: true,
    description: 'The difficulty class for the legendary action.'
  })
  @prop({ type: () => DifficultyClass })
  public dc?: DifficultyClass
}

@ObjectType({ description: "A monster's specific proficiency and its bonus value." })
export class MonsterProficiency {
  @Field(() => Proficiency, {
    description: 'The specific proficiency (e.g., Saving Throw: STR, Skill: Athletics).'
  })
  @prop({ type: () => APIReference })
  public proficiency!: APIReference

  @Field(() => Int, { description: 'The proficiency bonus value for this monster.' })
  @prop({ required: true, index: true, type: () => Number })
  public value!: number
}

@ObjectType({ description: 'A reaction a monster can perform' })
export class Reaction {
  @Field(() => String, { description: 'The name of the reaction.' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => String, { description: 'The description of the reaction.' })
  @prop({ required: true, index: true, type: () => String })
  public desc!: string

  @Field(() => DifficultyClass, {
    nullable: true,
    description: 'The difficulty class for the reaction.'
  })
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
  @Field(() => String, { description: 'The type of usage for the special ability.' })
  @prop({ required: true, index: true, type: () => String })
  public type!: string

  @Field(() => Int, {
    nullable: true,
    description: 'The number of times the special ability can be used.'
  })
  @prop({ index: true, type: () => Number })
  public times?: number

  @Field(() => [String], {
    nullable: true,
    description: 'The types of rest the special ability can be used on.'
  })
  @prop({ type: () => [String] })
  public rest_types?: string[]
}

@ObjectType({ description: "A spell within a monster's special ability spellcasting" })
export class SpecialAbilitySpell {
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => Int, { description: 'The level of the spell.' })
  @prop({ required: true, index: true, type: () => Number })
  public level!: number

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { nullable: true, description: 'The notes for the spell.' })
  @prop({ index: true, type: () => String })
  public notes?: string

  @Field(() => SpecialAbilityUsage, { nullable: true, description: 'The usage for the spell.' })
  @prop({ type: () => SpecialAbilityUsage })
  public usage?: SpecialAbilityUsage
}

@ObjectType({ description: 'Spellcasting details for a monster special ability' })
@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class SpecialAbilitySpellcasting {
  @Field(() => Int, { nullable: true, description: 'The level of the spellcasting.' })
  @prop({ index: true, type: () => Number })
  public level?: number

  @Field(() => AbilityScore, { description: 'The ability for the spellcasting.' })
  @prop({ type: () => APIReference })
  public ability!: APIReference

  @Field(() => Int, { nullable: true, description: 'The difficulty class for the spellcasting.' })
  @prop({ index: true, type: () => Number })
  public dc?: number

  @Field(() => Int, { nullable: true, description: 'The modifier for the spellcasting.' })
  @prop({ index: true, type: () => Number })
  public modifier?: number

  @Field(() => [String], { description: 'The components required for the spellcasting.' })
  @prop({ type: () => [String] })
  public components_required!: string[]

  @Field(() => String, { nullable: true, description: 'The school of the spellcasting.' })
  @prop({ index: true, type: () => String })
  public school?: string

  // Handled by MonsterSpellcastingResolver
  @prop({ type: () => Object, default: undefined })
  public slots?: Record<string, number>

  @Field(() => [SpecialAbilitySpell], { description: 'The spells for the spellcasting.' })
  @prop({ type: () => [SpecialAbilitySpell] })
  public spells!: SpecialAbilitySpell[]
}

@ObjectType({ description: 'A special ability of the monster' })
export class SpecialAbility {
  @Field(() => String, { description: 'The name of the special ability.' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => String, { description: 'The description of the special ability.' })
  @prop({ required: true, index: true, type: () => String })
  public desc!: string

  @Field(() => Int, { nullable: true, description: 'The attack bonus for the special ability.' })
  @prop({ index: true, type: () => Number })
  public attack_bonus?: number

  @Field(() => [Damage], { nullable: true, description: 'The damage for the special ability.' })
  @prop({ type: () => [Damage] })
  public damage?: Damage[]

  @Field(() => DifficultyClass, {
    nullable: true,
    description: 'The difficulty class for the special ability.'
  })
  @prop({ type: () => DifficultyClass })
  public dc?: DifficultyClass

  @Field(() => SpecialAbilitySpellcasting, {
    nullable: true,
    description: 'The spellcasting for the special ability.'
  })
  @prop({ type: () => SpecialAbilitySpellcasting })
  public spellcasting?: SpecialAbilitySpellcasting

  @Field(() => SpecialAbilityUsage, {
    nullable: true,
    description: 'The usage for the special ability.'
  })
  @prop({ type: () => SpecialAbilityUsage })
  public usage?: SpecialAbilityUsage
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

@ObjectType({ description: 'A D&D monster.' })
@srdModelOptions('2014-monsters')
export class Monster {
  @Field(() => [MonsterAction], { nullable: true, description: 'The actions for the monster.' })
  @prop({ type: () => [MonsterAction] })
  public actions?: MonsterAction[]

  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public alignment!: string

  // Handled by MonsterArmorClassResolver
  @prop({
    type: () =>
      Array<
        ArmorClassDex | ArmorClassNatural | ArmorClassArmor | ArmorClassSpell | ArmorClassCondition
      >,
    required: true
  })
  public armor_class!: Array<
    ArmorClassDex | ArmorClassNatural | ArmorClassArmor | ArmorClassSpell | ArmorClassCondition
  >

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

  @Field(() => [LegendaryAction], {
    nullable: true,
    description: 'The legendary actions for the monster.'
  })
  @prop({ type: () => [LegendaryAction] })
  public legendary_actions?: LegendaryAction[]

  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => [MonsterProficiency], {
    nullable: true,
    description: 'The proficiencies for the monster.'
  })
  @prop({ type: () => [MonsterProficiency] })
  public proficiencies!: MonsterProficiency[]

  @Field(() => [Reaction], { nullable: true, description: 'The reactions for the monster.' })
  @prop({ type: () => [Reaction] })
  public reactions?: Reaction[]

  @Field(() => Sense)
  @prop({ type: () => Sense })
  public senses!: Sense

  @Field(() => String)
  @prop({ required: true, index: true, type: () => String })
  public size!: string

  @Field(() => [SpecialAbility], {
    nullable: true,
    description: 'The special abilities for the monster.'
  })
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
