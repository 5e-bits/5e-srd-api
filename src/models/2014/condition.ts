import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { srdModelOptions } from '@/util/modelOptions'

@srdModelOptions('2014-conditions')
export class Condition {
  @prop({ required: true, index: true })
  public desc!: string[]

  @prop({ required: true, index: true })
  public index!: string

  @prop({ required: true, index: true })
  public name!: string

  @prop({ required: true, index: true })
  public url!: string

  @prop({ required: true, index: true })
  public updated_at!: string
}

export type ConditionDocument = DocumentType<Condition>
const ConditionModel = getModelForClass(Condition)

export default ConditionModel
