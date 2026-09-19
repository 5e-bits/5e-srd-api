import { getModelForClass, index, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import mongoose from 'mongoose'
import { Field, Float, ObjectType } from 'type-graphql'

import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({
  description: 'A 2014 translation document containing translated fields for an entity.'
})
@srdModelOptions('2014-translations')
@index({ source_collection: 1, source_index: 1, lang: 1 }, { unique: true })
export class Translation2014 {
  @Field(() => String)
  @prop({ required: true, type: () => String })
  public source_index!: string

  @Field(() => String)
  @prop({ required: true, type: () => String })
  public source_collection!: string

  @Field(() => String)
  @prop({ required: true, type: () => String })
  public lang!: string

  @prop({ required: true, type: mongoose.Schema.Types.Mixed })
  public fields!: Record<string, unknown>

  @Field(() => Float)
  @prop({ required: true, type: () => Number })
  public completeness!: number

  @prop({ required: true, type: () => String })
  public updated_at!: string
}

export type Translation2014Document = DocumentType<Translation2014>
const Translation2014Model = getModelForClass(Translation2014)

export default Translation2014Model
