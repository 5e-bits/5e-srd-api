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
  @field({ type: T.Ref(Equipment), skipResolver: true })
  public equipment!: APIReference

  @field({ description: 'Quantity of the equipment item.', type: T.Int })
  public quantity!: number
}

@ObjectType({ description: "Information about a class's spellcasting ability" })
export class SpellcastingInfo {
  @field({ description: 'Description of the spellcasting ability.', type: T.List(T.String) })
  public desc!: string[]

  @field({ description: 'Name of the spellcasting ability.', type: T.String })
  public name!: string
}

@ObjectType({ description: 'Spellcasting details for a class' })
export class Spellcasting {
  @field({ description: 'Spellcasting details for the class.', type: T.List(SpellcastingInfo) })
  public info!: SpellcastingInfo[]

  @field({ description: 'Level of the spellcasting ability.', type: T.Int })
  public level!: number

  @field({ description: 'Ability score used for spellcasting.', type: T.Ref(AbilityScore) })
  public spellcasting_ability!: APIReference
}

@ObjectType({ description: 'Prerequisite for multi-classing' })
export class MultiClassingPrereq {
  @field({ description: 'The ability score required.', type: T.Ref(AbilityScore) })
  public ability_score!: APIReference

  @field({ description: 'The minimum score required.', type: T.Int })
  public minimum_score!: number
}

@ObjectType({ description: 'Multi-classing requirements and features for a class' })
export class MultiClassing {
  @field({
    description: 'Ability score prerequisites for multi-classing.',
    type: T.List(MultiClassingPrereq),
    optional: true
  })
  public prerequisites?: MultiClassingPrereq[]

  // Handled by MultiClassingResolver
  @field({ type: T.Model(Choice), optional: true, skipResolver: true })
  public prerequisite_options?: Choice

  @field({
    description: 'Proficiencies gained when multi-classing into this class.',
    type: T.List(T.Ref(Proficiency)),
    optional: true
  })
  public proficiencies?: APIReference[]

  // Handled by MultiClassingResolver
  @field({ type: T.List(Choice), optional: true, skipResolver: true })
  public proficiency_choices?: Choice[]
}

@ObjectType({ description: 'Represents a character class (e.g., Barbarian, Wizard)' })
@srdModelOptions('2014-classes')
export class Class {
  @field({
    description: 'All levels for this class, detailing features and abilities gained.',
    type: T.Link([[Level]])
  })
  public class_levels!: string

  @field({
    description: 'Multi-classing requirements and features for this class.',
    type: T.Model(MultiClassing)
  })
  public multi_classing!: MultiClassing

  @field({ description: 'Hit die size for the class (e.g., 6, 8, 10, 12)', type: T.Int })
  public hit_die!: number

  @field({ description: 'Unique identifier for the class', type: T.String })
  public index!: string

  @field({ description: 'Name of the class', type: T.String })
  public name!: string

  @field({
    description: 'Base proficiencies granted by this class.',
    type: T.List(T.Ref(Proficiency))
  })
  public proficiencies!: APIReference[]

  // Handled by ClassResolver
  @field({ type: T.List(Choice), skipResolver: true })
  public proficiency_choices!: Choice[]

  @field({
    description: 'Saving throw proficiencies granted by this class.',
    type: T.List(T.Ref(AbilityScore))
  })
  public saving_throws!: APIReference[]

  @field({
    description: 'Spellcasting details for the class.',
    type: T.Model(Spellcasting),
    optional: true
  })
  public spellcasting?: Spellcasting

  @field({ description: 'Spells available to this class.', type: T.Link([Spell]) })
  public spells!: string

  @field({ description: 'Starting equipment for the class.', type: T.List(ClassEquipment) })
  public starting_equipment!: ClassEquipment[]

  // Handled by ClassResolver
  @field({ type: T.List(Choice), skipResolver: true })
  public starting_equipment_options!: Choice[]

  @field({ description: 'Available subclasses for this class.', type: T.List(T.Ref(Subclass)) })
  public subclasses!: APIReference[]

  @field({
    description: 'The canonical path of this resource in the REST API.',
    type: T.String
  })
  public url!: string

  @field({ description: 'Timestamp of the last update', type: T.String })
  public updated_at!: string
}

export type ClassDocument = DocumentType<Class>
const ClassModel = getModelForClass(Class)
export default ClassModel
