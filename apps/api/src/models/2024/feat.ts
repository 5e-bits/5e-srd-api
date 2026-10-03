import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

import { Choice } from '../common/choice'

@ObjectType({ description: 'Prerequisites for a 2024 feat.' })
export class FeatPrerequisites2024 {
  @field(T.Int, {
    description: 'Minimum character level required.',
    index: true,
    gql: { nullable: true }
  })
  public minimum_level?: number

  @field(T.String, {
    description: 'Name of a feature (e.g. Spellcasting) required.',
    index: true,
    gql: { nullable: true }
  })
  public feature_named?: string
}

@ObjectType({ description: 'A 2024 feat.' })
@srdModelOptions('2024-feats')
export class Feat2024 {
  @field(T.String, {
    description: 'The unique identifier for this feat.',
    required: true,
    index: true
  })
  public index!: string

  @field(T.String, { description: 'The name of this feat.', required: true, index: true })
  public name!: string

  @field(T.String, { description: 'Description of the feat.', required: true })
  public description!: string

  @field(T.String, {
    description: 'The type of feat (origin, general, fighting-style, epic-boon).',
    required: true,
    index: true
  })
  public type!: string

  @field(T.String, {
    description: 'Repeatability note, if applicable.',
    index: true,
    gql: { nullable: true }
  })
  public repeatable?: string

  @field(T.Model(() => FeatPrerequisites2024), {
    description: 'Static prerequisites.',
    gql: { nullable: true }
  })
  public prerequisites?: FeatPrerequisites2024

  @field(T.Model(() => Choice), { gql: false })
  public prerequisite_options?: Choice

  @field(T.String, { required: true, index: true, gql: false })
  public url!: string

  @field(T.String, { description: 'Timestamp of the last update.', required: true, index: true })
  public updated_at!: string
}

export type FeatDocument = DocumentType<Feat2024>
const FeatModel = getModelForClass(Feat2024)

export default FeatModel
