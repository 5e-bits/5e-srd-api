import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({ description: "Represents a creature's moral and ethical outlook." })
@srdModelOptions('2014-alignments')
export class Alignment {
  @field(() => T.String, {
    description: 'A brief description of the alignment.',
    required: true,
    index: true
  })
  public desc!: string

  @field(() => T.String, {
    description: 'A shortened representation of the alignment (e.g., LG, CE).',
    required: true,
    index: true
  })
  public abbreviation!: string

  @field(() => T.String, {
    description: 'The unique identifier for this alignment (e.g., lawful-good).',
    required: true,
    index: true
  })
  public index!: string

  @field(() => T.String, {
    description: 'The name of the alignment (e.g., Lawful Good, Chaotic Evil).',
    required: true,
    index: true
  })
  public name!: string

  @field(() => T.String, { required: true, index: true })
  public url!: string

  @field(() => T.String, {
    description: 'Timestamp of the last update.',
    required: true,
    index: true
  })
  public updated_at!: string
}

export type AlignmentDocument = DocumentType<Alignment>
const AlignmentModel = getModelForClass(Alignment)
export default AlignmentModel
