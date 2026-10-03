import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({ description: 'A 2024 proficiency.' })
@srdModelOptions('2024-proficiencies')
export class Proficiency2024 {
  @field(T.String, {
    description: 'The unique identifier for this proficiency.',
    required: true,
    index: true
  })
  public index!: string

  @field(T.String, { description: 'The name of this proficiency.', required: true, index: true })
  public name!: string

  @field(T.String, {
    description: 'The type of proficiency (e.g., Skills, Tools).',
    required: true,
    index: true
  })
  public type!: string

  @field(T.List(() => APIReference), { required: true, gql: false })
  public backgrounds!: APIReference[]

  @field(T.List(() => APIReference), { required: true, gql: false })
  public classes!: APIReference[]

  @field(T.Model(() => APIReference), {
    description: 'The referenced skill or tool.',
    gql: { nullable: true }
  })
  public reference?: APIReference

  @field(T.String, { required: true, index: true, gql: false })
  public url!: string

  @field(T.String, { description: 'Timestamp of the last update.', required: true, index: true })
  public updated_at!: string
}

export type ProficiencyDocument = DocumentType<Proficiency2024>
const ProficiencyModel = getModelForClass(Proficiency2024)

export default ProficiencyModel
