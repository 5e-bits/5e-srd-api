import { getModelForClass, modelOptions, Severity } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { Choice } from '@/models/common/choice'
import { Damage } from '@/models/common/damage'
import { DifficultyClass } from '@/models/common/difficultyClass'
import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

import { AbilityScore } from './abilityScore'
import { Condition } from './condition'
import { Proficiency } from './proficiency'
import { Spell } from './spell'

// Export all nested classes/types
@ObjectType({ description: 'Option within a monster action' })
export class ActionOption {
  @field(T.String, { description: 'The name of the action.', required: true, index: true })
  public action_name!: string

  @field(T.String, {
    description: 'Number of times the action can be used.',
    required: true,
    index: true
  })
  public count!: string

  @field(T.String, { description: 'The type of action.', required: true, index: true })
  public type!: 'melee' | 'ranged' | 'ability' | 'magic'
}

@ObjectType({ description: 'Usage details for a monster action or ability' })
export class ActionUsage {
  @field(T.String, { description: 'The type of action usage.', required: true, index: true })
  public type!: string

  @field(T.String, {
    description: 'The dice roll for the action usage.',
    index: true,
    gql: { nullable: true }
  })
  public dice?: string

  @field(T.Int, {
    description: 'The minimum value for the action usage.',
    index: true,
    gql: { nullable: true }
  })
  public min_value?: number
}

@ObjectType({ description: 'An action a monster can perform' })
@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class MonsterAction {
  @field(T.String, { description: 'The name of the action.', required: true, index: true })
  public name!: string

  @field(T.String, { description: 'The description of the action.', required: true, index: true })
  public desc!: string

  @field(T.Int, {
    description: 'The attack bonus for the action.',
    index: true,
    gql: { nullable: true }
  })
  public attack_bonus?: number

  // Handled by MonsterActionResolver
  @field(T.List(() => Object), { gql: false })
  public damage?: (Damage | Choice)[]

  @field(T.Model(() => DifficultyClass), {
    description: 'The difficulty class for the action.',
    gql: { nullable: true }
  })
  public dc?: DifficultyClass

  // Handled by MonsterActionResolver
  @field(T.Model(() => Choice), { gql: false })
  public options?: Choice

  @field(T.Model(() => ActionUsage), {
    description: 'The usage for the action.',
    gql: { nullable: true }
  })
  public usage?: ActionUsage

  @field(T.String, {
    description: 'The type of multiattack for the action.',
    required: true,
    index: true,
    gql: { nullable: true }
  })
  public multiattack_type?: 'actions' | 'action_options'

  @field(T.List(() => ActionOption), {
    description: 'The actions for the action.',
    gql: { nullable: true }
  })
  public actions?: ActionOption[]

  // Handled by MonsterActionResolver
  @field(T.Model(() => Choice), { gql: false })
  public action_options?: Choice
}

@ObjectType({ description: 'Monster Armor Class component: Dexterity based' })
export class ArmorClassDex {
  @field(T.String, { description: "Type of AC component: 'dex'", required: true, index: true })
  public type!: 'dex'

  @field(T.Int, { description: 'AC value from dexterity.', required: true, index: true })
  public value!: number

  @field(T.String, {
    description: 'Optional description for this AC component.',
    index: true,
    gql: { nullable: true }
  })
  public desc?: string
}

@ObjectType({ description: 'Monster Armor Class component: Natural armor' })
export class ArmorClassNatural {
  @field(T.String, { description: "Type of AC component: 'natural'", required: true, index: true })
  public type!: 'natural'

  @field(T.Int, { description: 'AC value from natural armor.', required: true, index: true })
  public value!: number

  @field(T.String, {
    description: 'Optional description for this AC component.',
    index: true,
    gql: { nullable: true }
  })
  public desc?: string
}

@ObjectType({ description: 'Monster Armor Class component: Armor worn' })
export class ArmorClassArmor {
  @field(T.String, { description: "Type of AC component: 'armor'", required: true, index: true })
  public type!: 'armor'

  @field(T.Int, { description: 'AC value from worn armor.', required: true, index: true })
  public value!: number

  // Handled by MonsterArmorClassResolver
  @field(T.List(() => APIReference), { gql: false })
  public armor?: APIReference[]

  @field(T.String, {
    description: 'Optional description for this AC component.',
    index: true,
    gql: { nullable: true }
  })
  public desc?: string
}

@ObjectType({ description: 'Monster Armor Class component: Spell effect' })
export class ArmorClassSpell {
  @field(T.String, { description: "Type of AC component: 'spell'", required: true, index: true })
  public type!: 'spell'

  @field(T.Int, { description: 'AC value from spell effect.', required: true, index: true })
  public value!: number

  @field(T.Ref(() => Spell), {
    description: 'The spell providing the AC bonus. Resolved via resolver.'
  })
  public spell!: APIReference

  @field(T.String, {
    description: 'Optional description for this AC component.',
    index: true,
    gql: { nullable: true }
  })
  public desc?: string
}

@ObjectType({ description: 'Monster Armor Class component: Condition effect' })
export class ArmorClassCondition {
  @field(T.String, {
    description: "Type of AC component: 'condition'",
    required: true,
    index: true
  })
  public type!: 'condition'

  @field(T.Int, { description: 'AC value from condition effect.', required: true, index: true })
  public value!: number

  @field(T.Ref(() => Condition), {
    description: 'The condition providing the AC bonus. Resolved via resolver.'
  })
  public condition!: APIReference

  @field(T.String, {
    description: 'Optional description for this AC component.',
    index: true,
    gql: { nullable: true }
  })
  public desc?: string
}

@ObjectType({ description: 'A legendary action a monster can perform' })
export class LegendaryAction {
  @field(T.String, {
    description: 'The name of the legendary action.',
    required: true,
    index: true
  })
  public name!: string

  @field(T.String, {
    description: 'The description of the legendary action.',
    required: true,
    index: true
  })
  public desc!: string

  @field(T.Int, {
    description: 'The attack bonus for the legendary action.',
    index: true,
    gql: { nullable: true }
  })
  public attack_bonus?: number

  @field(T.List(() => Damage), {
    description: 'The damage for the legendary action.',
    gql: { nullable: true }
  })
  public damage?: Damage[]

  @field(T.Model(() => DifficultyClass), {
    description: 'The difficulty class for the legendary action.',
    gql: { nullable: true }
  })
  public dc?: DifficultyClass
}

@ObjectType({ description: "A monster's specific proficiency and its bonus value." })
export class MonsterProficiency {
  @field(T.Ref(() => Proficiency), {
    description: 'The specific proficiency (e.g., Saving Throw: STR, Skill: Athletics).'
  })
  public proficiency!: APIReference

  @field(T.Int, {
    description: 'The proficiency bonus value for this monster.',
    required: true,
    index: true
  })
  public value!: number
}

@ObjectType({ description: 'A reaction a monster can perform' })
export class Reaction {
  @field(T.String, { description: 'The name of the reaction.', required: true, index: true })
  public name!: string

  @field(T.String, { description: 'The description of the reaction.', required: true, index: true })
  public desc!: string

  @field(T.Model(() => DifficultyClass), {
    description: 'The difficulty class for the reaction.',
    gql: { nullable: true }
  })
  public dc?: DifficultyClass
}

@ObjectType({ description: 'Monster senses details' })
export class Sense {
  @field(T.String, { index: true, gql: { nullable: true } })
  public blindsight?: string

  @field(T.String, { index: true, gql: { nullable: true } })
  public darkvision?: string

  @field(T.Int, { required: true, index: true })
  public passive_perception!: number

  @field(T.String, { index: true, gql: { nullable: true } })
  public tremorsense?: string

  @field(T.String, { index: true, gql: { nullable: true } })
  public truesight?: string
}

@ObjectType({ description: 'Usage details for a special ability' })
export class SpecialAbilityUsage {
  @field(T.String, {
    description: 'The type of usage for the special ability.',
    required: true,
    index: true
  })
  public type!: string

  @field(T.Int, {
    description: 'The number of times the special ability can be used.',
    index: true,
    gql: { nullable: true }
  })
  public times?: number

  @field(T.List(T.String), {
    description: 'The types of rest the special ability can be used on.',
    gql: { nullable: true }
  })
  public rest_types?: string[]
}

@ObjectType({ description: "A spell within a monster's special ability spellcasting" })
export class SpecialAbilitySpell {
  @field(T.String, { required: true, index: true, gql: false })
  public name!: string

  @field(T.Int, { description: 'The level of the spell.', required: true, index: true })
  public level!: number

  @field(T.String, { required: true, index: true, gql: false })
  public url!: string

  @field(T.String, {
    description: 'The notes for the spell.',
    index: true,
    gql: { nullable: true }
  })
  public notes?: string

  @field(T.Model(() => SpecialAbilityUsage), {
    description: 'The usage for the spell.',
    gql: { nullable: true }
  })
  public usage?: SpecialAbilityUsage
}

@ObjectType({ description: 'Spellcasting details for a monster special ability' })
@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class SpecialAbilitySpellcasting {
  @field(T.Int, {
    description: 'The level of the spellcasting.',
    index: true,
    gql: { nullable: true }
  })
  public level?: number

  @field(T.Ref(() => AbilityScore), { description: 'The ability for the spellcasting.' })
  public ability!: APIReference

  @field(T.Int, {
    description: 'The difficulty class for the spellcasting.',
    index: true,
    gql: { nullable: true }
  })
  public dc?: number

  @field(T.Int, {
    description: 'The modifier for the spellcasting.',
    index: true,
    gql: { nullable: true }
  })
  public modifier?: number

  @field(T.List(T.String), { description: 'The components required for the spellcasting.' })
  public components_required!: string[]

  @field(T.String, {
    description: 'The school of the spellcasting.',
    index: true,
    gql: { nullable: true }
  })
  public school?: string

  // Handled by MonsterSpellcastingResolver
  @field(T.Model(() => Object), { gql: false, db: { default: undefined } })
  public slots?: Record<string, number>

  @field(T.List(() => SpecialAbilitySpell), { description: 'The spells for the spellcasting.' })
  public spells!: SpecialAbilitySpell[]
}

@ObjectType({ description: 'A special ability of the monster' })
export class SpecialAbility {
  @field(T.String, { description: 'The name of the special ability.', required: true, index: true })
  public name!: string

  @field(T.String, {
    description: 'The description of the special ability.',
    required: true,
    index: true
  })
  public desc!: string

  @field(T.Int, {
    description: 'The attack bonus for the special ability.',
    index: true,
    gql: { nullable: true }
  })
  public attack_bonus?: number

  @field(T.List(() => Damage), {
    description: 'The damage for the special ability.',
    gql: { nullable: true }
  })
  public damage?: Damage[]

  @field(T.Model(() => DifficultyClass), {
    description: 'The difficulty class for the special ability.',
    gql: { nullable: true }
  })
  public dc?: DifficultyClass

  @field(T.Model(() => SpecialAbilitySpellcasting), {
    description: 'The spellcasting for the special ability.',
    gql: { nullable: true }
  })
  public spellcasting?: SpecialAbilitySpellcasting

  @field(T.Model(() => SpecialAbilityUsage), {
    description: 'The usage for the special ability.',
    gql: { nullable: true }
  })
  public usage?: SpecialAbilityUsage
}

@ObjectType({ description: 'Monster movement speeds' })
export class MonsterSpeed {
  @field(T.String, { index: true, gql: { nullable: true } })
  public burrow?: string

  @field(T.String, { index: true, gql: { nullable: true } })
  public climb?: string

  @field(T.String, { index: true, gql: { nullable: true } })
  public fly?: string

  @field(T.Bool, { index: true, gql: { nullable: true } })
  public hover?: boolean

  @field(T.String, { index: true, gql: { nullable: true } })
  public swim?: string

  @field(T.String, { index: true, gql: { nullable: true } })
  public walk?: string
}

@ObjectType({ description: 'A D&D monster.' })
@srdModelOptions('2014-monsters')
export class Monster {
  @field(T.List(() => MonsterAction), {
    description: 'The actions for the monster.',
    gql: { nullable: true }
  })
  public actions?: MonsterAction[]

  @field(T.String, { required: true, index: true })
  public alignment!: string

  // Handled by MonsterArmorClassResolver
  @field(
    T.Model(
      () =>
        Array<
          | ArmorClassDex
          | ArmorClassNatural
          | ArmorClassArmor
          | ArmorClassSpell
          | ArmorClassCondition
        >
    ),
    { required: true, gql: false }
  )
  public armor_class!: Array<
    ArmorClassDex | ArmorClassNatural | ArmorClassArmor | ArmorClassSpell | ArmorClassCondition
  >

  @field(T.Float, { required: true, index: true })
  public challenge_rating!: number

  @field(T.Int, { required: true, index: true })
  public charisma!: number

  @field(T.RefList(() => Condition), {
    description: 'Conditions the monster is immune to.',
    gql: { nullable: true }
  })
  public condition_immunities!: APIReference[]

  @field(T.Int, { required: true, index: true })
  public constitution!: number

  @field(T.List(T.String))
  public damage_immunities!: string[]

  @field(T.List(T.String))
  public damage_resistances!: string[]

  @field(T.List(T.String))
  public damage_vulnerabilities!: string[]

  @field(T.String)
  public desc?: string

  @field(T.Int, { required: true, index: true })
  public dexterity!: number

  @field(T.RefList(() => Monster), {
    description: 'Other forms the monster can assume.',
    gql: { nullable: true }
  })
  public forms?: APIReference[]

  @field(T.String, { required: true, index: true })
  public hit_dice!: string

  @field(T.Int, { required: true, index: true })
  public hit_points!: number

  @field(T.String, { required: true, index: true })
  public hit_points_roll!: string

  @field(T.String, { index: true, gql: { nullable: true } })
  public image?: string

  @field(T.String, { required: true, index: true })
  public index!: string

  @field(T.Int, { required: true, index: true })
  public intelligence!: number

  @field(T.String, { required: true, index: true })
  public languages!: string

  @field(T.List(() => LegendaryAction), {
    description: 'The legendary actions for the monster.',
    gql: { nullable: true }
  })
  public legendary_actions?: LegendaryAction[]

  @field(T.String, { required: true, index: true })
  public name!: string

  @field(T.List(() => MonsterProficiency), {
    description: 'The proficiencies for the monster.',
    gql: { nullable: true }
  })
  public proficiencies!: MonsterProficiency[]

  @field(T.List(() => Reaction), {
    description: 'The reactions for the monster.',
    gql: { nullable: true }
  })
  public reactions?: Reaction[]

  @field(T.Model(() => Sense))
  public senses!: Sense

  @field(T.String, { required: true, index: true })
  public size!: string

  @field(T.List(() => SpecialAbility), {
    description: 'The special abilities for the monster.',
    gql: { nullable: true }
  })
  public special_abilities?: SpecialAbility[]

  @field(T.Model(() => MonsterSpeed))
  public speed!: MonsterSpeed

  @field(T.Int, { required: true, index: true })
  public strength!: number

  @field(T.String, { index: true, gql: { nullable: true } })
  public subtype?: string

  @field(T.String, { required: true, index: true })
  public type!: string

  @field(T.String, { required: true, index: true, gql: false })
  public url!: string

  @field(T.Int, { required: true, index: true })
  public wisdom!: number

  @field(T.Int, { required: true, index: true })
  public xp!: number

  @field(T.String, { required: true, index: true })
  public updated_at!: string
}

export type MonsterDocument = DocumentType<Monster>
const MonsterModel = getModelForClass(Monster)

export default MonsterModel
