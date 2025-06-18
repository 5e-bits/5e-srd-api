import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { srdModelOptions } from '@/util/modelOptions'
import { field, T } from '@/util/fieldDectorator'

@ObjectType({ description: "Represents a creature's moral and ethical outlook." })
@srdModelOptions('2014-alignments')
export class Alignment {
  @field({ description: 'A brief description of the alignment.', type: T.String })
  public desc!: string

  @field({
    description: 'A shortened representation of the alignment (e.g., LG, CE).',
    type: T.String
  })
  public abbreviation!: string

  @field({
    description: 'The unique identifier for this alignment (e.g., lawful-good).',
    type: T.String
  })
  public index!: string

  @field({
    description: 'The name of the alignment (e.g., Lawful Good, Chaotic Evil).',
    type: T.String
  })
  public name!: string

  @field({
    description: 'The canonical path of this resource in the REST API.',
    type: T.String
  })
  public url!: string

  @field({ description: 'Timestamp of the last update.', type: T.String })
  public updated_at!: string
}

export type AlignmentDocument = DocumentType<Alignment>
const AlignmentModel = getModelForClass(Alignment)
export default AlignmentModel
