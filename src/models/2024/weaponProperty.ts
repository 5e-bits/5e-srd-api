import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, ObjectType } from 'type-graphql'

import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({
  description: 'A property that can be applied to a weapon, modifying its use or characteristics.'
})
@srdModelOptions('2024-weapon-properties')
export class WeaponProperty2024 {
  @Field(() => String, { description: 'A description of the weapon property.' })
  @prop({ required: true, index: true, type: () => String })
  public description!: string

  @Field(() => String, {
    description: 'The unique identifier for this property (e.g., versatile).'
  })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'The name of the property (e.g., Versatile).' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type WeaponPropertyDocument = DocumentType<WeaponProperty2024>
const WeaponPropertyModel = getModelForClass(WeaponProperty2024)

export default WeaponPropertyModel
