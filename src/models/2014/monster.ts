import { getModelForClass, modelOptions, Severity } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { Choice } from '@/models/common/choice'
import { Damage } from '@/models/common/damage'
import { DifficultyClass } from '@/models/common/difficultyClass'
import { field, T } from '@/util/fieldDectorator'
import { srdModelOptions } from '@/util/modelOptions'

import { AbilityScore } from './abilityScore'
import { Condition } from './condition'
import { Equipment } from './equipment'
import { Proficiency } from './proficiency'
import { Spell } from './spell'

// Export all nested classes/types
@ObjectType({ description: 'Option within a monster action' })
export class ActionOption {
  @field(() => T.String, { description: 'The name of the action.' })
  public action_name!: string

  @field(() => T.String, { description: 'Number of times the action can be used.' })
  public count!: number | string

  @field(() => T.String, { description: 'The type of action.' })
  public type!: 'melee' | 'ranged' | 'ability' | 'magic'
}

@ObjectType({ description: 'Usage details for a monster action or ability' })
export class ActionUsage {
  @field(() => T.String, { description: 'The type of action usage.' })
  public type!: string

  @field(() => T.String, { description: 'The dice roll for the action usage.', optional: true })
  public dice?: string

  @field(() => T.String, { description: 'The minimum value for the action usage.', optional: true })
  public min_value?: number
}

@ObjectType({ description: 'An action a monster can perform' })
export class MonsterAction {
  @field(() => T.String, { description: 'The name of the action.' })
  public name!: string

  @field(() => T.String, { description: 'The description of the action.' })
  public desc!: string

  @field(() => T.Int, { description: 'The attack bonus for the action.', optional: true })
  public attack_bonus?: number

  // Handled by MonsterActionResolver
  @field(() => T.List(Object), { skipResolver: true })
  public damage?: (Damage | Choice)[]

  @field(() => T.Model(DifficultyClass), {
    description: 'The difficulty class for the action.',
    optional: true
  })
  public dc?: DifficultyClass

  // Handled by MonsterActionResolver
  @field(() => T.Model(Choice), { optional: true, skipResolver: true })
  public options?: Choice

  @field(() => T.Model(ActionUsage), { description: 'The usage for the action.', optional: true })
  public usage?: ActionUsage

  @field(() => T.String, { description: 'The type of multiattack for the action.', optional: true })
  public multiattack_type?: 'actions' | 'action_options'

  @field(() => T.List(ActionOption), { description: 'The actions for the action.', optional: true })
  public actions?: ActionOption[]

  // Handled by MonsterActionResolver
  @field(() => T.Model(Choice), { skipResolver: true })
  public action_options?: Choice
}

type ArmorClass =
  | ArmorClassDex
  | ArmorClassNatural
  | ArmorClassArmor
  | ArmorClassSpell
  | ArmorClassCondition

@ObjectType({ description: 'Monster Armor Class component: Dexterity based' })
export class ArmorClassDex {
  @field(() => T.String, { description: "Type of AC component: 'dex'" })
  public type!: 'dex'

  @field(() => T.Int, { description: 'AC value from dexterity.' })
  public value!: number

  @field(() => T.String, {
    description: 'Optional description for this AC component.',
    optional: true
  })
  public desc?: string
}

@ObjectType({ description: 'Monster Armor Class component: Natural armor' })
export class ArmorClassNatural {
  @field(() => T.String, { description: "Type of AC component: 'natural'" })
  public type!: 'natural'

  @field(() => T.Int, { description: 'AC value from natural armor.' })
  public value!: number

  @field(() => T.String, {
    description: 'Optional description for this AC component.',
    optional: true
  })
  public desc?: string
}

@ObjectType({ description: 'Monster Armor Class component: Armor worn' })
export class ArmorClassArmor {
  @field(() => T.String, { description: "Type of AC component: 'armor'" })
  public type!: 'armor'

  @field(() => T.Int, { description: 'AC value from worn armor.' })
  public value!: number

  // Handled by MonsterArmorClassResolver
  @field(() => T.Ref(Equipment), { skipResolver: true })
  public armor?: APIReference[]

  @field(() => T.String, {
    description: 'Optional description for this AC component.',
    optional: true
  })
  public desc?: string
}

@ObjectType({ description: 'Monster Armor Class component: Spell effect' })
export class ArmorClassSpell {
  @field(() => T.String, { description: "Type of AC component: 'spell'" })
  public type!: 'spell'

  @field(() => T.Int, { description: 'AC value from spell effect.' })
  public value!: number

  @field(() => T.Ref(Spell), {
    description: 'The spell providing the AC bonus. Resolved via resolver.'
  })
  public spell!: APIReference

  @field(() => T.String, {
    description: 'Optional description for this AC component.',
    optional: true
  })
  public desc?: string
}

@ObjectType({ description: 'Monster Armor Class component: Condition effect' })
export class ArmorClassCondition {
  @field(() => T.String, { description: "Type of AC component: 'condition'" })
  public type!: 'condition'

  @field(() => T.Int, { description: 'AC value from condition effect.' })
  public value!: number

  @field(() => T.Ref(Condition), {
    description: 'The condition providing the AC bonus. Resolved via resolver.'
  })
  public condition!: APIReference

  @field(() => T.String, {
    description: 'Optional description for this AC component.',
    optional: true
  })
  public desc?: string
}

@ObjectType({ description: 'A legendary action a monster can perform' })
export class LegendaryAction {
  @field(() => T.String, { description: 'The name of the legendary action.' })
  public name!: string

  @field(() => T.String, { description: 'The description of the legendary action.' })
  public desc!: string

  @field(() => T.Int, { description: 'The attack bonus for the legendary action.', optional: true })
  public attack_bonus?: number

  @field(() => T.List(Damage), {
    description: 'The damage for the legendary action.',
    optional: true
  })
  public damage?: Damage[]

  @field(() => T.Model(DifficultyClass), {
    description: 'The difficulty class for the legendary action.',
    optional: true
  })
  public dc?: DifficultyClass
}

@ObjectType({ description: "A monster's specific proficiency and its bonus value." })
export class MonsterProficiency {
  @field(() => T.Ref(Proficiency), {
    description: 'The specific proficiency (e.g., Saving Throw: STR, Skill: Athletics).'
  })
  public proficiency!: APIReference

  @field(() => T.Int, { description: 'The proficiency bonus value for this monster.' })
  public value!: number
}

@ObjectType({ description: 'A reaction a monster can perform' })
export class Reaction {
  @field(() => T.String, { description: 'The name of the reaction.' })
  public name!: string

  @field(() => T.String, { description: 'The description of the reaction.' })
  public desc!: string

  @field(() => T.Model(DifficultyClass), {
    description: 'The difficulty class for the reaction.',
    optional: true
  })
  public dc?: DifficultyClass
}

@ObjectType({ description: 'Monster senses details' })
export class Sense {
  @field(() => T.String, {
    description: "The creature's blindsight range, e.g. '30 ft.'.",
    optional: true
  })
  public blindsight?: string

  @field(() => T.String, {
    description: "The creature's darkvision range, e.g. '120 ft.'.",
    optional: true
  })
  public darkvision?: string

  @field(() => T.Int, { description: "The creature's passive Wisdom (Perception) score." })
  public passive_perception!: number

  @field(() => T.String, {
    description: "The creature's tremorsense range, e.g. '60 ft.'.",
    optional: true
  })
  public tremorsense?: string

  @field(() => T.String, {
    description: "The creature's truesight range, e.g. '120 ft.'.",
    optional: true
  })
  public truesight?: string
}

@ObjectType({ description: 'Usage details for a special ability' })
export class SpecialAbilityUsage {
  @field(() => T.String, { description: 'The type of usage for the special ability.' })
  public type!: string

  @field(() => T.Int, {
    description: 'The number of times the special ability can be used.',
    optional: true
  })
  public times?: number

  @field(() => T.List(String), {
    description: 'The types of rest the special ability can be used on.',
    optional: true
  })
  public rest_types?: string[]
}

@ObjectType({ description: "A spell within a monster's special ability spellcasting" })
export class SpecialAbilitySpell {
  @field(() => T.String, { description: 'The name of the spell.' })
  public name!: string

  @field(() => T.Int, { description: 'The level of the spell.' })
  public level!: number

  @field(() => T.String, {
    description: 'The canonical path of the spell resource in the REST API.'
  })
  public url!: string

  @field(() => T.String, { description: 'The notes for the spell.', optional: true })
  public notes?: string

  @field(() => T.Model(SpecialAbilityUsage), {
    description: 'The usage for the spell.',
    optional: true
  })
  public usage?: SpecialAbilityUsage
}

@ObjectType({ description: 'Spellcasting details for a monster special ability' })
@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class SpecialAbilitySpellcasting {
  @field(() => T.Int, { description: 'The level of the spellcasting.', optional: true })
  public level?: number

  @field(() => T.Ref(AbilityScore), { description: 'The ability for the spellcasting.' })
  public ability!: APIReference

  @field(() => T.Int, { description: 'The difficulty class for the spellcasting.', optional: true })
  public dc?: number

  @field(() => T.Int, { description: 'The modifier for the spellcasting.', optional: true })
  public modifier?: number

  @field(() => T.List(String), { description: 'The components required for the spellcasting.' })
  public components_required!: string[]

  @field(() => T.String, { description: 'The school of the spellcasting.', optional: true })
  public school?: string

  // Handled by MonsterSpellcastingResolver
  @field(() => T.Model(Object), { skipResolver: true })
  public slots?: Record<string, number>

  @field(() => T.List(SpecialAbilitySpell), { description: 'The spells for the spellcasting.' })
  public spells!: SpecialAbilitySpell[]
}

@ObjectType({ description: 'A special ability of the monster' })
export class SpecialAbility {
  @field(() => T.String, { description: 'The name of the special ability.' })
  public name!: string

  @field(() => T.String, { description: 'The description of the special ability.' })
  public desc!: string

  @field(() => T.Int, { description: 'The attack bonus for the special ability.', optional: true })
  public attack_bonus?: number

  @field(() => T.List(Damage), {
    description: 'The damage for the special ability.',
    optional: true
  })
  public damage?: Damage[]

  @field(() => T.Model(DifficultyClass), {
    description: 'The difficulty class for the special ability.',
    optional: true
  })
  public dc?: DifficultyClass

  @field(() => T.Model(SpecialAbilitySpellcasting), {
    description: 'The spellcasting for the special ability.',
    optional: true
  })
  public spellcasting?: SpecialAbilitySpellcasting

  @field(() => T.Model(SpecialAbilityUsage), {
    description: 'The usage for the special ability.',
    optional: true
  })
  public usage?: SpecialAbilityUsage
}

@ObjectType({ description: 'Monster movement speeds' })
export class MonsterSpeed {
  @field(() => T.String, { description: "The creature's burrowing speed.", optional: true })
  public burrow?: string

  @field(() => T.String, { description: "The creature's climbing speed.", optional: true })
  public climb?: string

  @field(() => T.String, { description: "The creature's flying speed.", optional: true })
  public fly?: string

  @field(() => T.String, { description: 'Whether the creature can hover or not.', optional: true })
  public hover?: boolean

  @field(() => T.String, { description: "The creature's swimming speed.", optional: true })
  public swim?: string

  @field(() => T.String, { description: "The creature's walking speed.", optional: true })
  public walk?: string
}

@ObjectType({ description: 'A D&D monster.' })
@srdModelOptions('2014-monsters')
export class Monster {
  @field(() => T.List(MonsterAction), {
    description: 'The actions for the monster.',
    optional: true
  })
  public actions?: MonsterAction[]

  @field(() => T.String, { description: "The monster's alignment." })
  public alignment!: string

  // Handled by MonsterArmorClassResolver
  @field(() => T.List(Object), { skipResolver: true })
  public armor_class!: ArmorClass[]

  @field(() => T.Float, { description: "The monster's alignment." })
  public challenge_rating!: number

  @field(() => T.Int, { description: "The monster's Charisma score." })
  public charisma!: number

  @field(() => T.RefList(Condition), {
    description: 'Conditions the monster is immune to.',
    optional: true
  })
  public condition_immunities!: APIReference[]

  @field(() => T.Int, { description: "The monster's Constitution score." })
  public constitution!: number

  @field(() => T.List(String), { description: 'Damage types the monster is immune to.' })
  public damage_immunities!: string[]

  @field(() => T.List(String), { description: 'Damage types the monster is resistant to.' })
  public damage_resistances!: string[]

  @field(() => T.List(String), { description: 'Damage types the monster is vulnerable to.' })
  public damage_vulnerabilities!: string[]

  @field(() => T.Int, { description: "The monster's Dexterity score." })
  public dexterity!: number

  @field(() => T.RefList(Monster), {
    description: 'Other forms the monster can assume.',
    optional: true
  })
  public forms?: APIReference[]

  @field(() => T.String, { description: "The number and size of the monster's hit dice." })
  public hit_dice!: string

  @field(() => T.Int, { description: "The monster's average Hit Point maximum." })
  public hit_points!: number

  @field(() => T.String, { description: "Dice to determine the monster's Hit Point maximum." })
  public hit_points_roll!: string

  @field(() => T.String, {
    description:
      "The path of an image depicting the monster, relative to the API's base URL, e.g. '/api/images/monsters/aboleth.png'",
    optional: true
  })
  public image?: string

  @field(() => T.String, {
    description: 'Unique identifer for this monster (e.g. aboleth, young-black-dragon).'
  })
  public index!: string

  @field(() => T.Int, { description: "The monster's Intelligence score." })
  public intelligence!: number

  @field(() => T.String, { description: 'Languages that the monster speaks and/or understands.' })
  public languages!: string

  @field(() => T.List(LegendaryAction), {
    description: 'The legendary actions for the monster.',
    optional: true
  })
  public legendary_actions?: LegendaryAction[]

  @field(() => T.String, { description: "The monster's name." })
  public name!: string

  @field(() => T.List(MonsterProficiency), {
    description: 'The proficiencies for the monster.',
    optional: true
  })
  public proficiencies!: MonsterProficiency[]

  @field(() => T.List(Reaction), { description: 'The reactions for the monster.', optional: true })
  public reactions?: Reaction[]

  @field(() => T.Model(Sense), { description: "The monster's senses." })
  public senses!: Sense

  @field(() => T.String, { description: "The monster's size category." })
  public size!: string

  @field(() => T.List(SpecialAbility), {
    description: 'The special abilities for the monster.',
    optional: true
  })
  public special_abilities?: SpecialAbility[]

  @field(() => T.Model(MonsterSpeed), { description: "The monster's movement information." })
  public speed!: MonsterSpeed

  @field(() => T.Int, { description: "The monster's Strength score." })
  public strength!: number

  @field(() => T.String, {
    description: 'The subtype of the monster (e.g. goblinoid, shapechanger).',
    optional: true
  })
  public subtype?: string

  @field(() => T.String, { description: 'The type of the monster (e.g. beast, monstrosity).' })
  public type!: string

  @field(() => T.String, { description: 'Timestamp of the last update' })
  public updated_at!: string

  @field(() => T.String, { description: 'The canonical path of this resource in the REST API.' })
  public url!: string

  @field(() => T.Int, { description: "The monster's Wisdom score." })
  public wisdom!: number

  @field(() => T.Int, { description: 'The Experience Points rewarded for slaying the monster.' })
  public xp!: number
}

export type MonsterDocument = DocumentType<Monster>
const MonsterModel = getModelForClass(Monster)

export default MonsterModel
