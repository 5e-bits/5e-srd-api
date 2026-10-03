import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { Choice } from '@/models/common/choice'
import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

import { AbilityScore } from './abilityScore'
import { Level } from './level'
import { Proficiency } from './proficiency'
import { Spell } from './spell'
import { Subclass } from './subclass'

@ObjectType({ description: 'Starting equipment item for a class' })
export class ClassEquipment {
  // Handled by ClassEquipmentResolver
  @field(T.Model(() => APIReference), { gql: false })
  public equipment!: APIReference

  @field(T.Int, { description: 'Quantity of the equipment item.', required: true, index: true })
  public quantity!: number
}

@ObjectType({ description: "Information about a class's spellcasting ability" })
export class SpellcastingInfo {
  @field(T.List(T.String), {
    description: 'Description of the spellcasting ability.',
    required: true,
    index: true
  })
  public desc!: string[]

  @field(T.String, {
    description: 'Name of the spellcasting ability.',
    required: true,
    index: true
  })
  public name!: string
}

@ObjectType({ description: 'Spellcasting details for a class' })
export class Spellcasting {
  @field(T.List(() => SpellcastingInfo), { description: 'Spellcasting details for the class.' })
  public info!: SpellcastingInfo[]

  @field(T.Int, { description: 'Level of the spellcasting ability.', required: true, index: true })
  public level!: number

  @field(T.Ref(() => AbilityScore), { description: 'Ability score used for spellcasting.' })
  public spellcasting_ability!: APIReference
}

@ObjectType({ description: 'Prerequisite for multi-classing' })
export class MultiClassingPrereq {
  @field(T.Ref(() => AbilityScore), {
    description: 'The ability score required.',
    gql: { nullable: true }
  })
  public ability_score!: APIReference

  @field(T.Int, { description: 'The minimum score required.', required: true, index: true })
  public minimum_score!: number
}

@ObjectType({ description: 'Multi-classing requirements and features for a class' })
export class MultiClassing {
  @field(T.List(() => MultiClassingPrereq), {
    description: 'Ability score prerequisites for multi-classing.',
    gql: { nullable: true },
    db: { default: undefined }
  })
  public prerequisites?: MultiClassingPrereq[]

  // Handled by MultiClassingResolver
  @field(T.Model(() => Choice), { gql: false, db: { default: undefined } })
  public prerequisite_options?: Choice

  @field(T.RefList(() => Proficiency), {
    description: 'Proficiencies gained when multi-classing into this class.',
    gql: { nullable: true },
    db: { default: undefined }
  })
  public proficiencies?: APIReference[]

  // Handled by MultiClassingResolver
  @field(T.List(() => Choice), { gql: false, db: { default: undefined } })
  public proficiency_choices?: Choice[]
}

@ObjectType({ description: 'Represents a character class (e.g., Barbarian, Wizard)' })
@srdModelOptions('2014-classes')
export class Class {
  @field(
    { db: () => String, gql: () => [Level] },
    {
      description: 'All levels for this class, detailing features and abilities gained.',
      required: true,
      index: true
    }
  )
  public class_levels!: string

  @field(T.Model(() => MultiClassing), {
    description: 'Multi-classing requirements and features for this class.',
    gql: { nullable: true }
  })
  public multi_classing!: MultiClassing

  @field(T.Int, {
    description: 'Hit die size for the class (e.g., 6, 8, 10, 12)',
    required: true,
    index: true
  })
  public hit_die!: number

  @field(T.String, { description: 'Unique identifier for the class', required: true, index: true })
  public index!: string

  @field(T.String, { description: 'Name of the class', required: true, index: true })
  public name!: string

  @field(T.RefList(() => Proficiency), {
    description: 'Base proficiencies granted by this class.',
    gql: { nullable: true }
  })
  public proficiencies!: APIReference[]

  // Handled by ClassResolver
  @field(T.List(() => Choice), { gql: false })
  public proficiency_choices!: Choice[]

  @field(T.RefList(() => AbilityScore), {
    description: 'Saving throw proficiencies granted by this class.',
    gql: { nullable: true }
  })
  public saving_throws!: APIReference[]

  @field(T.Model(() => Spellcasting), {
    description: 'Spellcasting details for the class.',
    gql: { nullable: true }
  })
  public spellcasting?: Spellcasting

  @field(
    { db: () => String, gql: () => [Spell] },
    { description: 'Spells available to this class.', required: true, index: true }
  )
  public spells!: string

  @field(T.List(() => ClassEquipment), {
    description: 'Starting equipment for the class.',
    gql: { nullable: true }
  })
  public starting_equipment!: ClassEquipment[]

  // Handled by ClassResolver
  @field(T.List(() => Choice), { gql: false })
  public starting_equipment_options!: Choice[]

  @field(T.RefList(() => Subclass), {
    description: 'Available subclasses for this class.',
    gql: { nullable: true }
  })
  public subclasses!: APIReference[]

  @field(T.String, { required: true, index: true, gql: false })
  public url!: string

  @field(T.String, { description: 'Timestamp of the last update', required: true, index: true })
  public updated_at!: string
}

export type ClassDocument = DocumentType<Class>
const ClassModel = getModelForClass(Class)
export default ClassModel
