import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { Choice } from '@/models/common/choice'
import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({
  description: 'A trait granted by a species or subspecies in D&D 5e 2024.'
})
@srdModelOptions('2024-traits')
export class Trait2024 {
  @field(T.String, {
    description: 'The unique identifier for this trait (e.g., darkvision).',
    required: true,
    index: true
  })
  public index!: string

  @field(T.String, {
    description: 'The name of the trait (e.g., Darkvision).',
    required: true,
    index: true
  })
  public name!: string

  @field(T.String, { description: 'The URL of the API resource.', required: true })
  public url!: string

  @field(T.String, { description: 'A description of the trait.', required: true })
  public description!: string

  @field(T.List(() => APIReference), {
    description: 'The species that grant this trait.',
    required: true
  })
  public species!: APIReference[]

  @field(T.List(() => APIReference), {
    description: 'The subspecies that grant this trait.',
    gql: { nullable: true }
  })
  public subspecies?: APIReference[]

  @field(T.Model(() => Choice), { gql: false })
  public proficiency_choices?: Choice

  @field(T.Model(() => Number), {
    description: 'Speed override granted by this trait.',
    gql: { nullable: true }
  })
  public speed?: number

  @field(T.String, { required: true, gql: false })
  public updated_at!: string
}

export type TraitDocument = DocumentType<Trait2024>
const Trait2024Model = getModelForClass(Trait2024)

export default Trait2024Model
