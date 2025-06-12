import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, ObjectType } from 'type-graphql'

import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({
  description:
    'Each weapon has a mastery property, which is usable only by a character who has a feature, such as Weapon Mastery, that unlocks the property for the character'
})
@srdModelOptions('2024-weapon-mastery-properties')
export class WeaponMasteryProperty2024 {
  @Field(() => String, { description: 'A description of the weapon mastery property.' })
  @prop({ required: true, index: true, type: () => String })
  public description!: string

  @Field(() => String, {
    description: 'The unique identifier for this mastery property (e.g., cleave).'
  })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'The name of the mastery property (e.g., Cleave).' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type WeaponMasteryPropertyDocument = DocumentType<WeaponMasteryProperty2024>
const WeaponMasteryPropertyModel = getModelForClass(WeaponMasteryProperty2024)

export default WeaponMasteryPropertyModel
