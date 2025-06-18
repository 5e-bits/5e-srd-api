import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { Choice } from '@/models/common/choice'
import { srdModelOptions } from '@/util/modelOptions'

import { Equipment } from './equipment'
import { Proficiency } from './proficiency'
import { field, T } from '@/util/fieldDectorator'

@ObjectType({ description: 'Reference to a piece of equipment with a quantity.' })
export class EquipmentRef {
  @field({ description: 'The specific equipment referenced.', type: T.Ref(Equipment) })
  public equipment!: APIReference

  @field({ description: 'The quantity of the referenced equipment.', type: T.Int })
  public quantity!: number
}

@ObjectType({ description: 'A special feature granted by the background.' })
class BackgroundFeature {
  @field({ description: 'The name of the background feature.', type: T.String })
  public name!: string

  @field({ description: 'The description of the background feature.', type: T.StringList })
  public desc!: string[]
}

@ObjectType({
  description: 'Represents a character background providing flavor, proficiencies, and features.'
})
@srdModelOptions('2014-backgrounds')
export class Background {
  @field({
    description: 'The unique identifier for this background (e.g., acolyte).',
    type: T.String
  })
  public index!: string

  @field({ description: 'The name of the background (e.g., Acolyte).', type: T.String })
  public name!: string

  @field({
    description: 'Proficiencies granted by this background at start.',
    type: T.RefList(Proficiency)
  })
  public starting_proficiencies!: APIReference[]

  // Handled by BackgroundResolver
  @field({ type: T.Model(Choice), skipResolver: true })
  public language_options!: Choice

  @field({
    description: 'The canonical path of this resource in the REST API.',
    type: T.String
  })
  public url!: string

  @field({
    description: 'Equipment received when choosing this background.',
    type: T.List(EquipmentRef)
  })
  public starting_equipment!: EquipmentRef[]

  // Handled by BackgroundResolver
  @field({ type: T.List(Choice), skipResolver: true })
  public starting_equipment_options!: Choice[]

  @field({
    description: 'The feature associated with this background.',
    type: T.Model(BackgroundFeature)
  })
  public feature!: BackgroundFeature

  // Handled by BackgroundResolver
  @field({ type: T.Model(Choice), skipResolver: true })
  public personality_traits!: Choice

  // Handled by BackgroundResolver
  @field({ type: T.Model(Choice), skipResolver: true })
  public ideals!: Choice

  // Handled by BackgroundResolver
  @field({ type: T.Model(Choice), skipResolver: true })
  public bonds!: Choice

  // Handled by BackgroundResolver
  @field({ type: T.Model(Choice), skipResolver: true })
  public flaws!: Choice

  @field({ description: 'Timestamp of the last update.', type: T.String })
  public updated_at!: string
}

export type BackgroundDocument = DocumentType<Background>
const BackgroundModel = getModelForClass(Background)

export default BackgroundModel
