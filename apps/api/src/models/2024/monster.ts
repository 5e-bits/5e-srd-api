import { getModelForClass, modelOptions, Severity } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { Choice } from '@/models/common/choice'
import { Damage } from '@/models/common/damage'
import { DifficultyClass } from '@/models/common/difficultyClass'
import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

import { Condition2024 } from './condition'
import { Equipment2024 } from './equipment'
import { Proficiency2024 } from './proficiency'

@ObjectType({ description: 'Monster movement speeds (2024)' })
export class MonsterSpeed2024 {
  @field(T.String, { index: true, gql: { nullable: true } })
  public walk?: string

  @field(T.String, { index: true, gql: { nullable: true } })
  public burrow?: string

  @field(T.String, { index: true, gql: { nullable: true } })
  public climb?: string

  @field(T.String, { index: true, gql: { nullable: true } })
  public fly?: string

  @field(T.String, { index: true, gql: { nullable: true } })
  public swim?: string

  @field(T.Bool, { index: true, gql: { nullable: true } })
  public hover?: boolean
}

@ObjectType({ description: 'Monster senses (2024)' })
export class MonsterSense2024 {
  @field(T.Int, { required: true, index: true })
  public passive_perception!: number

  @field(T.String, { index: true, gql: { nullable: true } })
  public blindsight?: string

  @field(T.String, { index: true, gql: { nullable: true } })
  public darkvision?: string

  @field(T.String, { index: true, gql: { nullable: true } })
  public tremorsense?: string

  @field(T.String, { index: true, gql: { nullable: true } })
  public truesight?: string
}

@ObjectType({ description: 'An armor class component for a 2024 monster' })
export class MonsterArmorClass2024 {
  @field(T.String, { index: true, gql: { nullable: true } })
  public type?: string

  @field(T.Int, { required: true, index: true })
  public value!: number

  // Resolved via MonsterArmorClass2024Resolver
  @field(T.RefList(() => Equipment2024), { gql: { nullable: true } })
  public armor?: APIReference[]

  // Resolved via MonsterArmorClass2024Resolver
  @field(T.Ref(() => Condition2024), { gql: { nullable: true } })
  public condition?: APIReference

  // No 2024 spell model yet — exposed as raw reference
  @field(T.Model(() => APIReference), { gql: { nullable: true } })
  public spell?: APIReference

  @field(T.String, { index: true, gql: { nullable: true } })
  public desc?: string
}

@ObjectType({ description: "A monster's proficiency and its bonus value (2024)" })
export class MonsterProficiency2024 {
  @field(T.Int, { required: true, index: true })
  public value!: number

  // Resolved via MonsterProficiency2024Resolver
  @field(T.Ref(() => Proficiency2024))
  public proficiency!: APIReference
}

/**
 * A GraphQL-only response shape (not itself persisted; condition_immunities is stored flat)
 * built by Monster2024Resolver.condition_immunities, one per stored reference.
 */
@ObjectType({
  description: "A 2024 monster's condition immunity, with an optional qualifying note"
})
export class MonsterConditionImmunity2024 {
  @Field(() => Condition2024)
  public condition!: Condition2024

  @Field(() => String, {
    nullable: true,
    description: 'A qualifier for this immunity, e.g. only in one form.'
  })
  public note?: string
}

@ObjectType({ description: 'Usage details for a spellcasting spell (2024)' })
export class SpellcastingSpellUsage2024 {
  @field(T.String, { required: true, index: true })
  public type!: string

  @field(T.Int, { index: true, gql: { nullable: true } })
  public times?: number
}

@ObjectType({ description: 'A spell within monster spellcasting (2024)' })
export class SpellcastingSpell2024 {
  @field(T.String, { required: true, index: true })
  public index!: string

  @field(T.String, { required: true, index: true })
  public name!: string

  @field(T.Int, { required: true, index: true })
  public level!: number

  @field(T.String, { required: true, index: true, gql: false })
  public url!: string

  @field(T.Model(() => SpellcastingSpellUsage2024), { gql: { nullable: true } })
  public usage?: SpellcastingSpellUsage2024

  @field(T.String, { index: true, gql: { nullable: true } })
  public notes?: string
}

@ObjectType({ description: 'Spellcasting details for a 2024 monster' })
@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class MonsterSpellcasting2024 {
  // Resolved via MonsterSpellcasting2024Resolver
  @field(T.Model(() => APIReference), { gql: false })
  public ability!: APIReference

  @field(T.List(T.String))
  public components_required!: string[]

  @field(T.List(() => SpellcastingSpell2024))
  public spells!: SpellcastingSpell2024[]

  @field(T.Int, { index: true, gql: { nullable: true } })
  public level?: number

  @field(T.Int, { index: true, gql: { nullable: true } })
  public dc?: number

  @field(T.Int, { index: true, gql: { nullable: true } })
  public modifier?: number

  @field(T.String, { index: true, gql: { nullable: true } })
  public school?: string

  // Resolved via MonsterSpellcasting2024Resolver
  @field(T.Model(() => Object), { gql: false, db: { default: undefined } })
  public slots?: Record<string, number>
}

@ObjectType({ description: 'Usage details for a 2024 monster action' })
export class ActionUsage2024 {
  @field(T.String, { required: true, index: true })
  public type!: string

  @field(T.String, { index: true, gql: { nullable: true } })
  public dice?: string

  @field(T.Int, { index: true, gql: { nullable: true } })
  public min_value?: number

  @field(T.Int, { index: true, gql: { nullable: true } })
  public times?: number

  @field(T.List(T.String), { gql: { nullable: true } })
  public rest_types?: string[]
}

@ObjectType({ description: 'An item within a 2024 monster multiattack action' })
export class MonsterActionItem2024 {
  @field(T.String, { required: true, index: true })
  public action_name!: string

  @field(T.String, { required: true, index: true })
  public count!: string

  @field(T.String, { required: true, index: true })
  public type!: string
}

@ObjectType({ description: 'An attack within a 2024 monster action' })
export class MonsterAttack2024 {
  @field(T.String, { required: true, index: true })
  public name!: string

  @field(T.Model(() => DifficultyClass))
  public dc!: DifficultyClass

  @field(T.List(() => Damage), { gql: { nullable: true } })
  public damage?: Damage[]
}

@ObjectType({ description: 'An action a 2024 monster can perform' })
@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class MonsterAction2024 {
  @field(T.String, { required: true, index: true })
  public name!: string

  @field(T.String, { required: true, index: true })
  public desc!: string

  @field(T.Int, { index: true, gql: { nullable: true } })
  public attack_bonus?: number

  @field(T.Model(() => DifficultyClass), { gql: { nullable: true } })
  public dc?: DifficultyClass

  @field(T.Model(() => ActionUsage2024), { gql: { nullable: true } })
  public usage?: ActionUsage2024

  @field(T.String, { index: true, gql: { nullable: true } })
  public multiattack_type?: string

  @field(T.List(() => MonsterActionItem2024), { gql: { nullable: true } })
  public actions?: MonsterActionItem2024[]

  // Handled by MonsterAction2024Resolver
  @field(T.Model(() => Choice), { gql: false })
  public action_options?: Choice

  @field(T.List(() => MonsterAttack2024), { gql: { nullable: true } })
  public attacks?: MonsterAttack2024[]

  // Handled by MonsterAction2024Resolver
  @field(T.Model(() => Choice), { gql: false })
  public options?: Choice

  // Handled by MonsterAction2024Resolver
  @field(T.List(() => Object), { gql: false })
  public damage?: (Damage | Choice)[]

  @field(T.Model(() => MonsterSpellcasting2024), { gql: { nullable: true } })
  public spellcasting?: MonsterSpellcasting2024
}

@ObjectType({ description: 'A legendary action a 2024 monster can perform' })
export class LegendaryAction2024 {
  @field(T.String, { required: true, index: true })
  public name!: string

  @field(T.String, { required: true, index: true })
  public desc!: string

  @field(T.Int, { index: true, gql: { nullable: true } })
  public attack_bonus?: number

  @field(T.List(() => Damage), { gql: { nullable: true } })
  public damage?: Damage[]

  @field(T.Model(() => DifficultyClass), { gql: { nullable: true } })
  public dc?: DifficultyClass

  @field(T.Model(() => ActionUsage2024), { gql: { nullable: true } })
  public usage?: ActionUsage2024

  @field(T.Model(() => MonsterSpellcasting2024), { gql: { nullable: true } })
  public spellcasting?: MonsterSpellcasting2024
}

@ObjectType({ description: 'A reaction a 2024 monster can perform' })
export class Reaction2024 {
  @field(T.String, { required: true, index: true })
  public name!: string

  @field(T.String, { required: true, index: true })
  public desc!: string

  @field(T.Model(() => DifficultyClass), { gql: { nullable: true } })
  public dc?: DifficultyClass

  @field(T.Model(() => ActionUsage2024), { gql: { nullable: true } })
  public usage?: ActionUsage2024

  @field(T.List(() => Damage), { gql: { nullable: true } })
  public damage?: Damage[]

  @field(T.Model(() => MonsterSpellcasting2024), { gql: { nullable: true } })
  public spellcasting?: MonsterSpellcasting2024
}

@ObjectType({ description: 'Usage details for a 2024 monster special ability' })
export class SpecialAbilityUsage2024 {
  @field(T.String, { required: true, index: true })
  public type!: string

  @field(T.Int, { index: true, gql: { nullable: true } })
  public times?: number

  @field(T.Int, { index: true, gql: { nullable: true } })
  public times_in_lair?: number

  @field(T.List(T.String), { gql: { nullable: true } })
  public rest_types?: string[]
}

@ObjectType({ description: 'A special ability of a 2024 monster' })
export class SpecialAbility2024 {
  @field(T.String, { required: true, index: true })
  public name!: string

  @field(T.String, { required: true, index: true })
  public desc!: string

  @field(T.Int, { index: true, gql: { nullable: true } })
  public attack_bonus?: number

  @field(T.List(() => Damage), { gql: { nullable: true } })
  public damage?: Damage[]

  @field(T.Model(() => DifficultyClass), { gql: { nullable: true } })
  public dc?: DifficultyClass

  @field(T.Model(() => SpecialAbilityUsage2024), { gql: { nullable: true } })
  public usage?: SpecialAbilityUsage2024

  @field(T.Model(() => MonsterSpellcasting2024), { gql: { nullable: true } })
  public spellcasting?: MonsterSpellcasting2024
}

@ObjectType({ description: 'A D&D 2024 monster.' })
@srdModelOptions('2024-monsters')
export class Monster2024 {
  @field(T.String, { required: true, index: true })
  public index!: string

  @field(T.String, { required: true, index: true })
  public name!: string

  @field(T.String, { required: true, index: true })
  public size!: string

  @field(T.String, { required: true, index: true })
  public type!: string

  @field(T.String, { index: true, gql: { nullable: true } })
  public subtype?: string

  @field(T.String, { required: true, index: true })
  public alignment!: string

  @field(T.List(() => MonsterArmorClass2024), { required: true })
  public armor_class!: MonsterArmorClass2024[]

  @field(T.Int, { required: true, index: true })
  public hit_points!: number

  @field(T.String, { required: true, index: true })
  public hit_dice!: string

  @field(T.String, { required: true, index: true })
  public hit_points_roll!: string

  @field(T.Model(() => MonsterSpeed2024))
  public speed!: MonsterSpeed2024

  @field(T.Int, { required: true, index: true })
  public strength!: number

  @field(T.Int, { required: true, index: true })
  public dexterity!: number

  @field(T.Int, { required: true, index: true })
  public constitution!: number

  @field(T.Int, { required: true, index: true })
  public intelligence!: number

  @field(T.Int, { required: true, index: true })
  public wisdom!: number

  @field(T.Int, { required: true, index: true })
  public charisma!: number

  @field(T.List(() => MonsterProficiency2024))
  public proficiencies!: MonsterProficiency2024[]

  @field(T.List(T.String))
  public damage_vulnerabilities!: string[]

  @field(T.List(T.String))
  public damage_resistances!: string[]

  @field(T.List(T.String))
  public damage_immunities!: string[]

  /**
   * Resolved via Monster2024Resolver. Stored flat (a note, if any, travels with the
   * reference itself) but exposed as MonsterConditionImmunity2024, since the note has
   * nowhere to live on the shared, standalone Condition2024 type.
   */
  @field(T.RefList(() => MonsterConditionImmunity2024))
  public condition_immunities!: APIReference[]

  @field(T.Model(() => MonsterSense2024))
  public senses!: MonsterSense2024

  @field(T.String, { required: true, index: true })
  public languages!: string

  @field(T.Float, { required: true, index: true })
  public challenge_rating!: number

  @field(T.Int, { index: true, gql: { nullable: true } })
  public proficiency_bonus?: number

  @field(T.Int, { required: true, index: true })
  public xp!: number

  @field(T.Int, { index: true, gql: { nullable: true } })
  public xp_in_lair?: number

  @field(T.List(() => SpecialAbility2024), { gql: { nullable: true } })
  public special_abilities?: SpecialAbility2024[]

  @field(T.String, { index: true, gql: { nullable: true } })
  public gear?: string

  @field(T.List(() => MonsterAction2024), { gql: { nullable: true } })
  public actions?: MonsterAction2024[]

  @field(T.List(() => MonsterAction2024), { gql: { nullable: true } })
  public bonus_actions?: MonsterAction2024[]

  @field(T.List(() => LegendaryAction2024), { gql: { nullable: true } })
  public legendary_actions?: LegendaryAction2024[]

  @field(T.List(() => Reaction2024), { gql: { nullable: true } })
  public reactions?: Reaction2024[]

  // Resolved via Monster2024Resolver
  @field(T.RefList(() => Monster2024), { gql: { nullable: true } })
  public forms?: APIReference[]

  @field(T.String, { index: true, gql: { nullable: true } })
  public image?: string

  @field(T.String, { required: true, index: true, gql: false })
  public url!: string

  @field(T.String, { required: true, index: true })
  public updated_at!: string
}

export type Monster2024Document = DocumentType<Monster2024>
const Monster2024Model = getModelForClass(Monster2024)

export default Monster2024Model
