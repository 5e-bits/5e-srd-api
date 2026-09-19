import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, Int, ObjectType } from 'type-graphql'

import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({ description: 'A 2024 poison.' })
@srdModelOptions('2024-poisons')
export class Poison2024 {
  @Field(() => String, { description: 'The unique identifier for this poison.' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'The name of this poison.' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => Int, { description: 'The poison cost in gold pieces.' })
  @prop({ required: true, index: true, type: () => Number })
  public cost!: number

  @Field(() => String, { description: 'The poison delivery type.' })
  @prop({ required: true, index: true, type: () => String })
  public type!: string

  @Field(() => String, { description: 'Description of the poison.' })
  @prop({ required: true, type: () => String })
  public description!: string

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type Poison2024Document = DocumentType<Poison2024>
const Poison2024Model = getModelForClass(Poison2024)

export default Poison2024Model
