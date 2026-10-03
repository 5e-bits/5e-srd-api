import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { Choice } from '@/models/common/choice'
import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({
  description: 'A species representing a playable species in D&D 5e 2024.'
})
@srdModelOptions('2024-species')
export class Species2024 {
  @field(T.String, {
    description: 'The unique identifier for this species (e.g., elf).',
    required: true,
    index: true
  })
  public index!: string

  @field(T.String, {
    description: 'The name of the species (e.g., Elf).',
    required: true,
    index: true
  })
  public name!: string

  @field(T.String, { description: 'The URL of the API resource.', required: true })
  public url!: string

  @field(T.String, {
    description: 'The creature type of this species (e.g., Humanoid).',
    required: true
  })
  public type!: string

  @field(T.String, { description: 'The size of this species.', gql: { nullable: true } })
  public size?: string

  @field(T.Model(() => Choice), { gql: false })
  public size_options?: Choice

  @field(T.Model(() => Number), {
    description: 'The base walking speed of this species in feet.',
    required: true
  })
  public speed!: number

  @field(T.List(() => APIReference), {
    description: 'Traits granted by this species.',
    gql: { nullable: true }
  })
  public traits?: APIReference[]

  @field(T.List(() => APIReference), {
    description: 'Subspecies available for this species.',
    gql: { nullable: true }
  })
  public subspecies?: APIReference[]

  @field(T.String, { required: true, gql: false })
  public updated_at!: string
}

export type SpeciesDocument = DocumentType<Species2024>
const Species2024Model = getModelForClass(Species2024)

export default Species2024Model
