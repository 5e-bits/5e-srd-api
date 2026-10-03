import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { Class2024 } from '@/models/2024/class'
import { Level2024 } from '@/models/2024/level'
import { Subclass2024 } from '@/models/2024/subclass'
import { APIReference } from '@/models/common/apiReference'
import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({ description: 'A 2024 class or subclass feature.' })
@srdModelOptions('2024-features')
export class Feature2024 {
  @field(T.String, {
    description: 'The unique identifier for this feature.',
    required: true,
    index: true
  })
  public index!: string

  @field(T.String, { description: 'The name of this feature.', required: true, index: true })
  public name!: string

  @field(T.String, { description: 'Description of the feature.', required: true })
  public description!: string

  @field(T.Ref(() => Level2024), {
    description: 'The level at which this feature is gained.',
    required: true
  })
  public level!: APIReference

  @field(T.Ref(() => Class2024), {
    description: 'The class that gains this feature.',
    required: true
  })
  public class!: APIReference

  @field(T.Ref(() => Subclass2024), {
    description: 'The subclass that gains this feature, if applicable.',
    gql: { nullable: true }
  })
  public subclass?: APIReference

  @field(T.String, { required: true, index: true, gql: false })
  public url!: string

  @field(T.String, { description: 'Timestamp of the last update.', required: true, index: true })
  public updated_at!: string
}

export type Feature2024Document = DocumentType<Feature2024>
const Feature2024Model = getModelForClass(Feature2024)

export default Feature2024Model
