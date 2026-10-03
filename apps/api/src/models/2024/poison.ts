import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({ description: 'A 2024 poison.' })
@srdModelOptions('2024-poisons')
export class Poison2024 {
  @field(T.String, {
    description: 'The unique identifier for this poison.',
    required: true,
    index: true
  })
  public index!: string

  @field(T.String, { description: 'The name of this poison.', required: true, index: true })
  public name!: string

  @field(T.Int, { description: 'The poison cost in gold pieces.', required: true, index: true })
  public cost!: number

  @field(T.String, { description: 'The poison delivery type.', required: true, index: true })
  public type!: string

  @field(T.String, { description: 'Description of the poison.', required: true })
  public description!: string

  @field(T.String, { required: true, index: true, gql: false })
  public url!: string

  @field(T.String, { description: 'Timestamp of the last update.', required: true, index: true })
  public updated_at!: string
}

export type Poison2024Document = DocumentType<Poison2024>
const Poison2024Model = getModelForClass(Poison2024)

export default Poison2024Model
