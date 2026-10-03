import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({
  description: 'A school of magic, representing a particular tradition like Evocation or Illusion.'
})
@srdModelOptions('2024-magic-schools')
export class MagicSchool2024 {
  @field(T.String, { description: 'A brief description of the school of magic.', index: true })
  public description!: string

  @field(T.String, {
    description: 'The unique identifier for this school (e.g., evocation).',
    required: true,
    index: true
  })
  public index!: string

  @field(T.String, {
    description: 'The name of the school (e.g., Evocation).',
    required: true,
    index: true
  })
  public name!: string

  @field(T.String, { required: true, index: true, gql: false })
  public url!: string

  @field(T.String, { description: 'Timestamp of the last update.', required: true, index: true })
  public updated_at!: string
}

export type MagicSchoolDocument = DocumentType<MagicSchool2024>
const MagicSchoolModel = getModelForClass(MagicSchool2024)

export default MagicSchoolModel
