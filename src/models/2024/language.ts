import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, ObjectType } from 'type-graphql'

import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({ description: 'Represents a language spoken in the D&D world.' })
@srdModelOptions('2024-languages')
export class Language2024 {
  @Field(() => String, { description: 'The unique identifier for this language (e.g., draconic).' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'The name of the language (e.g., Draconic).' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => Boolean, { description: 'Whether the language is rare.' })
  @prop({ required: true, index: true, type: () => Boolean })
  public is_rare!: boolean

  @Field(() => String, { description: 'A note about the language.' })
  @prop({ required: true, index: true, type: () => String })
  public note!: string

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type LanguageDocument = DocumentType<Language2024>
const LanguageModel = getModelForClass(Language2024)

export default LanguageModel
