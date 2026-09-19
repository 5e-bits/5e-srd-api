import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, ObjectType } from 'type-graphql'

import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({ description: 'A state that can affect a creature, such as Blinded or Prone.' })
@srdModelOptions('2014-conditions')
export class Condition {
  @Field(() => String, { description: 'The unique identifier for this condition (e.g., blinded).' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'The name of the condition (e.g., Blinded).' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => [String], { description: 'A description of the effects of the condition.' })
  @prop({ required: true, type: () => [String] })
  public desc!: string[]

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type ConditionDocument = DocumentType<Condition>
const ConditionModel = getModelForClass(Condition)

export default ConditionModel
