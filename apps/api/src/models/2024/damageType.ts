import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({ description: 'Represents a type of damage (e.g., Acid, Bludgeoning, Fire).' })
@srdModelOptions('2024-damage-types')
export class DamageType2024 {
  @field(T.String, {
    description: 'The unique identifier for this damage type (e.g., acid).',
    required: true,
    index: true
  })
  public index!: string

  @field(T.String, {
    description: 'The name of the damage type (e.g., Acid).',
    required: true,
    index: true
  })
  public name!: string

  @field(T.String, { description: 'A description of the damage type.', required: true })
  public description!: string

  @field(T.String, { required: true, index: true, gql: false })
  public url!: string

  @field(T.String, { description: 'Timestamp of the last update.', required: true, index: true })
  public updated_at!: string
}

export type DamageTypeDocument = DocumentType<DamageType2024>
const DamageTypeModel = getModelForClass(DamageType2024)

export default DamageTypeModel
