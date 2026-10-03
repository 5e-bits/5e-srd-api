import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({ description: 'A state that can affect a creature, such as Blinded or Prone.' })
@srdModelOptions('2024-conditions')
export class Condition2024 {
  @field(T.String, {
    description: 'The unique identifier for this condition (e.g., blinded).',
    required: true,
    index: true
  })
  public index!: string

  @field(T.String, {
    description: 'The name of the condition (e.g., Blinded).',
    required: true,
    index: true
  })
  public name!: string

  @field(T.String, {
    description: 'A description of the effects of the condition.',
    required: true
  })
  public description!: string

  @field(T.String, { required: true, index: true, gql: false })
  public url!: string

  @field(T.String, { description: 'Timestamp of the last update.', required: true, index: true })
  public updated_at!: string
}

export type ConditionDocument = DocumentType<Condition2024>
const ConditionModel = getModelForClass(Condition2024)

export default ConditionModel
