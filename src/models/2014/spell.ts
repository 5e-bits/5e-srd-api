import { getModelForClass, modelOptions, Severity } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { AreaOfEffect } from '@/models/common/areaOfEffect'
import { field, T } from '@/util/fieldDectorator'
import { srdModelOptions } from '@/util/modelOptions'

import { AbilityScore } from './abilityScore'
import { Class } from './class'
import { DamageType } from './damageType'
import { MagicSchool } from './magicSchool'
import { Subclass } from './subclass'

@ObjectType({ description: 'Details about spell damage' })
@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class SpellDamage {
  @field(() => T.Ref(DamageType), { description: 'Type of damage dealt.', optional: true })
  public damage_type?: APIReference

  // Handled by SpellDamageResolver
  @field(() => T.Model(Object), { optional: true, skipResolver: true })
  public damage_at_slot_level?: Record<number, string>

  // Handled by SpellDamageResolver
  @field(() => T.Model(Object), { optional: true, skipResolver: true })
  public damage_at_character_level?: Record<number, string>
}

@ObjectType({ description: "Details about a spell's saving throw" })
export class SpellDC {
  @field(() => T.Ref(AbilityScore), { description: 'The ability score used for the saving throw.' })
  public dc_type!: APIReference

  @field(() => T.String, { description: "The result of a successful save (e.g., 'half', 'none')." })
  public dc_success!: string

  @field(() => T.String, {
    description: 'Additional description for the saving throw.',
    optional: true
  })
  public desc?: string
}

@ObjectType({ description: 'Represents a spell in D&D' })
@srdModelOptions('2014-spells')
export class Spell {
  @field(() => T.Model(AreaOfEffect), {
    description: 'Area of effect details, if applicable.',
    optional: true
  })
  public area_of_effect?: AreaOfEffect

  @field(() => T.String, {
    description: 'Type of attack associated with the spell (e.g., Melee, Ranged)',
    optional: true
  })
  public attack_type?: string

  @field(() => T.String, { description: 'Time required to cast the spell' })
  public casting_time!: string

  @field(() => T.RefList(Class), { description: 'Classes that can cast this spell.' })
  public classes!: APIReference[]

  @field(() => T.List(String), { description: 'Components required for the spell (V, S, M)' })
  public components!: string[]

  @field(() => T.Bool, { description: 'Indicates if the spell requires concentration' })
  public concentration!: boolean

  @field(() => T.Model(SpellDamage), {
    description: 'Damage details, if applicable.',
    optional: true
  })
  public damage?: SpellDamage

  @field(() => T.Model(SpellDC), {
    description: 'Saving throw details, if applicable.',
    optional: true
  })
  public dc?: SpellDC

  @field(() => T.List(String), { description: "Description of the spell's effects" })
  public desc!: string[]

  @field(() => T.String, { description: 'Duration of the spell' })
  public duration!: string

  // Handled by SpellResolver
  @field(() => T.Model(Object), { optional: true, skipResolver: true })
  public heal_at_slot_level?: Record<number, string>

  @field(() => T.List(String), {
    description: 'Description of effects when cast at higher levels',
    optional: true
  })
  public higher_level?: string[]

  @field(() => T.String, { description: 'Unique identifier for this spell' })
  public index!: string

  @field(() => T.Int, { description: 'Level of the spell (0 for cantrips)' })
  public level!: number

  @field(() => T.String, { description: 'Material components required, if any', optional: true })
  public material?: string

  @field(() => T.String, { description: 'Name of the spell' })
  public name!: string

  @field(() => T.String, { description: 'Range of the spell' })
  public range!: string

  @field(() => T.Bool, { description: 'Indicates if the spell can be cast as a ritual' })
  public ritual!: boolean

  @field(() => T.Ref(MagicSchool), { description: 'The school of magic this spell belongs to.' })
  public school!: APIReference

  @field(() => T.RefList(Subclass), {
    description: 'Subclasses that can cast this spell.',
    optional: true
  })
  public subclasses?: APIReference[]

  @field(() => T.String, { description: 'The canonical path of this resource in the REST API.' })
  public url!: string

  @field(() => T.String, { description: 'Timestamp of the last update.' })
  public updated_at!: string
}

export type SpellDocument = DocumentType<Spell>
const SpellModel = getModelForClass(Spell)

export default SpellModel
