import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, ObjectType } from 'type-graphql'

import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({ description: 'Represents a type of damage (e.g., Acid, Bludgeoning, Fire).' })
@srdModelOptions('2014-damage-types')
export class DamageType {
  @Field(() => String, { description: 'The unique identifier for this damage type (e.g., acid).' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'The name of the damage type (e.g., Acid).' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => [String], { description: 'A description of the damage type.' })
  @prop({ required: true, type: () => [String] })
  public desc!: string[]

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type DamageTypeDocument = DocumentType<DamageType>
const DamageTypeModel = getModelForClass(DamageType)

export default DamageTypeModel
