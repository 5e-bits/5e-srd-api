import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({
  description: 'A property that can be applied to a weapon, modifying its use or characteristics.'
})
@srdModelOptions('2024-weapon-properties')
export class WeaponProperty2024 {
  @field(T.String, {
    description: 'A description of the weapon property.',
    required: true,
    index: true
  })
  public description!: string

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

export type WeaponPropertyDocument = DocumentType<WeaponProperty2024>
const WeaponPropertyModel = getModelForClass(WeaponProperty2024)

export default WeaponPropertyModel
