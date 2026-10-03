import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({
  description: 'A subspecies trait reference including the level at which it is gained.'
})
export class SubspeciesTrait {
  @field(T.String, { description: 'The unique identifier for this trait.', required: true })
  public index!: string

  @field(T.String, { description: 'The name of this trait.', required: true })
  public name!: string

  @field(T.String, { description: 'The URL of the trait resource.', required: true })
  public url!: string

  @field(T.Model(() => Number), {
    description: 'The character level at which this trait is gained.',
    required: true
  })
  public level!: number
}

@ObjectType({
  description: 'A subspecies representing a variant of a playable species in D&D 5e 2024.'
})
@srdModelOptions('2024-subspecies')
export class Subspecies2024 {
  @field(T.String, {
    description: 'The unique identifier for this subspecies.',
    required: true,
    index: true
  })
  public index!: string

  @field(T.String, { description: 'The name of the subspecies.', required: true, index: true })
  public name!: string

  @field(T.String, { description: 'The URL of the API resource.', required: true })
  public url!: string

  @field(T.Model(() => APIReference), {
    description: 'The parent species of this subspecies.',
    required: true
  })
  public species!: APIReference

  @field(T.List(() => SubspeciesTrait), {
    description: 'Traits granted by this subspecies.',
    required: true
  })
  public traits!: SubspeciesTrait[]

  @field(T.Model(() => APIReference), {
    description: 'The damage type associated with this subspecies (Dragonborn only).',
    gql: { nullable: true }
  })
  public damage_type?: APIReference

  @field(T.String, { required: true, gql: false })
  public updated_at!: string
}

export type SubspeciesDocument = DocumentType<Subspecies2024>
const Subspecies2024Model = getModelForClass(Subspecies2024)

export default Subspecies2024Model
