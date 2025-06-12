import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, ObjectType } from 'type-graphql'

import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({
  description: "An alignment representing a character's moral and ethical beliefs."
})
@srdModelOptions('2024-alignments')
export class Alignment2024 {
  @Field(() => String, { description: 'A description of the alignment.' })
  @prop({ required: true, index: true, type: () => String })
  public description!: string

  @Field(() => String, {
    description: 'A shortened representation of the alignment (e.g., LG, CE).'
  })
  @prop({ required: true, index: true, type: () => String })
  public abbreviation!: string

  @Field(() => String, {
    description: 'The unique identifier for this alignment (e.g., lawful-good).'
  })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, {
    description: 'The name of the alignment (e.g., Lawful Good, Chaotic Evil).'
  })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type AlignmentDocument = DocumentType<Alignment2024>
const AlignmentModel = getModelForClass(Alignment2024)

export default AlignmentModel
