import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { srdModelOptions } from '@/util/modelOptions'
import { ObjectType, Field } from 'type-graphql'

@ObjectType({ description: 'Languages spoken in the D&D world (e.g., Common, Elvish).' })
@srdModelOptions('2014-languages')
export class Language {
  @Field(() => String, { description: 'Brief description of the language.', nullable: true })
  @prop({ required: false, index: true, type: () => [String] })
  public desc?: string

  @Field(() => String, { description: 'The unique identifier for this language (e.g., common).' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => String, { description: 'The name of the language.' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => String, {
    nullable: true,
    description: 'The script used to write the language (e.g., Common, Elvish).'
  })
  @prop({ index: true, type: () => String })
  public script?: string | null

  @Field(() => String, { description: 'The type of language (e.g., Standard, Exotic).' })
  @prop({ required: true, index: true, type: () => String })
  public type!: string

  @Field(() => [String], { description: 'Typical speakers of the language.' })
  @prop({ type: () => [String], index: true, default: [] })
  public typical_speakers!: string[]

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type LanguageDocument = DocumentType<Language>
const LanguageModel = getModelForClass(Language)

export default LanguageModel
