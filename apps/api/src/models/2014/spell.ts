import { getModelForClass, modelOptions, Severity } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { AreaOfEffect } from '@/models/common/areaOfEffect'
import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

import { AbilityScore } from './abilityScore'
import { Class } from './class'
import { DamageType } from './damageType'
import { MagicSchool } from './magicSchool'
import { Subclass } from './subclass'

@ObjectType({ description: 'Details about spell damage' })
@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class SpellDamage {
  @field(T.Ref(() => DamageType), { description: 'Type of damage dealt.', gql: { nullable: true } })
  public damage_type?: APIReference

  // Handled by SpellDamageResolver
  @field(T.Model(() => Object), { gql: false, db: { mapProp: true, default: undefined } })
  public damage_at_slot_level?: Record<number, string>

  // Handled by SpellDamageResolver
  @field(T.Model(() => Object), { gql: false, db: { mapProp: true, default: undefined } })
  public damage_at_character_level?: Record<number, string>
}

@ObjectType({ description: "Details about a spell's saving throw" })
export class SpellDC {
  @field(T.Ref(() => AbilityScore), {
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

@ObjectType({ description: 'Represents a spell in D&D' })
@srdModelOptions('2014-spells')
export class Spell {
  @field(T.Model(() => AreaOfEffect), {
    description: 'Area of effect details, if applicable.',
    gql: { nullable: true }
  })
  public area_of_effect?: AreaOfEffect

  @field(T.String, {
    description: 'Type of attack associated with the spell (e.g., Melee, Ranged)',
    index: true,
    gql: { nullable: true }
  })
  public attack_type?: string

  @field(T.String, { description: 'Time required to cast the spell', required: true, index: true })
  public casting_time!: string

  @field(T.RefList(() => Class), {
    description: 'Classes that can cast this spell.',
    required: true,
    gql: { nullable: true }
  })
  public classes!: APIReference[]

  @field(T.List(T.String), {
    description: 'Components required for the spell (V, S, M)',
    required: true
  })
  public components!: string[]

  @field(T.Bool, { description: 'Indicates if the spell requires concentration', index: true })
  public concentration!: boolean

  @field(T.List(() => SpellDamage), {
    description: 'Damage details, if applicable.',
    gql: { nullable: true }
  })
  public damage?: SpellDamage[]

  @field(T.Model(() => SpellDC), {
    description: 'Saving throw details, if applicable.',
    gql: { nullable: true }
  })
  public dc?: SpellDC

  @field(T.List(T.String), {
    description: "Description of the spell's effects",
    required: true,
    index: true
  })
  public desc!: string[]

  @field(T.String, { description: 'Duration of the spell', required: true, index: true })
  public duration!: string

  // Handled by SpellResolver
  @field(T.Model(() => Object), { gql: false })
  public heal_at_slot_level?: Record<number, string>

  @field(T.List(T.String), {
    description: 'Description of effects when cast at higher levels',
    gql: { nullable: true }
  })
  public higher_level?: string[]

  @field(T.String, { description: 'Unique identifier for this spell', required: true, index: true })
  public index!: string

  @field(T.Int, { description: 'Level of the spell (0 for cantrips)', required: true, index: true })
  public level!: number

  @field(T.String, {
    description: 'Material components required, if any',
    index: true,
    gql: { nullable: true }
  })
  public material?: string

  @field(T.String, { description: 'Name of the spell', required: true, index: true })
  public name!: string

  @field(T.String, { description: 'Range of the spell', required: true, index: true })
  public range!: string

  @field(T.Bool, {
    description: 'Indicates if the spell can be cast as a ritual',
    required: true,
    index: true
  })
  public ritual!: boolean

  @field(T.Ref(() => MagicSchool), {
    description: 'The school of magic this spell belongs to.',
    required: true,
    gql: { nullable: true }
  })
  public school!: APIReference

  @field(T.RefList(() => Subclass), {
    description: 'Subclasses that can cast this spell.',
    required: true,
    gql: { nullable: true }
  })
  public subclasses?: APIReference[]

  @field(T.String, { required: true, index: true, gql: false })
  public url!: string

  @field(T.String, { description: 'Timestamp of the last update', required: true, index: true })
  public updated_at!: string
}

export type SpellDocument = DocumentType<Spell>
const SpellModel = getModelForClass(Spell)

export default SpellModel
