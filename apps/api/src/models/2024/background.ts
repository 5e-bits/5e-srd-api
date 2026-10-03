import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { Choice } from '@/models/common/choice'
import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({ description: 'A reference to a feat with an optional note.' })
export class BackgroundFeatReference {
  @field(T.String, { required: true })
  public index!: string

  @field(T.String, { required: true })
  public name!: string

  @field(T.String, { required: true })
  public url!: string

  @field(T.String, { gql: { nullable: true } })
  public note?: string
}

@ObjectType({ description: 'A 2024 character background.' })
@srdModelOptions('2024-backgrounds')
export class Background2024 {
  @field(T.String, {
    description: 'The unique identifier for this background.',
    required: true,
    index: true
  })
  public index!: string

  @field(T.String, { description: 'The name of this background.', required: true, index: true })
  public name!: string

  @field(T.List(() => APIReference), { required: true, gql: false })
  public ability_scores!: APIReference[]

  @field(T.Model(() => BackgroundFeatReference), { required: true, gql: false })
  public feat!: BackgroundFeatReference

  @field(T.List(() => APIReference), { required: true, gql: false })
  public proficiencies!: APIReference[]

  @field(T.List(() => Choice), { gql: false })
  public proficiency_choices?: Choice[]

  @field(T.List(() => Choice), { gql: false })
  public equipment_options?: Choice[]

  @field(T.String, { required: true, index: true, gql: false })
  public url!: string

  @field(T.String, { description: 'Timestamp of the last update.', required: true, index: true })
  public updated_at!: string
}

export type BackgroundDocument = DocumentType<Background2024>
const BackgroundModel = getModelForClass(Background2024)

export default BackgroundModel
