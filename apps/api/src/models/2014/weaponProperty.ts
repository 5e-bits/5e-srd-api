import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({
  description: 'A property that can be applied to a weapon, modifying its use or characteristics.'
})
@srdModelOptions('2014-weapon-properties')
export class WeaponProperty {
  @field(T.List(T.String), {
    description: 'A description of the weapon property.',
    required: true,
    index: true
  })
  public desc!: string[]

  @field(T.String, {
    description: 'The unique identifier for this property (e.g., versatile).',
    required: true,
    index: true
  })
  public index!: string

  @field(T.String, {
    description: 'The name of the property (e.g., Versatile).',
    required: true,
    index: true
  })
  public name!: string

  @field(T.String, { required: true, index: true, gql: false })
  public url!: string

  @field(T.String, { description: 'Timestamp of the last update.', required: true, index: true })
  public updated_at!: string
}

export type WeaponPropertyDocument = DocumentType<WeaponProperty>
const WeaponPropertyModel = getModelForClass(WeaponProperty)

export default WeaponPropertyModel
