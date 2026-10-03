import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { Choice } from '@/models/common/choice'
import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

import { Equipment } from './equipment'
import { Proficiency } from './proficiency'

@ObjectType({ description: 'Reference to a piece of equipment with a quantity.' })
export class EquipmentRef {
  @field(T.Ref(() => Equipment), { description: 'The specific equipment referenced.' })
  public equipment!: APIReference

  @field(T.Int, {
    description: 'The quantity of the referenced equipment.',
    required: true,
    index: true
  })
  public quantity!: number
}

@ObjectType({ description: 'A special feature granted by the background.' })
class BackgroundFeature {
  @field(T.String, {
    description: 'The name of the background feature.',
    required: true,
    index: true
  })
  public name!: string

  @field(T.List(T.String), {
    description: 'The description of the background feature.',
    required: true,
    index: true
  })
  public desc!: string[]
}

@ObjectType({
  description: 'Represents a character background providing flavor, proficiencies, and features.'
})
@srdModelOptions('2014-backgrounds')
export class Background {
  @field(T.String, {
    description: 'The unique identifier for this background (e.g., acolyte).',
    required: true,
    index: true
  })
  public index!: string

  @field(T.String, {
    description: 'The name of the background (e.g., Acolyte).',
    required: true,
    index: true
  })
  public name!: string

  @field(T.RefList(() => Proficiency), {
    description: 'Proficiencies granted by this background at start.'
  })
  public starting_proficiencies!: APIReference[]

  // Handled by BackgroundResolver
  @field(T.Model(() => Choice), { gql: false })
  public language_options!: Choice

  @field(T.String, { required: true, index: true, gql: false })
  public url!: string

  @field(T.List(() => EquipmentRef), {
    description: 'Equipment received when choosing this background.'
  })
  public starting_equipment!: EquipmentRef[]

  // Handled by BackgroundResolver
  @field(T.List(() => Choice), { index: true, gql: false })
  public starting_equipment_options!: Choice[]

  @field(T.Model(() => BackgroundFeature), {
    description: 'The feature associated with this background.'
  })
  public feature!: BackgroundFeature

  // Handled by BackgroundResolver
  @field(T.Model(() => Choice), { gql: false })
  public personality_traits!: Choice

  // Handled by BackgroundResolver
  @field(T.Model(() => Choice), { gql: false })
  public ideals!: Choice

  // Handled by BackgroundResolver
  @field(T.Model(() => Choice), { gql: false })
  public bonds!: Choice

  // Handled by BackgroundResolver
  @field(T.Model(() => Choice), { gql: false })
  public flaws!: Choice

  @field(T.String, { description: 'Timestamp of the last update.', required: true, index: true })
  public updated_at!: string
}

export type BackgroundDocument = DocumentType<Background>
const BackgroundModel = getModelForClass(Background)

export default BackgroundModel
