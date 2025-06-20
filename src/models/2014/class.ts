import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { Choice } from '@/models/common/choice'
import { field, T } from '@/util/fieldDectorator'
import { srdModelOptions } from '@/util/modelOptions'

import { AbilityScore } from './abilityScore'
import { Equipment } from './equipment'
import { Level } from './level'
import { Proficiency } from './proficiency'
import { Spell } from './spell'
import { Subclass } from './subclass'

@ObjectType({ description: 'Starting equipment item for a class' })
export class ClassEquipment {
  // Handled by ClassEquipmentResolver
  @field(() => T.Ref(Equipment), { skipResolver: true })
  public equipment!: APIReference

  @field(() => T.Int, { description: 'Quantity of the equipment item.' })
  public quantity!: number
}

@ObjectType({ description: "Information about a class's spellcasting ability" })
export class SpellcastingInfo {
  @field(() => T.List(T.String), { description: 'Description of the spellcasting ability.' })
  public desc!: string[]

  @field(() => T.String, { description: 'Name of the spellcasting ability.' })
  public name!: string
}

@ObjectType({ description: 'Spellcasting details for a class' })
export class Spellcasting {
  @field(() => T.List(SpellcastingInfo), { description: 'Spellcasting details for the class.' })
  public info!: SpellcastingInfo[]

  @field(() => T.Int, { description: 'Level of the spellcasting ability.' })
  public level!: number

  @field(() => T.Ref(AbilityScore), { description: 'Ability score used for spellcasting.' })
  public spellcasting_ability!: APIReference
}

@ObjectType({ description: 'Prerequisite for multi-classing' })
export class MultiClassingPrereq {
  @field(() => T.Ref(AbilityScore), { description: 'The ability score required.' })
  public ability_score!: APIReference

  @field(() => T.Int, { description: 'The minimum score required.' })
  public minimum_score!: number
}

@ObjectType({ description: 'Multi-classing requirements and features for a class' })
export class MultiClassing {
  @field(() => T.List(MultiClassingPrereq), {
    description: 'Ability score prerequisites for multi-classing.',
    optional: true
  })
  public prerequisites?: MultiClassingPrereq[]

  // Handled by MultiClassingResolver
  @field(() => T.Model(Choice), { optional: true, skipResolver: true })
  public prerequisite_options?: Choice

  @field(() => T.List(T.Ref(Proficiency)), {
    description: 'Proficiencies gained when multi-classing into this class.',
    optional: true
  })
  public proficiencies?: APIReference[]

  // Handled by MultiClassingResolver
  @field(() => T.List(Choice), { optional: true, skipResolver: true })
  public proficiency_choices?: Choice[]
}

@ObjectType({ description: 'Represents a character class (e.g., Barbarian, Wizard)' })
@srdModelOptions('2014-classes')
export class Class {
  @field(() => T.Link([[Level]]), {
    description: 'All levels for this class, detailing features and abilities gained.'
  })
  public class_levels!: string

  @field(() => T.Model(MultiClassing), {
    description: 'Multi-classing requirements and features for this class.'
  })
  public multi_classing!: MultiClassing

  @field(() => T.Int, { description: 'Hit die size for the class (e.g., 6, 8, 10, 12)' })
  public hit_die!: number

  @field(() => T.String, { description: 'Unique identifier for the class' })
  public index!: string

  @field(() => T.String, { description: 'Name of the class' })
  public name!: string

  @field(() => T.List(T.Ref(Proficiency)), {
    description: 'Base proficiencies granted by this class.'
  })
  public proficiencies!: APIReference[]

  // Handled by ClassResolver
  @field(() => T.List(Choice), { skipResolver: true })
  public proficiency_choices!: Choice[]

  @field(() => T.List(T.Ref(AbilityScore)), {
    description: 'Saving throw proficiencies granted by this class.'
  })
  public saving_throws!: APIReference[]

  @field(() => T.Model(Spellcasting), {
    description: 'Spellcasting details for the class.',
    optional: true
  })
  public spellcasting?: Spellcasting

  @field(() => T.Link([Spell]), { description: 'Spells available to this class.' })
  public spells!: string

  @field(() => T.List(ClassEquipment), { description: 'Starting equipment for the class.' })
  public starting_equipment!: ClassEquipment[]

  // Handled by ClassResolver
  @field(() => T.List(Choice), { skipResolver: true })
  public starting_equipment_options!: Choice[]

  @field(() => T.List(T.Ref(Subclass)), {
    description: 'Available subclasses for this class.'
  })
  public subclasses!: APIReference[]

  @field(() => T.String, {
    description: 'The canonical path of this resource in the REST API.'
  })
  public url!: string

  @field(() => T.String, { description: 'Timestamp of the last update' })
  public updated_at!: string
}

export type ClassDocument = DocumentType<Class>
const ClassModel = getModelForClass(Class)
export default ClassModel
