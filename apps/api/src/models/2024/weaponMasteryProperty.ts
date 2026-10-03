import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({
  description:
    'Each weapon has a mastery property, which is usable only by a character who has a feature, such as Weapon Mastery, that unlocks the property for the character'
})
@srdModelOptions('2024-weapon-mastery-properties')
export class WeaponMasteryProperty2024 {
  @field(T.String, {
    description: 'A description of the weapon mastery property.',
    required: true,
    index: true
  })
  public description!: string

  @field(T.String, {
    description: 'The unique identifier for this mastery property (e.g., cleave).',
    required: true,
    index: true
  })
  public index!: string

  @field(T.String, {
    description: 'The name of the mastery property (e.g., Cleave).',
    required: true,
    index: true
  })
  public name!: string

  @field(T.String, { required: true, index: true, gql: false })
  public url!: string

  @field(T.String, { description: 'Timestamp of the last update.', required: true, index: true })
  public updated_at!: string
}

export type WeaponMasteryPropertyDocument = DocumentType<WeaponMasteryProperty2024>
const WeaponMasteryPropertyModel = getModelForClass(WeaponMasteryProperty2024)

export default WeaponMasteryPropertyModel
