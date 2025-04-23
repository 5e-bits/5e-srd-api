import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { srdModelOptions } from '@/util/modelOptions'
import { ObjectType, Field } from 'type-graphql'

@ObjectType({ description: 'Properties that weapons can have (e.g., Ammunition, Finesse, Heavy).' })
@srdModelOptions('2014-weapon-properties')
export class WeaponProperty {
  @Field(() => [String], { description: 'Description of the weapon property.' })
  @prop({ required: true, index: true, type: () => [String], default: [] })
  public desc!: string[]

  @Field(() => String, { description: 'The unique identifier for this property (e.g., finesse).' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'The name of the weapon property.' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type WeaponPropertyDocument = DocumentType<WeaponProperty>
const WeaponPropertyModel = getModelForClass(WeaponProperty)

export default WeaponPropertyModel
