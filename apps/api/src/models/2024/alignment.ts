import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({
  description: "An alignment representing a character's moral and ethical beliefs."
})
@srdModelOptions('2024-alignments')
export class Alignment2024 {
  @field(T.String, { description: 'A description of the alignment.', required: true, index: true })
  public description!: string

  @field(T.String, {
    description: 'A shortened representation of the alignment (e.g., LG, CE).',
    required: true,
    index: true
  })
  public abbreviation!: string

  @field(T.String, {
    description: 'The unique identifier for this alignment (e.g., lawful-good).',
    required: true,
    index: true
  })
  public index!: string

  @field(T.String, {
    description: 'The name of the alignment (e.g., Lawful Good, Chaotic Evil).',
    required: true,
    index: true
  })
  public name!: string

  @field(T.String, { required: true, index: true, gql: false })
  public url!: string

  @field(T.String, { description: 'Timestamp of the last update.', required: true, index: true })
  public updated_at!: string
}

export type AlignmentDocument = DocumentType<Alignment2024>
const AlignmentModel = getModelForClass(Alignment2024)

export default AlignmentModel
