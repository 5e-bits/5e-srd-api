import { getModelForClass, modelOptions, Severity } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { AbilityScore2024 } from '@/models/2024/abilityScore'
import { Class2024 } from '@/models/2024/class'
import { DamageType2024 } from '@/models/2024/damageType'
import { MagicSchool2024 } from '@/models/2024/magicSchool'
import { Subclass2024 } from '@/models/2024/subclass'
import { APIReference } from '@/models/common/apiReference'
import { AreaOfEffect } from '@/models/common/areaOfEffect'
import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({ description: "Details about a 2024 spell's damage." })
@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class SpellDamage2024 {
  @field(T.Ref(() => DamageType2024), {
    description: 'Type of damage dealt.',
    gql: { nullable: true }
  })
  public damage_type?: APIReference

  // Handled by SpellDamage2024Resolver
  @field(T.Model(() => Object), { gql: false, db: { mapProp: true, default: undefined } })
  public damage_at_slot_level?: Record<string, string>

  // Handled by SpellDamage2024Resolver
  @field(T.Model(() => Object), { gql: false, db: { mapProp: true, default: undefined } })
  public damage_at_character_level?: Record<string, string>
}

@ObjectType({ description: "Details about a 2024 spell's saving throw." })
export class SpellDC2024 {
  @field(T.Ref(() => AbilityScore2024), {
    description: 'The ability score used for the saving throw.',
    required: true
  })
  public dc_type!: APIReference

  @field(T.String, {
    description: "The result of a successful save (e.g., 'half', 'none').",
    required: true,
    index: true
  })
  public dc_success!: string

  @field(T.String, {
    description: 'Additional description for the saving throw.',
    index: true,
    gql: { nullable: true }
  })
  public desc?: string
}

@ObjectType({ description: 'Represents a spell in D&D 5e 2024.' })
@srdModelOptions('2024-spells')
export class Spell2024 {
  @field(T.Model(() => AreaOfEffect), {
    description: 'Area of effect details, if applicable.',
    gql: { nullable: true }
  })
  public area_of_effect?: AreaOfEffect

  @field(T.String, {
    description: 'Type of attack associated with the spell (e.g., melee, ranged).',
    index: true,
    gql: { nullable: true }
  })
  public attack_type?: string

  @field(T.String, { description: 'Time required to cast the spell.', required: true, index: true })
  public casting_time!: string

  @field(T.RefList(() => Class2024), {
    description: 'Classes that can cast this spell.',
    required: true,
    gql: { nullable: true }
  })
  public classes!: APIReference[]

  @field(T.List(T.String), {
    description: 'Components required for the spell (V, S, M).',
    required: true
  })
  public components!: string[]

  @field(T.Bool, {
    description: 'Indicates if the spell requires concentration.',
    required: true,
    index: true
  })
  public concentration!: boolean

  @field(T.Model(() => SpellDamage2024), {
    description: 'Damage details, if applicable.',
    gql: { nullable: true }
  })
  public damage?: SpellDamage2024

  @field(T.Model(() => SpellDC2024), {
    description: 'Saving throw details, if applicable.',
    gql: { nullable: true }
  })
  public dc?: SpellDC2024

  @field(T.String, { description: "Description of the spell's effects.", required: true })
  public description!: string

  @field(T.String, { description: 'Duration of the spell.', required: true, index: true })
  public duration!: string

  // Handled by Spell2024Resolver
  @field(T.Model(() => Object), { gql: false })
  public heal_at_slot_level?: Record<string, string>

  @field(T.String, {
    description: 'Description of effects when cast at higher levels.',
    gql: { nullable: true }
  })
  public higher_level?: string

  @field(T.String, {
    description: 'Unique identifier for this spell.',
    required: true,
    index: true
  })
  public index!: string

  @field(T.Int, {
    description: 'Level of the spell (0 for cantrips).',
    required: true,
    index: true
  })
  public level!: number

  @field(T.String, {
    description: 'Material components required, if any.',
    gql: { nullable: true }
  })
  public material?: string

  @field(T.String, { description: 'Name of the spell.', required: true, index: true })
  public name!: string

  @field(T.String, { description: 'Range of the spell.', required: true, index: true })
  public range!: string

  @field(T.Bool, {
    description: 'Indicates if the spell can be cast as a ritual.',
    required: true,
    index: true
  })
  public ritual!: boolean

  @field(T.Ref(() => MagicSchool2024), {
    description: 'The school of magic this spell belongs to.',
    required: true,
    gql: { nullable: true }
  })
  public school!: APIReference

  @field(T.RefList(() => Subclass2024), {
    description: 'Subclasses that can cast this spell.',
    gql: { nullable: true }
  })
  public subclasses?: APIReference[]

  @field(T.String, { required: true, index: true, gql: false })
  public url!: string

  @field(T.String, { description: 'Timestamp of the last update.', required: true, index: true })
  public updated_at!: string
}

export type Spell2024Document = DocumentType<Spell2024>
const Spell2024Model = getModelForClass(Spell2024)

export default Spell2024Model
