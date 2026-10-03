import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { Class2024 } from '@/models/2024/class'
import { APIReference } from '@/models/common/apiReference'
import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({ description: 'A feature granted by a 2024 subclass at a specific level.' })
export class SubclassFeature2024 {
  @field(T.String, { description: 'The name of the subclass feature.', required: true })
  public name!: string

  @field(T.Int, {
    description: 'The character level at which this feature is gained.',
    required: true
  })
  public level!: number

  @field(T.String, { description: 'A description of the subclass feature.', required: true })
  public description!: string
}

@ObjectType({ description: 'A subclass representing a specialization of a class in D&D 5e 2024.' })
@srdModelOptions('2024-subclasses')
export class Subclass2024 {
  @field(T.String, {
    description: 'The unique identifier for this subclass.',
    required: true,
    index: true
  })
  public index!: string

  @field(T.String, { description: 'The name of the subclass.', required: true, index: true })
  public name!: string

  @field(T.Ref(() => Class2024), {
    description: 'The parent class for this subclass.',
    required: true
  })
  public class!: APIReference

  @field(T.String, { description: 'A brief summary of the subclass.', required: true })
  public summary!: string

  @field(T.String, { description: 'A full description of the subclass.', required: true })
  public description!: string

  @field(T.List(() => SubclassFeature2024), {
    description: 'Features granted by this subclass.',
    required: true
  })
  public features!: SubclassFeature2024[]

  @field(T.String, { required: true, index: true, gql: false })
  public url!: string

  @field(T.String, { description: 'Timestamp of the last update.', required: true, index: true })
  public updated_at!: string
}

export type SubclassDocument = DocumentType<Subclass2024>
const SubclassModel = getModelForClass(Subclass2024)

export default SubclassModel
