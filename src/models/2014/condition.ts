import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { srdModelOptions } from '@/util/modelOptions'
import { ObjectType, Field } from 'type-graphql'

@ObjectType({
  description: 'A specific condition that can affect a creature (e.g., Blinded, Prone).'
})
@srdModelOptions('2014-conditions')
export class Condition {
  @Field(() => [String], { description: 'Description of the condition' })
  @prop({ required: true, index: true, type: () => [String] })
  public desc!: string[]

  @Field(() => String, { description: 'The unique identifier for this condition (e.g., blinded).' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'The name of the condition.' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type ConditionDocument = DocumentType<Condition>
const ConditionModel = getModelForClass(Condition)

export default ConditionModel
