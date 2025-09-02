import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { field, T } from '@/util/fieldDectorator'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({ description: 'A state that can affect a creature, such as Blinded or Prone.' })
@srdModelOptions('2014-conditions')
export class Condition {
  @field(() => T.String, {
    description: 'The unique identifier for this condition (e.g., blinded).'
  })
  public index!: string

  @field(() => T.String, { description: 'The name of the condition (e.g., Blinded).' })
  public name!: string

  @field(() => T.List(String), { description: 'A description of the effects of the condition.' })
  public desc!: string[]

  @field(() => T.String, { description: 'The canonical path of this resource in the REST API.' })
  public url!: string

  @field(() => T.String, { description: 'Timestamp of the last update.' })
  public updated_at!: string
}

export type ConditionDocument = DocumentType<Condition>
const ConditionModel = getModelForClass(Condition)

export default ConditionModel
